// src/lib/database.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || '';

let client;
let clientPromise = null;

if (uri) {
  if (process.env.NODE_ENV === 'development') {
    // Use global cache in development to avoid multiple connections
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // Use a new client in production
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }
} else {
  console.warn('⚠️ Warning: MONGODB_URI is not set.');
}

export default clientPromise;

// For compatibility with connectDB() calls in API routes
export async function connectDB() {
  if (!clientPromise) {
    throw new Error('❌ Cannot connect: MONGODB_URI is missing.');
  }
  return await clientPromise;
}
