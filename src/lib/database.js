// src/lib/database.js
import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';

let isConnected = false;

if (!process.env.MONGODB_URI) {
  throw new Error("❌ MONGODB_URI is missing in environment variables");
}

const uri = process.env.MONGODB_URI;

let client;
let clientPromise;

if (!uri) {
  throw new Error("❌ MONGODB_URI is missing in environment variables");
}

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

export default clientPromise;

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
