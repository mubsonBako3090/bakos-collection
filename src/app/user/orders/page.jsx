'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatDate, formatNaira } from '@/lib/format';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/orders')
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('Failed'))))
      .then(setOrders)
      .catch(() => setError('Could not load your orders.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted">Loading orders…</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (orders.length === 0) {
    return (
      <div>
        <p>No orders yet.</p>
        <Link href="/products" className="btn btn-primary">Start shopping</Link>
      </div>
    );
  }

  return (
    <div>
      <h2>My Orders</h2>
      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr><th>Order</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th></tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td><code>{String(order._id).slice(-8)}</code></td>
                <td>{(order.items || []).map((i) => `${i.name} × ${i.quantity}`).join(', ')}</td>
                <td>{formatNaira(order.total)}</td>
                <td><span className="badge text-bg-secondary">{order.status}</span></td>
                <td>{formatDate(order.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
