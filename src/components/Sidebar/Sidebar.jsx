import Link from 'next/link';
import { CATEGORIES } from '@/lib/categories';
import styles from './Sidebar.module.css';

export default function Sidebar({ activeSlug = '' }) {
  return (
    <aside className={styles.sidebar}>
      <h5 className={styles.title}>Categories</h5>

      <ul className={styles.list}>
        {CATEGORIES.map((cat) => (
          <li key={cat.slug}>
            <Link
              href={`/products?category=${cat.slug}`}
              className={`${styles.item} ${activeSlug === cat.slug ? styles.active : ''}`}
            >
              <i className={`bi ${cat.icon} me-2`}></i>
              {cat.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
