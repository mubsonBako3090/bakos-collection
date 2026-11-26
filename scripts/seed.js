// Usage: npm run seed
// Safe to run repeatedly: it never deletes anything. Products are matched by name.
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI is not set. Put it in .env.local (see .env.example).');
  process.exit(1);
}

const products = [
  { name: 'Abstract Portrait Canvas', price: 45000, category: 'Art', image: '/products/art-abstract-portrait.jpg' },
  { name: 'Sunset Lake Framed Canvas', price: 38000, category: 'Art', image: '/products/art-sunset-lake.webp' },
  { name: 'Colourful Abstract Canvas', price: 30000, category: 'Art', image: '/products/art-colourful-abstract.webp' },
  { name: 'Mountain Lake 4-Panel Canvas', price: 55000, category: 'Art', image: '/products/art-mountain-lake-panels.jpg' },
  { name: 'Gold Abstract 3-Panel Canvas', price: 60000, category: 'Art', image: '/products/art-gold-abstract-panels.jpg' },
  { name: 'Peacock Framed Wall Art', price: 42000, category: 'Art', image: '/products/art-peacock.webp' },
  { name: 'African Woman at Sunset Painting', price: 50000, category: 'Art', image: '/products/art-african-woman.jpeg' },
  { name: 'Tree of Seasons Wall Canvas', price: 48000, category: 'Art', image: '/products/art-tree-of-seasons.jpg' },
  { name: 'Assorted Smartphones', price: 120000, category: 'Phones', image: '/products/phones-assorted.jpg' },
  { name: 'Winter Fashion Lookbook', price: 8000, category: 'Fashion', image: '/products/fashion-lookbook.jpeg' },
];

const client = new MongoClient(uri);
try {
  await client.connect();
  const db = client.db(process.env.MONGODB_DB || 'bakos-collection');

  // Indexes (same as src/lib/database.js)
  await db.collection('users').createIndex({ email: 1 }, { unique: true }).catch((e) => console.warn('users.email index:', e.message));
  await db.collection('carts').createIndex({ userId: 1 }, { unique: true }).catch((e) => console.warn('carts.userId index:', e.message));
  await db.collection('orders').createIndex({ userId: 1, createdAt: -1 });
  await db.collection('products').createIndex({ category: 1 });

  // Older accounts may have mixed-case emails; normalise them so login/register agree.
  let lowered = 0;
  for (const user of await db.collection('users').find({}).toArray()) {
    const email = String(user.email || '').trim().toLowerCase();
    if (email && email !== user.email) {
      try {
        await db.collection('users').updateOne({ _id: user._id }, { $set: { email } });
        lowered++;
      } catch (e) {
        console.warn(`Could not lower-case ${user.email}: ${e.message}`);
      }
    }
    if (!user.role) await db.collection('users').updateOne({ _id: user._id }, { $set: { role: 'customer' } });
  }
  if (lowered) console.log(`Normalised ${lowered} email address(es).`);

  let added = 0;
  for (const p of products) {
    const res = await db.collection('products').updateOne(
      { name: p.name },
      { $setOnInsert: { ...p, createdAt: new Date() } },
      { upsert: true }
    );
    if (res.upsertedCount) added++;
  }
  console.log(`Seed complete. ${added} product(s) added, ${products.length - added} already existed.`);
} finally {
  await client.close();
}
