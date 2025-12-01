import clientPromise from '@/lib/database';
import bcrypt from 'bcryptjs';

export async function createUser({ name, email, password }) {
  const client = await clientPromise;
  const db = client.db('bakos-collection');

  // Check if user already exists
  const existingUser = await db.collection('users').findOne({ email });
  if (existingUser) throw new Error('User already exists');

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await db.collection('users').insertOne({
    name,
    email,
    password: hashedPassword,
    createdAt: new Date()
  });

  return { id: result.insertedId, name, email };
}

export async function findUserByEmail(email) {
  const client = await clientPromise;
  const db = client.db('bakos-collection');

  return await db.collection('users').findOne({ email });
}
