'use client';
import { useEffect, useState } from 'react';
import styles from '@/styles/Admin.module.css';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products
  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setProducts(products.filter((p) => p._id === id ? false : true));
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Manage Products</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>₦{p.price.toLocaleString()}</td>
              <td>
                <button className="btn btn-sm btn-primary me-2">Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
