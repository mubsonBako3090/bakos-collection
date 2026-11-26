import { getDb } from './database';
import { ApiError, isObjectId, toObjectId } from './http';
import { findCategory } from './categories';
import { cleanText } from './validate';

/** Validates admin input for creating/updating a product. */
export function validateProductInput(body) {
  const name = cleanText(body?.name, 120);
  const price = Number(body?.price);
  const category = findCategory(body?.category);
  const image = cleanText(body?.image, 300);

  if (!name) throw new ApiError(400, 'Product name is required.');
  if (!Number.isFinite(price) || price <= 0 || price > 1_000_000_000) {
    throw new ApiError(400, 'Price must be a number greater than 0.');
  }
  if (!category) throw new ApiError(400, 'Please choose a valid category.');
  if (image && !/^(\/|https?:\/\/)/.test(image)) {
    throw new ApiError(400, 'Image must be a path starting with / or a full http(s) URL.');
  }

  return { name, price: Math.round(price * 100) / 100, category: category.name, image };
}

export async function listProducts({ category, limit } = {}) {
  const db = await getDb();
  const filter = category ? { category } : {};
  let cursor = db.collection('products').find(filter).sort({ createdAt: -1, _id: -1 });
  if (limit) cursor = cursor.limit(limit);
  return cursor.toArray();
}

export async function getProductById(id) {
  if (!isObjectId(id)) return null;
  const db = await getDb();
  return db.collection('products').findOne({ _id: toObjectId(id) });
}

export async function createProduct(input) {
  const db = await getDb();
  const doc = { ...input, createdAt: new Date() };
  const result = await db.collection('products').insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function updateProduct(id, input) {
  const db = await getDb();
  const result = await db
    .collection('products')
    .findOneAndUpdate(
      { _id: toObjectId(id, 'product id') },
      { $set: { ...input, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
  return result; // null when not found (mongodb driver v6 returns the document)
}

export async function deleteProduct(id) {
  const db = await getDb();
  const result = await db.collection('products').deleteOne({ _id: toObjectId(id, 'product id') });
  return result.deletedCount > 0;
}
