import clientPromise from '@/lib/database';

export async function POST(req) {
  try {
    const { items, total, shippingInfo, status } = await req.json();
    const client = await clientPromise;
    const db = client.db('bakos-collection');

    const order = {
      items,
      total,
      shippingInfo,
      status,
      createdAt: new Date(),
    };

    const result = await db.collection('orders').insertOne(order);
    return new Response(JSON.stringify({ message: 'Order placed', orderId: result.insertedId }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
