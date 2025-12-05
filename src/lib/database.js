// src/lib/database.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || '';

let client;
let clientPromise = null;

if (uri) {
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }
} else {
  // Don't throw during module import — this can run during build where env vars
  // may not be available. Log a warning instead; runtime calls should still
  // handle the missing URI where appropriate.
  console.warn('MONGODB_URI is not set. Database client will not be initialized.');
}

export default clientPromise;

// For compatibility with routes that use connectDB
export const connectDB = async () => {
  return await clientPromise;
};

export async function connectDB() {
  if (isConnected) {
    console.log("🔵 Using existing MongoDB connection");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "bakos_collection",
    });

    isConnected = conn.connections[0].readyState === 1;

    console.log("🟢 MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw new Error("Failed to connect to MongoDB");
  }
}
