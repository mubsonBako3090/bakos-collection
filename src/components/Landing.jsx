'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import Sidebar from '@/components/Sidebar/Sidebar';
import ProductCard from '@/components/ProductCard/ProductCard';
import styles from '@/styles/Home.module.css';
import Navbar from './Navbar/Navbar';

export default function LandingPage() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const featuredProducts = [
    {
      id: 1,
      name: 'Premium Art Piece',
      price: 15000,
      category: 'Art',
      image: '/gool.jpg',
    },
    {
      id: 2,
      name: 'Designer Fashion',
      price: 8000,
      category: 'Fashion',
      image: '/art/art.webp',
    },
    {
      id: 3,
      name: 'Smartphone',
      price: 120000,
      category: 'Phones',
      image: '/too.png',
    },
     {
      id: 4,
      name: 'furnitures',
      price: 80000,
      category: 'Fashion',
      image: '/1.jpg',
    },
  ];

  return (
    <div className={styles.container}>
      <Navbar />

      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <Sidebar />
          </div>

          <div className="col-md-9">
            {/* Hero Section */}
            <section className={`${styles.hero} mb-5`} data-aos="fade-up">
              <div className={styles.heroContent}>
                <h1>Welcome to Bako's Collection</h1>
                <p>Discover the best in Art, Fashion, Digital Assets & More</p>
                <button className="btn btn-primary btn-lg">Shop Now</button>
              </div>
            </section>

            {/* Featured Products */}
            <section data-aos="fade-up">
              <h2 className="mb-4">Featured Products</h2>
              <div className="row">
                {featuredProducts.map((product) => (
                  <div key={product.id} className="col-lg-4 col-md-6 mb-4">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </section>

            {/* Categories Section */}
            <section className="my-5" data-aos="fade-up">
              <h2 className="mb-4">Shop by Category</h2>
              <div className="row">
                {[
                  'Art',
                  'Fashion',
                  'Phones',
                  'Digital Assets',
                  'Game Items',
                  `furnitures`,
                ].map((category, index) => (
                  <div key={category} className="col-md-2 col-6 mb-3">
                    <div
                      className={`card ${styles.categoryCard}`}
                      data-aos="zoom-in"
                      data-aos-delay={index * 100}
                    >
                      <div className="card-body text-center">
                        <i className="bi bi-tag fs-1"></i>
                        <h6 className="mt-2">{category}</h6>
                      </div>
                    </div>
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
