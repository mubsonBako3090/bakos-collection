'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true); // <-- control navbar collapse
  const [cartCount, setCartCount] = useState(0);
  const [displayCount, setDisplayCount] = useState(0);
  const [pulse, setPulse] = useState(false);
  const [countClass, setCountClass] = useState('');
  const prevCartCount = useRef(0);

  // Cart and auth logic (same as yours)
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

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
    const stepTime = 50;
    const diff = Math.abs(end - start);
    if (diff === 0) return;

    const step = end > start ? 1 : -1;
    let current = start;

    const interval = setInterval(() => {
      current += step;
      setDisplayCount(current);
      if (current === end) clearInterval(interval);
    }, stepTime);

    prevCartCount.current = newCount;

    return () => clearInterval(interval);
  }, [cartCount]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/auth/login');
  };

  return (
    <nav className={`navbar navbar-expand-lg ${styles.navbar}`}>
      <div className="container">
        <a className="navbar-brand fw-bold" href="/">
          <i className="bi bi-collection-play me-2"></i>Bako's Collection
        </a>

        {/* React-controlled toggler */}
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

        <div className={`collapse navbar-collapse ${!isCollapsed ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" href="/">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/products">Products</a>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button">
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

          <div className="d-flex align-items-center flex-column flex-lg-row mt-2 mt-lg-0">
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
                  <span className="d-none d-lg-inline ms-1">Dashboard</span>
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
            }    }

    // Animate displayCount smoothly
    let start = prevCartCount.current;
    const end = newCount;
    const stepTime = 50; // ms per step
    const diff = Math.abs(end - start);
    if (diff === 0) return;

    const step = end > start ? 1 : -1;
    let current = start;

    const interval = setInterval(() => {
      current += step;
      setDisplayCount(current);
      if (current === end) clearInterval(interval);
    }, stepTime);

    prevCartCount.current = newCount;

    return () => clearInterval(interval);
  }, [cartCount]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/auth/login');
  };

  return (
    <nav className={`navbar navbar-expand-lg ${styles.navbar}`}>
      <div className="container">
        <a className="navbar-brand fw-bold" href="/">
          <i className="bi bi-collection-play me-2"></i>Bako's Collection
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
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" href="/">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/products">Products</a>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
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
                  <span className="d-none d-lg-inline ms-1">Dashboard</span>
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
