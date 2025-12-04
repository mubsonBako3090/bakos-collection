import clientPromise from '@/lib/database';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export async function GET(req) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const client = await clientPromise;
    const db = client.db('bakos-collection');

    const userCart = await db.collection('carts').findOne({ userId: decoded.userId });
    return new Response(JSON.stringify(userCart?.items || []), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 401 });
  }
}

export async function POST(req) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { items } = await req.json();

    const client = await clientPromise;
    const db = client.db('bakos-collection');

    await db.collection('carts').updateOne(
      { userId: decoded.userId },
      { $set: { items } },
      { upsert: true }
    );

    return new Response(JSON.stringify({ message: 'Cart updated' }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}
