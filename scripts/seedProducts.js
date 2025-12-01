import clientPromise from '@/lib/database';

async function seedProducts() {
  const client = await clientPromise;
  const db = client.db('bakos-collection');

  const products = [
    { name: 'Premium Art Piece', price: 15000, category: 'Art', image: '/images/art1.webp' },
    { name: 'Designer Fashion', price: 8000, category: 'Fashion', image: '/images/fashion1.webp' },
    { name: 'Smartphone', price: 120000, category: 'Phones', image: '/images/phone1.webp' },
    { name: 'Digital Artwork', price: 5000, category: 'Digital Assets', image: '/images/digital1.webp' },
    { name: 'Game Item Pack', price: 2000, category: 'Game Items', image: '/images/game1.webp' }
  ];

  await db.collection('products').deleteMany({});
  await db.collection('products').insertMany(products);

  console.log('Seeder finished successfully.');
  process.exit(0);
}

seedProducts();
