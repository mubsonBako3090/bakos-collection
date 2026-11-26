import bcrypt from 'bcryptjs';
import validator from 'validator';
import { getDb } from './database';
import { ApiError } from './http';
import { cleanText } from './validate';

// Case-insensitive lookup so accounts created before emails were lower-cased still work.
const CASE_INSENSITIVE = { locale: 'en', strength: 2 };

export function normalizeEmail(email) {
  return typeof email === 'string' ? email.trim().toLowerCase() : '';
}

export async function findUserByEmail(email) {
  const db = await getDb();
  return db.collection('users').findOne({ email: normalizeEmail(email) }, { collation: CASE_INSENSITIVE });
}

export async function createUser({ name, email, password }) {
  const cleanName = cleanText(name, 100);
  const cleanEmail = normalizeEmail(email);

  if (!cleanName) throw new ApiError(400, 'Please enter your name.');
  if (!validator.isEmail(cleanEmail)) throw new ApiError(400, 'Please enter a valid email address.');
  if (typeof password !== 'string' || password.length < 8) {
    throw new ApiError(400, 'Password must be at least 8 characters.');
  }
  if (password.length > 72) {
    // bcrypt silently ignores everything after 72 bytes
    throw new ApiError(400, 'Password must be 72 characters or fewer.');
  }

  const db = await getDb();
  if (await findUserByEmail(cleanEmail)) {
    throw new ApiError(409, 'An account with this email already exists.');
  }

  try {
    const result = await db.collection('users').insertOne({
      name: cleanName,
      email: cleanEmail,
      password: await bcrypt.hash(password, 10),
      role: 'customer',
      createdAt: new Date(),
    });
    return { id: String(result.insertedId), name: cleanName, email: cleanEmail };
  } catch (err) {
    if (err.code === 11000) throw new ApiError(409, 'An account with this email already exists.');
    throw err;
  }
}
