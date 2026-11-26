'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AOS from 'aos';
import Sidebar from '@/components/Sidebar/Sidebar';
import ProductCard from '@/components/ProductCard/ProductCard';
import styles from '@/styles/Home.module.css';
import { CATEGORIES } from '@/lib/categories';

export default function LandingPage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  // Featured products come from the database so "Add to cart" works for every card.
  useEffect(() => {
    fetch('/api/products?limit=6')
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('Failed'))))
      .then(setFeatured)
      .catch(() => setError('Could not load products right now.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.container}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <Sidebar />
          </div>

          <div className="col-md-9">
            <section className={`${styles.hero} mb-5`} data-aos="fade-up">
              <div className={styles.heroContent}>
                <h1>Welcome to Bako&apos;s Collection</h1>
                <p>Discover the best in Art, Fashion, Digital Assets &amp; More</p>
                <Link href="/products" className="btn btn-primary btn-lg">Shop Now</Link>
              </div>
            </section>

            <section data-aos="fade-up">
              <h2 className="mb-4">Featured Products</h2>
              {loading && <p className="text-muted">Loading products…</p>}
              {error && <p className="text-danger">{error}</p>}
              {!loading && !error && featured.length === 0 && (
                <p className="text-muted">No products yet. Check back soon.</p>
              )}
              <div className="row">
                {featured.map((product) => (
                  <div key={product._id} className="col-lg-4 col-md-6 mb-4">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </section>

            <section className="my-5" data-aos="fade-up">
              <h2 className="mb-4">Shop by Category</h2>
              <div className="row">
                {CATEGORIES.map((category) => (
                  <div key={category.slug} className="col-md-3 col-6 mb-3">
                    <Link href={`/products?category=${category.slug}`} className="text-decoration-none text-body">
                      <div className={`card h-100 ${styles.categoryCard}`}>
                        <div className="card-body text-center">
                          <i className={`bi ${category.icon} fs-1`}></i>
                          <h6 className="mt-2">{category.name}</h6>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
