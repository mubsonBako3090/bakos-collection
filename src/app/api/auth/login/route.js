import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { COOKIE_NAME, cookieOptions, publicUser, signToken } from '@/lib/auth';
import { ApiError, handleError, readJson } from '@/lib/http';
import { findUserByEmail } from '@/lib/users';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { email, password } = await readJson(req);
    if (typeof email !== 'string' || typeof password !== 'string') {
      throw new ApiError(400, 'Email and password are required.');
    }

    const user = await findUserByEmail(email);
    // Same message for "no such user" and "wrong password" so emails can't be probed.
    const ok = user ? await bcrypt.compare(password, user.password) : false;
    if (!ok) throw new ApiError(401, 'Invalid email or password.');

    const res = NextResponse.json({ user: publicUser(user) });
    res.cookies.set(COOKIE_NAME, signToken(user), cookieOptions);
    return res;
  } catch (err) {
    return handleError(err);
  }
}
