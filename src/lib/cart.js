import { getDb } from './database';
import { ApiError, toObjectId } from './http';

export const MAX_QUANTITY = 99;

const round2 = (n) => Math.round(n * 100) / 100;

/**
 * The cart document only stores { productId, quantity }. Name, price and image
 * are always read from the products collection, so prices can't go stale or be
 * tampered with by the client.
 */
export async function loadCart(userId) {
  const db = await getDb();
  const doc = await db.collection('carts').findOne({ userId });
  const stored = Array.isArray(doc?.items) ? doc.items : [];

  const ids = stored.map((i) => i.productId).filter(Boolean);
  const products = ids.length
    ? await db.collection('products').find({ _id: { $in: ids } }).toArray()
    : [];
  const byId = new Map(products.map((p) => [String(p._id), p]));

  const items = [];
  for (const line of stored) {
    const product = byId.get(String(line.productId));
    if (!product) continue; // product was deleted, so drop the line
    const quantity = Math.min(Math.max(parseInt(line.quantity, 10) || 1, 1), MAX_QUANTITY);
    items.push({
      productId: String(product._id),
      name: product.name,
      price: product.price,
      image: product.image || '',
      category: product.category,
      quantity,
    });
  }

  return {
    items,
    count: items.reduce((n, i) => n + i.quantity, 0),
    total: round2(items.reduce((sum, i) => sum + i.price * i.quantity, 0)),
  };
}

export async function clearCart(userId) {
  const db = await getDb();
  await db.collection('carts').deleteOne({ userId });
}

async function incrementQuantity(carts, userId, productId, now) {
  const result = await carts.updateOne(
    { userId, items: { $elemMatch: { productId, quantity: { $lt: MAX_QUANTITY } } } },
    { $inc: { 'items.$.quantity': 1 }, $set: { updatedAt: now } }
  );
  return result.matchedCount > 0;
}

export async function addToCart(userId, productIdString) {
  const productId = toObjectId(productIdString, 'product id');
  const db = await getDb();

  const product = await db.collection('products').findOne({ _id: productId }, { projection: { _id: 1 } });
  if (!product) throw new ApiError(404, 'Product not found.');

  const carts = db.collection('carts');
  const now = new Date();

  for (let attempt = 0; attempt < 2; attempt++) {
    if (await incrementQuantity(carts, userId, productId, now)) return;

    const existing = await carts.findOne({ userId, 'items.productId': productId }, { projection: { _id: 1 } });
    if (existing) throw new ApiError(400, `You can order at most ${MAX_QUANTITY} of one item.`);

    try {
      await carts.updateOne(
        { userId, 'items.productId': { $ne: productId } },
        {
          $push: { items: { productId, quantity: 1 } },
          $set: { updatedAt: now },
          $setOnInsert: { createdAt: now },
        },
        { upsert: true }
      );
      return;
    } catch (err) {
      // Duplicate key means a parallel request added the item first: loop and increment instead.
      if (err.code !== 11000) throw err;
    }
  }
}

export async function updateCartItem(userId, productIdString, action) {
  const productId = toObjectId(productIdString, 'product id');
  const db = await getDb();
  const carts = db.collection('carts');
  const now = new Date();

  if (action === 'increase') {
    if (!(await incrementQuantity(carts, userId, productId, now))) {
      const existing = await carts.findOne({ userId, 'items.productId': productId }, { projection: { _id: 1 } });
      if (!existing) throw new ApiError(404, 'Item is not in your cart.');
      throw new ApiError(400, `You can order at most ${MAX_QUANTITY} of one item.`);
    }
  } else if (action === 'decrease') {
    const result = await carts.updateOne(
      { userId, items: { $elemMatch: { productId, quantity: { $gt: 1 } } } },
      { $inc: { 'items.$.quantity': -1 }, $set: { updatedAt: now } }
    );
    if (result.matchedCount === 0) {
      await carts.updateOne({ userId }, { $pull: { items: { productId } }, $set: { updatedAt: now } });
    }
  } else if (action === 'remove') {
    await carts.updateOne({ userId }, { $pull: { items: { productId } }, $set: { updatedAt: now } });
  } else {
    throw new ApiError(400, 'Invalid action.');
  }
}
