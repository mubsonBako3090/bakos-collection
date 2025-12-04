import clientPromise from '@/lib/database';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export async function PUT(req) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const updatedData = await req.json();

    const client = await clientPromise;
    const db = client.db('bakos-collection');

    await db.collection('users').updateOne(
      { _id: new ObjectId(decoded.userId) },
      { $set: updatedData }
    );

    return new Response(JSON.stringify({ message: 'Profile updated' }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}
