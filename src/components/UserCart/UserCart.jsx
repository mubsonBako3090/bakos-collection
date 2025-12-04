'use client';
import { useEffect, useState } from 'react';

export default function UserCart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch cart for logged-in user
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('/api/cart/user', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setCart(data);
        setLoading(false);
      });
  }, []);

  const updateQuantity = async (id, qty) => {
    const token = localStorage.getItem('token');
    const newCart = cart.map(item => item.id === id ? { ...item, quantity: qty } : item);
    setCart(newCart);

    await fetch('/api/cart/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ items: newCart })
    });
  };

  const removeItem = async (id) => {
    const token = localStorage.getItem('token');
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);

    await fetch('/api/cart/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ items: newCart })
    });
  };

  if (loading) return <p>Loading cart...</p>;
  if (cart.length === 0) return <p>Your cart is empty.</p>;

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <h3>My Cart</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {cart.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>
                <input 
                  type="number" 
                  value={item.quantity} 
                  min="1" 
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                />
              </td>
              <td>₦{(item.price * item.quantity).toLocaleString()}</td>
              <td>
                <button className="btn btn-sm btn-danger" onClick={() => removeItem(item.id)}>Remove</button>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan="2" className="fw-bold">Total</td>
            <td colSpan="2" className="fw-bold">₦{total.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
      <a href="/checkout" className="btn btn-primary">Proceed to Checkout</a>
    </div>
  );
}
