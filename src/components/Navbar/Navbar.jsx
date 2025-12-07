'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [displayCount, setDisplayCount] = useState(0);
  const [pulse, setPulse] = useState(false);
  const [countClass, setCountClass] = useState('');
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  const prevCartCount = useRef(0);
  const dropdownRef = useRef(null);
  const collapseRef = useRef(null);

  // Check login state
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoggedIn(false);
      setUser(null);
      return;
    }

    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setIsLoggedIn(false);
          setUser(null);
        } else {
          setIsLoggedIn(true);
          setUser(data);
        }
      })
      .catch(() => {
        setIsLoggedIn(false);
        setUser(null);
      });
  }, []);

  // Cart animation
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const newCount = cart.length;
    setCartCount(newCount);

    if (newCount > prevCartCount.current) {
      setPulse(true);
      setCountClass('added');
      setTimeout(() => {
        setPulse(false);
        setCountClass('');
      }, 300);
    }
    if (newCount < prevCartCount.current) {
      setCountClass('removed');
      setTimeout(() => setCountClass(''), 300);
    }

    let start = prevCartCount.current;
    const end = newCount;
    if (start !== end) {
      const step = end > start ? 1 : -1;
      let current = start;
      const interval = setInterval(() => {
        current += step;
        setDisplayCount(current);
        if (current === end) clearInterval(interval);
      }, 50);
      return () => clearInterval(interval);
    }
    prevCartCount.current = newCount;
  }, [cartCount]);

  // Close dropdown and mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCategoriesOpen(false);
      }
      if (collapseRef.current && !collapseRef.current.contains(event.target) &&
          !event.target.closest('.navbar-toggler')) {
        setIsCollapsed(true);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
    router.push('/auth/login');
  };

  return (
    <nav className={`navbar navbar-expand-lg ${styles.navbar}`}>
      <div className="container">
        <a className="navbar-brand fw-bold" href="/">
          <i className="bi bi-collection-play me-2"></i>Bako's Collection
        </a>

        {/* Hamburger toggler */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-controls="navbarNav"
          aria-expanded={!isCollapsed}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Mobile menu */}
        <div
          className={`collapse navbar-collapse ${!isCollapsed ? 'show' : ''}`}
          id="navbarNav"
          ref={collapseRef}
        >
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" href="/">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/products">Products</a>
            </li>

            {/* Categories dropdown */}
            <li
              className="nav-item dropdown"
              ref={dropdownRef}
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
            >
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                aria-expanded={isCategoriesOpen}
              >
                Categories
              </a>
              <ul className={`${styles.dropdownMenu} ${isCategoriesOpen ? styles.show : ''}`}>
                <li><a className="dropdown-item" href="/products/category/art">Art</a></li>
                <li><a className="dropdown-item" href="/products/category/fashion">Fashion</a></li>
                <li><a className="dropdown-item" href="/products/category/phones">Phones</a></li>
                <li><a className="dropdown-item" href="/products/category/digital">Digital Assets</a></li>
                <li><a className="dropdown-item" href="/products/category/games">Game Items</a></li>
              </ul>
            </li>
          </ul>

          <div className="d-flex align-items-center flex-column flex-lg-row mt-2 mt-lg-0">
            {/* Cart */}
            <a href="/usercart" className="btn btn-outline-primary me-lg-2 mb-2 mb-lg-0 position-relative" title="Cart">
              <i className="bi bi-cart3"></i>
              <span className="d-none d-lg-inline ms-1">Cart</span>
              {displayCount > 0 && (
                <span className={`position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger ${pulse ? styles.pulse : ''}`}>
                  <span className={`${styles['cart-badge-number']} ${countClass}`}>
                    {displayCount}
                  </span>
                  <span className="visually-hidden">items in cart</span>
                </span>
              )}
            </a>

            {isLoggedIn ? (
              <>
                <a href="/user/profile" className="btn btn-outline-secondary me-lg-2 mb-2 mb-lg-0" title="Dashboard">
                  <i className="bi bi-person-circle"></i>
                  <span className="d-none d-lg-inline ms-1">{user?.name || 'Dashboard'}</span>
                </a>
                <button className="btn btn-danger mb-2 mb-lg-0" onClick={handleLogout} title="Logout">
                  <i className="bi bi-box-arrow-right"></i>
                  <span className="d-none d-lg-inline ms-1">Logout</span>
                </button>
              </>
            ) : (
              <>
                <a href="/auth/login" className="btn btn-outline-primary me-lg-2 mb-2 mb-lg-0">Login</a>
                <a href="/auth/register" className="btn btn-primary">Register</a>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
  }
