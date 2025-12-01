'use client';
import Link from 'next/link';
import styles from '@/styles/Admin.module.css';

export default function AdminLayout({ children }) {
  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
        <h3>Admin Dashboard</h3>
        <ul>
          <li><Link href="/admin/products">Products</Link></li>
          <li><Link href="/admin/orders">Orders</Link></li>
        </ul>
      </aside>
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
}
