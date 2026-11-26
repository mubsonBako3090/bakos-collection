import { NextResponse } from 'next/server';
import { COOKIE_NAME, cookieOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST() {
  const res = NextResponse.json({ message: 'Logged out.' });
  res.cookies.set(COOKIE_NAME, '', { ...cookieOptions, maxAge: 0 });
  return res;
}
