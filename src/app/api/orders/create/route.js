import clientPromise from '@/lib/database';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export async function POST(req) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { cart, shipping } = await req.json();
    if (!cart || cart.length === 0) return new Response(JSON.stringify({ error: 'Cart is empty' }), { status: 400 });

    const client = await clientPromise;
    const db = client.db('bakos-collection');

    const order = {
      userId: decoded.userId,
      items: cart,
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      shippingInfo: { ...shipping, userId: decoded.userId },
      status: 'Pending',
      createdAt: new Date()
    };

    const result = await db.collection('orders').insertOne(order);

    // Optionally, clear user's cart
    await db.collection('carts').deleteOne({ userId: decoded.userId });

    return new Response(JSON.stringify({ message: 'Order created', orderId: result.insertedId }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}
