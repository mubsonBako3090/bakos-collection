'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Check login status
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    // Load cart count from localStorage or API
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartCount(cart.length);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/auth/login');
  };

  return (
    <nav className={`navbar navbar-expand-lg ${styles.navbar}`}>
      <div className="container">
        <a className="navbar-brand fw-bold" href="/">
          <i className="bi bi-collection-play me-2"></i>
          Bako's Collection
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Left side menu */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" href="/">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/products">Products</a>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Categories
              </a>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="/products/category/art">Art</a></li>
                <li><a className="dropdown-item" href="/products/category/fashion">Fashion</a></li>
                <li><a className="dropdown-item" href="/products/category/phones">Phones</a></li>
                <li><a className="dropdown-item" href="/products/category/digital">Digital Assets</a></li>
                <li><a className="dropdown-item" href="/products/category/games">Game Items</a></li>
              </ul>
            </li>
          </ul>

          {/* Right side menu */}
          <div className="d-flex align-items-center">
            {/* Cart */}
            <a href="/usercart" className="btn btn-outline-primary me-2 position-relative">
              <i className="bi bi-cart3"></i>
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartCount}
                  <span className="visually-hidden">items in cart</span>
                </span>
              )}
            </a>

            {/* Auth */}
            {isLoggedIn ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-secondary dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle"></i>
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><a className="dropdown-item" href="/user/profile">Dashboard</a></li>
                  <li><a className="dropdown-item" href="/user/orders">Orders</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <a href="/auth/login" className="btn btn-outline-primary me-2">Login</a>
                <a href="/auth/register" className="btn btn-primary">Register</a>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
