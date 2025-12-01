'use client';

import { useState } from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">

          <ul className="navbar-nav me-auto">
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

          {/* Right Side Buttons */}
          <div className="d-flex align-items-center">

            {/* Cart */}
            <a href="/cart" className="btn btn-outline-primary me-2">
              <i className="bi bi-cart3"></i>
              <span className="badge bg-danger ms-1">0</span>
            </a>

            {/* Login / User */}
            {isLoggedIn ? (
              <div className="dropdown">
                <a
                  className="btn btn-outline-secondary dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-person-circle"></i>
                </a>

                <ul className="dropdown-menu">
                  <li><a className="dropdown-item" href="/user/profile">Profile</a></li>
                  <li><a className="dropdown-item" href="/user/orders">Orders</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item" href="#">Logout</a></li>
                </ul>
              </div>
            ) : (
              <div>
                <a href="/auth/login" className="btn btn-outline-primary me-2">Login</a>
                <a href="/auth/register" className="btn btn-primary">Register</a>
              </div>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
}
