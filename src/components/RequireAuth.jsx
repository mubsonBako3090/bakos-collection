'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

/** Wrap a page: redirects guests to login (and non-admins away when admin is set). */
export default function RequireAuth({ admin = false, children }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      const here = window.location.pathname + window.location.search;
      router.replace(`/auth/login?next=${encodeURIComponent(here)}`);
    } else if (admin && user.role !== 'admin') {
      router.replace('/');
    }
  }, [loading, user, admin, router]);

  if (loading || !user || (admin && user.role !== 'admin')) {
    return <p className="container my-5 text-muted">Loading…</p>;
  }
  return children;
}
