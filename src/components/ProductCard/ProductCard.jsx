'use client';

import { useState } from 'react';
import styles from './ProductCard.module.css';
import { useCart } from '@/contexts/CartContext';
import { formatNaira } from '@/lib/format';

export default function ProductCard({ product }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | adding | added
  const [error, setError] = useState('');
  const { addToCart } = useCart();

  const handleAdd = async () => {
    setStatus('adding');
    setError('');
    const result = await addToCart(product);
    if (result.ok) {
      setStatus('added');
      setTimeout(() => setStatus('idle'), 1500);
    } else {
      setStatus('idle');
      if (result.error) setError(result.error);
    }
  };

  return (
    <div className={`card ${styles.productCard}`}>
      <div className={styles.imageContainer}>
        <img
          src={product.image || '/logo.png'}
          alt={product.name}
          loading="lazy"
          className={`card-img-top ${styles.productImage}`}
          onError={(e) => {
            if (!e.currentTarget.src.endsWith('/logo.png')) e.currentTarget.src = '/logo.png';
          }}
        />

        <button
          type="button"
          aria-label={isFavorite ? 'Remove from favourites' : 'Add to favourites'}
          className={`btn ${styles.favoriteBtn} ${isFavorite ? styles.favoriteActive : ''}`}
          onClick={() => setIsFavorite(!isFavorite)}
        >
          <i className={`bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'}`}></i>
        </button>
      </div>

      <div className="card-body">
        <h6 className="card-title">{product.name}</h6>
        <p className="card-text text-muted small">{product.category}</p>

        <div className="d-flex justify-content-between align-items-center">
          <span className="fw-bold text-primary">{formatNaira(product.price)}</span>

          <button
            type="button"
            className="btn btn-sm btn-outline-primary"
            onClick={handleAdd}
            disabled={status === 'adding'}
          >
            {status === 'added' ? (
              <><i className="bi bi-check2"></i> Added</>
            ) : (
              <><i className="bi bi-cart-plus"></i> {status === 'adding' ? 'Adding…' : 'Add'}</>
            )}
          </button>
        </div>
        {error && <p className="text-danger small mt-2 mb-0">{error}</p>}
      </div>
    </div>
  );
}
