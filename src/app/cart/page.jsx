'use client';

import UserCart from '@/components/UserCart/UserCart';

export default function CartPage() {
  return (
    <div className="container my-4">
      <h2>Your Cart</h2>
      <UserCart />
    </div>
  );
}
