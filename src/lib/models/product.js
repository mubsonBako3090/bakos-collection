import clientPromise from '@/lib/database';

export async function createProduct({ name, price, category, image }) {
  const client = await clientPromise;
  const db = client.db('bakos-collection');

  const result = await db.collection('products').insertOne({
    name,
    price,
    category,
    image,
    createdAt: new Date()
  });

  return { id: result.insertedId, name, price, category, image };
}

export async function getAllProducts() {
  const client = await clientPromise;
  const db = client.db('bakos-collection');

  return await db.collection('products').find().sort({ createdAt: -1 }).toArray();
}

export async function getProductById(id) {
  const { ObjectId } = await import('mongodb');
  const client = await clientPromise;
  const db = client.db('bakos-collection');

  return await db.collection('products').findOne({ _id: new ObjectId(id) });
}

export async function getProductsByCategory(category) {
  const client = await clientPromise;
  const db = client.db('bakos-collection');

  return await db.collection('products').find({ category }).sort({ createdAt: -1 }).toArray();
}
