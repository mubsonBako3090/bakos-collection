'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './DashboardSidebar.module.css';

export default function DashboardSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Profile', href: '/user/profile', icon: 'bi bi-person' },
    { name: 'Orders', href: '/user/orders', icon: 'bi bi-bag-check' },
    { name: 'Cart', href: '/cart', icon: 'bi bi-cart' },
  ];

  return (
    <aside className={styles.sidebar}>
      <ul className={styles.menu}>
        {menuItems.map((item) => (
          <li key={item.name} className={pathname === item.href ? styles.active : ''}>
            <Link href={item.href}>
              <i className={`${item.icon} me-2`}></i>
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
