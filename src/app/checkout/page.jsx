'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import RequireAuth from '@/components/RequireAuth';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { formatNaira } from '@/lib/format';

const FIELDS = [
  { name: 'address', label: 'Address', required: true },
  { name: 'city', label: 'City', required: true },
  { name: 'state', label: 'State', required: true },
  { name: 'zip', label: 'Postal code', required: false },
  { name: 'phone', label: 'Phone', required: true, type: 'tel' },
];

function CheckoutContent() {
  const { user } = useAuth();
  const { cart, loading, refresh } = useCart();

  const [shipping, setShipping] = useState({ address: '', city: '', state: '', zip: '', phone: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');

  // Pre-fill from the saved profile.
  useEffect(() => {
    if (!user) return;
    setShipping({
      address: user.address || '',
      city: user.city || '',
      state: user.state || '',
      zip: user.zip || '',
      phone: user.phone || '',
    });
  }, [user]);

  const handleChange = (e) => setShipping((s) => ({ ...s, [e.target.name]: e.target.value }));

  async function handlePlaceOrder(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      // Only shipping goes to the server. It builds the order from the saved cart.
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shipping }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not place the order.');
        return;
      }
      setPlacedOrderId(data.orderId);
      await refresh();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (placedOrderId) {
    return (
      <div className="alert alert-success">
        <h4 className="alert-heading">Order placed!</h4>
        <p className="mb-2">Your order reference is <strong>{placedOrderId}</strong>.</p>
        <Link href="/user/orders" className="btn btn-primary me-2">View my orders</Link>
        <Link href="/products" className="btn btn-outline-primary">Keep shopping</Link>
      </div>
    );
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
    <form onSubmit={handlePlaceOrder} className="row">
      <div className="col-md-6">
        <h4>Shipping Info</h4>
        {FIELDS.map((f) => (
          <div className="mb-3" key={f.name}>
            <label className="form-label" htmlFor={f.name}>{f.label}{f.required ? ' *' : ''}</label>
            <input
              id={f.name}
              type={f.type || 'text'}
              className="form-control"
              name={f.name}
              value={shipping[f.name]}
              onChange={handleChange}
              required={f.required}
            />
          </div>
        ))}
      </div>

      <div className="col-md-6">
        <h4>Order Summary</h4>
        <table className="table">
          <thead>
            <tr><th>Product</th><th>Qty</th><th className="text-end">Price</th></tr>
          </thead>
          <tbody>
            {cart.items.map((item) => (
              <tr key={item.productId}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td className="text-end">{formatNaira(item.price * item.quantity)}</td>
              </tr>
            ))}
            <tr>
              <td colSpan="2" className="fw-bold">Total</td>
              <td className="fw-bold text-end">{formatNaira(cart.total)}</td>
            </tr>
          </tbody>
        </table>
        {error && <p className="text-danger">{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Placing order…' : 'Place Order'}
        </button>
      </div>
    </form>
  );
}

export default function CheckoutPage() {
  return (
    <RequireAuth>
      <div className="container my-5">
        <h2 className="mb-4">Checkout</h2>
        <CheckoutContent />
      </div>
    </RequireAuth>
  );
}
