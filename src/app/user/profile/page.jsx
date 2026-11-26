'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '@/styles/UserDashboard.module.css';
import { useAuth } from '@/contexts/AuthContext';

const FIELDS = [
  { name: 'name', label: 'Full name' },
  { name: 'phone', label: 'Phone', type: 'tel' },
  { name: 'address', label: 'Address' },
  { name: 'city', label: 'City' },
  { name: 'state', label: 'State' },
  { name: 'zip', label: 'Postal code' },
];

export default function UserProfilePage() {
  const { user, refresh } = useAuth();
  const [form, setForm] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '', phone: user.phone || '', address: user.address || '',
        city: user.city || '', state: user.state || '', zip: user.zip || '',
      });
    }
  }, [user]);

  if (!user || !form) return null; // RequireAuth in the layout shows the loading state

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: 'danger', text: data.error || 'Could not save your profile.' });
      } else {
        await refresh();
        setMessage({ type: 'success', text: 'Profile saved. This will pre-fill your checkout.' });
      }
    } catch {
      setMessage({ type: 'danger', text: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.profileContainer}>
      <h2>Welcome, {user.name}!</h2>
      <p>Email: {user.email}</p>

      <div className={styles.dashboardSections}>
        <div className={styles.section}>
          <h4>Orders</h4>
          <p><Link href="/user/orders">View your past orders</Link></p>
        </div>
        <div className={styles.section}>
          <h4>Cart</h4>
          <p><Link href="/cart">Check your shopping cart</Link></p>
        </div>
      </div>

      <h4 className="mt-4">Your details</h4>
      {message.text && <p className={`text-${message.type}`}>{message.text}</p>}
      <form onSubmit={handleSave} style={{ maxWidth: 480 }}>
        {FIELDS.map((f) => (
          <div className="mb-3" key={f.name}>
            <label className="form-label" htmlFor={f.name}>{f.label}</label>
            <input id={f.name} name={f.name} type={f.type || 'text'} className="form-control" value={form[f.name]} onChange={handleChange} required={f.name === 'name'} />
          </div>
        ))}
        <button className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
      </form>
    </div>
  );
}
