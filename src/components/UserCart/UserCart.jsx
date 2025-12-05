'use client';

import { useCart } from '@/contexts/CartContext';

export default function UserCart() {
  const { cart, setCart } = useCart();

  if (!cart || cart.items.length === 0) return <p>Your cart is empty.</p>;

  async function updateItem(productId, action) {
    try {
      const res = await fetch('/api/cart/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, action })
      });

      const data = await res.json();
      if (res.ok) {
        setCart(data.cart);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update cart');
    }
  }

  const total = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div>
      {cart.items.map((item) => (
        <div key={item.productId} className="d-flex justify-content-between align-items-center mb-2">
          <div>
            <strong>{item.name}</strong> x {item.quantity}
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-sm btn-outline-secondary" onClick={() => updateItem(item.productId, 'decrease')}>-</button>
            <button className="btn btn-sm btn-outline-secondary" onClick={() => updateItem(item.productId, 'increase')}>+</button>
            <button className="btn btn-sm btn-outline-danger" onClick={() => updateItem(item.productId, 'remove')}>Remove</button>
            <span>₦{item.price * item.quantity}</span>
          </div>
        </div>
      ))}
      <hr />
      <div className="d-flex justify-content-between fw-bold">
        <span>Total:</span>
        <span>₦{total}</span>
      </div>
    </div>
  );
}
