'use client';

import { useCallback, useEffect, useState } from 'react';
import { CATEGORIES } from '@/lib/categories';
import { formatNaira } from '@/lib/format';

const EMPTY_FORM = { name: '', price: '', category: CATEGORIES[0].name, image: '' };

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed');
      setProducts(await res.json());
    } catch {
      setError('Could not load products.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  function startEdit(product) {
    setEditingId(product._id);
    setForm({ name: product.name, price: String(product.price), category: product.category, image: product.image || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch(editingId ? `/api/admin/products/${editingId}` : '/api/admin/products', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not save the product.');
        return;
      }
      resetForm();
      await load();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setError('');
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setProducts((list) => list.filter((p) => p._id !== id));
      if (editingId === id) resetForm();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Could not delete the product.');
    }
  }

  return (
    <div>
      <h2>Manage Products</h2>

      <form onSubmit={handleSubmit} className="card card-body mb-4">
        <h5>{editingId ? 'Edit product' : 'Add a product'}</h5>
        <div className="row g-2">
          <div className="col-md-4">
            <input className="form-control" name="name" placeholder="Name" value={form.name} onChange={handleChange} required maxLength={120} />
          </div>
          <div className="col-md-2">
            <input className="form-control" name="price" type="number" min="0.01" step="0.01" placeholder="Price (₦)" value={form.price} onChange={handleChange} required />
          </div>
          <div className="col-md-3">
            <select className="form-select" name="category" value={form.category} onChange={handleChange}>
              {CATEGORIES.map((c) => <option key={c.slug} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          <div className="col-md-3">
            <input className="form-control" name="image" placeholder="Image path or URL" value={form.image} onChange={handleChange} />
          </div>
        </div>
        <div className="mt-3">
          <button className="btn btn-primary me-2" disabled={saving}>{saving ? 'Saving…' : editingId ? 'Save changes' : 'Add product'}</button>
          {editingId && <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>Cancel</button>}
        </div>
      </form>

      {error && <p className="text-danger">{error}</p>}
      {loading ? (
        <p className="text-muted">Loading…</p>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr><th></th><th>Name</th><th>Category</th><th>Price</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <img src={p.image || '/logo.png'} alt="" width="48" height="48" style={{ objectFit: 'cover', borderRadius: 6 }} />
                  </td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>{formatNaira(p.price)}</td>
                  <td>
                    <button className="btn btn-sm btn-primary me-2" onClick={() => startEdit(p)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p._id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && <tr><td colSpan="5" className="text-muted">No products yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
