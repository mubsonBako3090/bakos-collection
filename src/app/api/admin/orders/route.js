import clientPromise from '@/lib/database';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('bakos-collection');

    const orders = await db.collection('orders').find().sort({ createdAt: -1 }).toArray();
    return new Response(JSON.stringify(orders), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
