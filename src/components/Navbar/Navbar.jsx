'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { CATEGORIES } from '@/lib/categories';
import styles from './Navbar.module.css';

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { cart } = useCart();

  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [pulse, setPulse] = useState(false);

  const dropdownRef = useRef(null);
  const collapseRef = useRef(null);
  const prevCount = useRef(0);

  // Pulse the badge when the cart count goes up.
  const count = cart.count;
  useEffect(() => {
    if (count > prevCount.current) {
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 300);
      prevCount.current = count;
      return () => clearTimeout(t);
    }
    prevCount.current = count;
  }, [count]);

  // Close the dropdown / mobile menu when clicking elsewhere.
  useEffect(() => {
    function onMouseDown(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setCategoriesOpen(false);
      }
      if (
        collapseRef.current &&
        !collapseRef.current.contains(event.target) &&
        !event.target.closest('.navbar-toggler')
      ) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);

  const closeMenus = () => {
    setMenuOpen(false);
    setCategoriesOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    closeMenus();
    router.push('/auth/login');
    router.refresh();
  };

  return (
    <nav className={`navbar navbar-expand-lg ${styles.navbar}`}>
      <div className="container">
        <Link className="navbar-brand fw-bold" href="/" onClick={closeMenus}>
          <i className="bi bi-collection-play me-2"></i>Bako&apos;s Collection
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-controls="navbarNav"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`} id="navbarNav" ref={collapseRef}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" href="/" onClick={closeMenus}>Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/products" onClick={closeMenus}>Products</Link>
            </li>

            <li className="nav-item dropdown" ref={dropdownRef}>
              <button
                type="button"
                className="nav-link dropdown-toggle btn btn-link text-start"
                aria-expanded={categoriesOpen}
                onClick={() => setCategoriesOpen((open) => !open)}
              >
                Categories
              </button>
              <ul className={`dropdown-menu ${categoriesOpen ? 'show' : ''}`}>
                {CATEGORIES.map((c) => (
                  <li key={c.slug}>
                    <Link className="dropdown-item" href={`/products?category=${c.slug}`} onClick={closeMenus}>
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            {user?.role === 'admin' && (
              <li className="nav-item">
                <Link className="nav-link" href="/admin" onClick={closeMenus}>Admin</Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center flex-column flex-lg-row mt-2 mt-lg-0">
            <Link
              href="/cart"
              className="btn btn-outline-primary me-lg-2 mb-2 mb-lg-0 position-relative"
              title="Cart"
              onClick={closeMenus}
            >
              <i className="bi bi-cart3"></i>
              <span className="d-none d-lg-inline ms-1">Cart</span>
              {count > 0 && (
                <span
                  className={`position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger ${
                    pulse ? styles.pulse : ''
                  }`}
                >
                  {count}
                  <span className="visually-hidden">items in cart</span>
                </span>
              )}
            </Link>

            {user ? (
              <>
                <Link
                  href="/user/profile"
                  className="btn btn-outline-secondary me-lg-2 mb-2 mb-lg-0"
                  title="Dashboard"
                  onClick={closeMenus}
                >
                  <i className="bi bi-person-circle"></i>
                  <span className="d-none d-lg-inline ms-1">{user.name || 'Dashboard'}</span>
                </Link>
                <button className="btn btn-danger mb-2 mb-lg-0" onClick={handleLogout} title="Logout">
                  <i className="bi bi-box-arrow-right"></i>
                  <span className="d-none d-lg-inline ms-1">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="btn btn-outline-primary me-lg-2 mb-2 mb-lg-0" onClick={closeMenus}>
                  Login
                </Link>
                <Link href="/auth/register" className="btn btn-primary" onClick={closeMenus}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
