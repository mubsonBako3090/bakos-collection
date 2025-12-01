import clientPromise from '@/lib/database';

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db('bakos-collection');
    const collections = await db.listCollections().toArray();

    return new Response(JSON.stringify({
      message: 'MongoDB connected successfully!',
      collections: collections.map(c => c.name)
    }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({
      message: 'MongoDB connection failed',
      error: error.message
    }), { status: 500 });
  }
}
