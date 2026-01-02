// src/lib/database.js
import { MongoClient } from 'mongodb';

let client;
let clientPromise;

async function getClientPromise() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined');
  }

  if (clientPromise) return clientPromise;

  client = new MongoClient(process.env.MONGODB_URI);

  clientPromise = client.connect();
  return clientPromise;
}

export default getClientPromise;
