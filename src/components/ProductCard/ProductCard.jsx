'use client';

import { useState } from 'react';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(price);
  };

  return (
    <div className={`card ${styles.productCard}`} data-aos="flip-left">
      <div className={styles.imageContainer}>
        <img
          src={product.image}
          alt={product.name}
          className={`card-img-top ${styles.productImage}`}
        />

        <button
          className={`btn ${styles.favoriteBtn} ${
            isFavorite ? styles.favoriteActive : ''
          }`}
          onClick={() => setIsFavorite(!isFavorite)}
        >
          <i className={`bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'}`}></i>
        </button>
      </div>

      <div className="card-body">
        <h6 className="card-title">{product.name}</h6>
        <p className="card-text text-muted small">{product.category}</p>

        <div className="d-flex justify-content-between align-items-center">
          <span className="fw-bold text-primary">
            {formatPrice(product.price)}
          </span>

          <button className="btn btn-sm btn-outline-primary">
            <i className="bi bi-cart-plus"></i> Add
          </button>
        </div>
      </div>
    </div>
  );
}
