'use client';
import { useCart } from '@/contexts/CartContext';
import styles from '@/styles/Cart.module.css';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  // SAFE DEFAULT to prevent null errors during prerender
  const safeCart = cart || [];

  const total = safeCart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="container my-5">
      <h2>Shopping Cart</h2>

      {safeCart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {safeCart.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>₦{item.price.toLocaleString()}</td>

                  <td>
                    <input
                      type="number"
                      value={item.quantity}
                      min={1}
                      onChange={(e) =>
                        updateQuantity(item.id, parseInt(e.target.value, 10))
                      }
                      style={{ width: 60 }}
                    />
                  </td>

                  <td>₦{(item.price * item.quantity).toLocaleString()}</td>

                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4>Total: ₦{total.toLocaleString()}</h4>

          <button className="btn btn-primary me-2">Proceed to Checkout</button>
          <button className="btn btn-outline-secondary" onClick={clearCart}>
            Clear Cart
          </button>
        </>
      )}
    </div>
  );
                  }
