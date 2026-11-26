'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const EMPTY = { items: [], count: 0, total: 0 };
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [cart, setCart] = useState(EMPTY);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/cart/get', { cache: 'no-store' });
      const data = await res.json();
      setCart(res.ok && data.cart ? data.cart : EMPTY);
    } catch (err) {
      console.error('Fetch cart error:', err);
      setCart(EMPTY);
    } finally {
      setLoading(false);
    }
  }, []);

  // Reload whenever the logged-in user changes (login, logout).
  const userId = user?.id;
  useEffect(() => {
    if (authLoading) return;
    if (!userId) {
      setCart(EMPTY);
      setLoading(false);
      return;
    }
    setLoading(true);
    refresh();
  }, [authLoading, userId, refresh]);

  const post = useCallback(async (url, body) => {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) return { ok: false, error: data.error || 'Something went wrong.' };
      if (data.cart) setCart(data.cart);
      return { ok: true };
    } catch {
      return { ok: false, error: 'Network error. Please try again.' };
    }
  }, []);

  const addToCart = useCallback(
    async (product) => {
      if (!user) {
        const here = window.location.pathname + window.location.search;
        router.push(`/auth/login?next=${encodeURIComponent(here)}`);
        return { ok: false, redirected: true };
      }
      return post('/api/cart/add', { productId: product._id });
    },
    [user, router, post]
  );

  const updateItem = useCallback(
    (productId, action) => post('/api/cart/update', { productId, action }),
    [post]
  );

  const value = useMemo(
    () => ({ cart, loading, addToCart, updateItem, refresh }),
    [cart, loading, addToCart, updateItem, refresh]
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
