import { MongoClient } from 'mongodb';

const DB_NAME = process.env.MONGODB_DB || 'bakos-collection';

// Keep one connection for the whole process. Using globalThis stops Next.js
// dev-mode hot reloads from opening a new connection on every file save.
const state = (globalThis._bakosMongo ??= { promise: null, indexed: false });

async function ensureIndexes(db) {
  try {
    await Promise.all([
      db.collection('users').createIndex({ email: 1 }, { unique: true }),
      db.collection('carts').createIndex({ userId: 1 }, { unique: true }),
      db.collection('orders').createIndex({ userId: 1, createdAt: -1 }),
      db.collection('products').createIndex({ category: 1 }),
    ]);
  } catch (err) {
    // e.g. old data already contains duplicates. Don't take the site down for it.
    console.warn('Could not create MongoDB indexes:', err.message);
  }
}

export async function getDb() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined');
  }

  if (!state.promise) {
    const client = new MongoClient(process.env.MONGODB_URI);
    state.promise = client.connect().catch((err) => {
      state.promise = null; // allow a retry on the next request
      throw err;
    });
  }

  const client = await state.promise;
  const db = client.db(DB_NAME);

  if (!state.indexed) {
    state.indexed = true;
    await ensureIndexes(db);
  }
  return db;
}
