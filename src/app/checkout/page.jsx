'use client';
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (!shippingInfo.name || !shippingInfo.email || !shippingInfo.address) {
      alert('Please fill all required fields');
      return;
    }

    setLoading(true);

    // Send order to backend
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cart,
        total,
        shippingInfo,
        status: 'Pending',
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setMessage('Order placed successfully!');
      clearCart();
    } else {
      setMessage(`Error: ${data.error}`);
    }
  };

  if (cart.length === 0) return <p className="m-5">Your cart is empty.</p>;

  return (
    <div className="container my-5">
      <h2>Checkout</h2>

      <div className="row">
        <div className="col-md-6">
          <h4>Shipping Info</h4>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input type="text" name="name" className="form-control" value={shippingInfo.name} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" name="email" className="form-control" value={shippingInfo.email} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Address</label>
            <input type="text" name="address" className="form-control" value={shippingInfo.address} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">City</label>
            <input type="text" name="city" className="form-control" value={shippingInfo.city} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">State</label>
            <input type="text" name="state" className="form-control" value={shippingInfo.state} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">ZIP Code</label>
            <input type="text" name="zip" className="form-control" value={shippingInfo.zip} onChange={handleChange} />
          </div>

          <button className="btn btn-primary" onClick={handlePlaceOrder} disabled={loading}>
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
          {message && <p className="mt-3">{message}</p>}
        </div>

        <div className="col-md-6">
          <h4>Order Summary</h4>
          <ul className="list-group mb-3">
            {cart.map((item) => (
              <li key={item.id} className="list-group-item d-flex justify-content-between">
                {item.name} x {item.quantity}
                <span>₦{(item.price * item.quantity).toLocaleString()}</span>
              </li>
            ))}
            <li className="list-group-item d-flex justify-content-between fw-bold">
              Total
              <span>₦{total.toLocaleString()}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
