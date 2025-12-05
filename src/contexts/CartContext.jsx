'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);

  // Optional: load cart on mount
  useEffect(() => {
    async function fetchCart() {
      try {
        const res = await fetch('/api/cart/get'); // create a GET API route
        const data = await res.json();
        if (res.ok) setCart(data.cart);
      } catch (err) {
        console.error('Fetch cart error:', err);
      }
    }
    fetchCart();
  }, []);

  async function addToCart(product) {
    try {
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product._id })
      });

      const data = await res.json();

      if (res.ok) {
        setCart(data.cart);
        alert(`${product.name} added to cart`);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error('Add to cart error:', err);
      alert('Failed to add to cart');
    }
  }

  return (
  <CartContext.Provider value={{ cart, addToCart, setCart }}>
  {children}
</CartContext.Provider>
  );

}

export const useCart = () => useContext(CartContext);
