import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { ObjectId } from 'mongodb';
import { getDb } from './database';
import { ApiError, isObjectId } from './http';

export const COOKIE_NAME = 'token';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

// The JWT lives in an httpOnly cookie so page scripts (and any XSS) can't read it.
export const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: MAX_AGE_SECONDS,
};

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error('JWT_SECRET is missing or too short (use at least 16 characters).');
  }
  return secret;
}

export function signToken(user) {
  return jwt.sign({ userId: String(user._id) }, getSecret(), {
    algorithm: 'HS256',
    expiresIn: MAX_AGE_SECONDS,
  });
}

/** Returns the logged-in user (without the password hash) or null. */
export async function getCurrentUser() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;

  const secret = getSecret(); // config errors should surface, not look like "logged out"
  let payload;
  try {
    payload = jwt.verify(token, secret, { algorithms: ['HS256'] });
  } catch {
    return null;
  }
  if (!isObjectId(payload.userId)) return null;

  const db = await getDb();
  return db
    .collection('users')
    .findOne({ _id: new ObjectId(payload.userId) }, { projection: { password: 0 } });
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new ApiError(401, 'Please log in to continue.');
  return user;
}

/** Role is read from the database on every call, never trusted from the token. */
export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== 'admin') throw new ApiError(403, 'Admin access required.');
  return user;
}

export function publicUser(user) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role || 'customer',
    phone: user.phone || '',
    address: user.address || '',
    city: user.city || '',
    state: user.state || '',
    zip: user.zip || '',
  };
}
