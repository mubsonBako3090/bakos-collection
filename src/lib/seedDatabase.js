import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function seedDatabase() {
  try {
    await client.connect();
    const db = client.db('bakos-collection');

    // 1️⃣ Update existing users
    const users = await db.collection('users').find({}).toArray();
    for (const user of users) {
      await db.collection('users').updateOne(
        { _id: user._id },
        { 
          $set: {
            address: user.address || '',
            city: user.city || '',
            state: user.state || '',
            zip: user.zip || ''
          }
        }
      );
    }
    console.log('✅ Users collection updated.');

    // 2️⃣ Ensure carts collection exists (empty initially)
    const cartCollections = await db.listCollections({ name: 'carts' }).toArray();
    if (cartCollections.length === 0) {
      await db.createCollection('carts');
      console.log('✅ Carts collection created.');
    }

    // 3️⃣ Ensure orders collection exists (empty initially)
    const ordersCollections = await db.listCollections({ name: 'orders' }).toArray();
    if (ordersCollections.length === 0) {
      await db.createCollection('orders');
      console.log('✅ Orders collection created.');
    }

    console.log('🎉 Database seeding completed.');
  } catch (err) {
    console.error('❌ Error seeding database:', err);
  } finally {
    await client.close();
  }
}

seedDatabase();
