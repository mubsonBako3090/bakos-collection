'use client';

import { useEffect, useState } from 'react';
import { formatDate, formatNaira } from '@/lib/format';

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/orders')
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('Failed'))))
      .then(setOrders)
      .catch(() => setError('Could not load orders.'))
      .finally(() => setLoading(false));
  }, []);

  async function changeStatus(id, status) {
    setError('');
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setOrders((list) => list.map((o) => (o._id === id ? { ...o, status } : o)));
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Could not update the order.');
    }
  }

  if (loading) return <p className="text-muted">Loading…</p>;

  return (
    <div>
      <h2>Manage Orders</h2>
      {error && <p className="text-danger">{error}</p>}
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr><th>Order</th><th>Customer</th><th>Items</th><th>Ship to</th><th>Total</th><th>Date</th><th>Status</th></tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td><code>{String(order._id).slice(-8)}</code></td>
                  <td>{order.userName || '—'}<br /><small className="text-muted">{order.userEmail || ''}</small></td>
                  <td>{(order.items || []).map((i) => `${i.name} × ${i.quantity}`).join(', ')}</td>
                  <td>
                    <small>
                      {order.shippingInfo?.address}, {order.shippingInfo?.city}, {order.shippingInfo?.state}
                      <br />{order.shippingInfo?.phone}
                    </small>
                  </td>
                  <td>{formatNaira(order.total)}</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>
                    <select className="form-select form-select-sm" value={order.status} onChange={(e) => changeStatus(order._id, e.target.value)}>
                      {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
