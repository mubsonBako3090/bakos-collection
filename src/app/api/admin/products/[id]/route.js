import clientPromise from '@/lib/database';
import { ObjectId } from 'mongodb';

export async function DELETE(req, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db('bakos-collection');

    await db.collection('products').deleteOne({ _id: new ObjectId(params.id) });
    return new Response(JSON.stringify({ message: 'Product deleted' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
