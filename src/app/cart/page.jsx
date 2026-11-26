'use client';

import { useState } from 'react';
import Link from 'next/link';
import RequireAuth from '@/components/RequireAuth';
import { useCart } from '@/contexts/CartContext';
import { formatNaira } from '@/lib/format';

function CartContent() {
  const { cart, loading, updateItem } = useCart();
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState('');

  async function change(productId, action) {
    setBusyId(productId);
    setError('');
    const result = await updateItem(productId, action);
    if (!result.ok) setError(result.error);
    setBusyId('');
  }

  if (loading) return <p className="text-muted">Loading your cart…</p>;

  if (cart.items.length === 0) {
    return (
      <div>
        <p>Your cart is empty.</p>
        <Link href="/products" className="btn btn-primary">Browse products</Link>
      </div>
    );
  }

  return (
    <>
      {error && <p className="text-danger">{error}</p>}
      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th className="text-end">Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cart.items.map((item) => (
              <tr key={item.productId}>
                <td>{item.name}</td>
                <td>{formatNaira(item.price)}</td>
                <td>
                  <div className="btn-group btn-group-sm" role="group" aria-label={`Quantity of ${item.name}`}>
                    <button className="btn btn-outline-secondary" disabled={busyId === item.productId} onClick={() => change(item.productId, 'decrease')}>−</button>
                    <span className="btn btn-light disabled">{item.quantity}</span>
                    <button className="btn btn-outline-secondary" disabled={busyId === item.productId} onClick={() => change(item.productId, 'increase')}>+</button>
                  </div>
                </td>
                <td className="text-end">{formatNaira(item.price * item.quantity)}</td>
                <td className="text-end">
                  <button className="btn btn-sm btn-outline-danger" disabled={busyId === item.productId} onClick={() => change(item.productId, 'remove')}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <h4 className="mb-0">Total: {formatNaira(cart.total)}</h4>
        <Link href="/checkout" className="btn btn-primary">Proceed to Checkout</Link>
      </div>
    </>
  );
}

export default function CartPage() {
  return (
    <RequireAuth>
      <div className="container my-5">
        <h2 className="mb-4">Your Cart</h2>
        <CartContent />
      </div>
    </RequireAuth>
  );
}
