import { requireUser } from '@/lib/auth';
import { clearCart, loadCart } from '@/lib/cart';
import { getDb } from '@/lib/database';
import { ApiError, handleError, json, readJson } from '@/lib/http';
import { validateShipping } from '@/lib/validate';

export const dynamic = 'force-dynamic';

// The logged-in user's own orders.
export async function GET() {
  try {
    const user = await requireUser();
    const db = await getDb();
    const orders = await db
      .collection('orders')
      .find({ userId: String(user._id) })
      .sort({ createdAt: -1 })
      .toArray();
    return json(orders);
  } catch (err) {
    return handleError(err);
  }
}

// Place an order from the *server-side* cart. The client only sends shipping details;
// items, prices and the total are all taken from the database.
export async function POST(req) {
  try {
    const user = await requireUser();
    const body = await readJson(req);
    const shippingInfo = validateShipping(body.shipping);

    const userId = String(user._id);
    const cart = await loadCart(userId);
    if (cart.items.length === 0) throw new ApiError(400, 'Your cart is empty.');

    const order = {
      userId,
      userEmail: user.email,
      userName: user.name,
      items: cart.items.map(({ productId, name, price, image, quantity }) => ({
        productId,
        name,
        price,
        image,
        quantity,
      })),
      total: cart.total,
      shippingInfo,
      status: 'Pending',
      createdAt: new Date(),
    };

    const db = await getDb();
    const result = await db.collection('orders').insertOne(order);
    await clearCart(userId);

    return json({ message: 'Order placed.', orderId: String(result.insertedId) }, 201);
  } catch (err) {
    return handleError(err);
  }
}
