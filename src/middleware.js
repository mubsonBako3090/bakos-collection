import { NextResponse } from 'next/server';

// Cheap first gate: send visitors with no session cookie to the login page.
// This is only a convenience redirect. Real authorization happens in the API routes,
// which verify the token and (for admin) the user's role in the database.
export function middleware(req) {
  if (!req.cookies.get('token')) {
    const url = req.nextUrl.clone();
    url.pathname = '/auth/login';
    url.search = `?next=${encodeURIComponent(req.nextUrl.pathname + req.nextUrl.search)}`;
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/user/:path*', '/cart', '/checkout', '/admin/:path*'],
};
