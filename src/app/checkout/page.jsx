'use client';
import { useEffect, useState } from 'react';

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shipping, setShipping] = useState({
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Fetch user cart
    fetch('/api/cart/user', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setCart(data);
        setLoading(false);
      });

    // Fetch user profile to pre-fill shipping info
    fetch('/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(user => setShipping({
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zip: user.zip || '',
        phone: user.phone || ''
      }));
  }, []);

  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/orders/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ cart, shipping })
    });
    const data = await res.json();
    if (res.ok) setMessage('Order placed successfully!');
    else setMessage(`Error: ${data.error}`);
  };

  if (loading) return <p>Loading cart...</p>;
  if (cart.length === 0) return <p>Your cart is empty.</p>;

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container">
      <h2>Checkout</h2>
      {message && <p>{message}</p>}
      
      <div className="row">
        <div className="col-md-6">
          <h4>Shipping Info</h4>
          {['address','city','state','zip','phone'].map(field => (
            <div className="mb-3" key={field}>
              <label className="form-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input 
                type="text" 
                className="form-control"
                name={field}
                value={shipping[field] || ''}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>
        <div className="col-md-6">
          <h4>Order Summary</h4>
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>₦{(item.price * item.quantity).toLocaleString()}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="2" className="fw-bold">Total</td>
                <td className="fw-bold">₦{total.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
          <button className="btn btn-primary" onClick={handlePlaceOrder}>Place Order</button>
        </div>
      </div>
    </div>
  );
}
