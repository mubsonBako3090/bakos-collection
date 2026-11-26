'use client';

import Link from 'next/link';
import styles from '@/styles/Admin.module.css';
import RequireAuth from '@/components/RequireAuth';

export default function AdminLayout({ children }) {
  return (
    <RequireAuth admin>
      <div className={styles.adminContainer}>
        <aside className={styles.sidebar}>
          <h3>Admin</h3>
          <ul>
            <li><Link href="/admin/products">Products</Link></li>
            <li><Link href="/admin/orders">Orders</Link></li>
            <li><Link href="/">← Back to store</Link></li>
          </ul>
        </aside>
        <main className={styles.mainContent}>{children}</main>
      </div>
    </RequireAuth>
  );
}
