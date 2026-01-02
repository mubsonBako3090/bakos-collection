import getClientPromise from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const client = await getClientPromise();
    const db = client.db('bakos-collection');

    const orders = await db
      .collection('orders')
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    return new Response(JSON.stringify(orders), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
