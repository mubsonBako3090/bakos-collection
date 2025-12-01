'use client';
import { useState } from 'react';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const [activeCategory, setActiveCategory] = useState('');

  const categories = [
    { name: 'Art', icon: 'bi-palette' },
    { name: 'Fashion', icon: 'bi-bag-check' },
    { name: 'Phones', icon: 'bi-phone' },
    { name: 'Digital Assets', icon: 'bi-cpu' },
    { name: 'Game Items', icon: 'bi-controller' },
  ];

  return (
    <aside className={styles.sidebar}>
      <h5 className={styles.title}>Categories</h5>

      <ul className={styles.list}>
        {categories.map((cat) => (
          <li
            key={cat.name}
            className={`${styles.item} ${
              activeCategory === cat.name ? styles.active : ''
            }`}
            onClick={() => setActiveCategory(cat.name)}
          >
            <i className={`bi ${cat.icon} me-2`}></i>
            {cat.name}
          </li>
        ))}
      </ul>

      <div className={styles.filterSection}>
        <h6 className="mb-2">Filters</h6>

        <label className={styles.filterLabel}>Price Range</label>
        <select className="form-select mb-3">
          <option>₦0 - ₦10,000</option>
          <option>₦10,000 - ₦50,000</option>
          <option>₦50,000 - ₦150,000</option>
          <option>₦150,000+</option>
        </select>

        <label className={styles.filterLabel}>Sort By</label>
        <select className="form-select">
          <option>Popular</option>
          <option>Newest</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
        </select>
      </div>
    </aside>
  );
}
