// src/lib/models/user.js
import clientPromise from '@/lib/database';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';

export async function createUser({ name, email, password }) {
  try {
    const client = await clientPromise;
    const db = client.db('bakos-collection');
    const users = db.collection('users');

    const existingUser = await users.findOne({ email });
    if (existingUser) throw new Error('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await users.insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    return { id: result.insertedId.toString(), name, email };
  } catch (error) {
    console.error('Create user error:', error);
    throw error;
  }
}

export async function findUserByEmail(email) {
  try {
    const client = await clientPromise;
    const db = client.db('bakos-collection');
    return await db.collection('users').findOne({ email });
  } catch (error) {
    console.error('Find user error:', error);
    throw error;
  }
      }
