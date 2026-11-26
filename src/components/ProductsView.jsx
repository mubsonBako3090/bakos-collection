'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard/ProductCard';
import SearchBar from '@/components/SearchBar/SearchBar';
import { CATEGORIES, findCategory } from '@/lib/categories';

const PRICE_RANGES = [
  { label: 'Any price', min: 0, max: Infinity },
  { label: '₦0 - ₦10,000', min: 0, max: 10000 },
  { label: '₦10,000 - ₦50,000', min: 10000, max: 50000 },
  { label: '₦50,000 - ₦150,000', min: 50000, max: 150000 },
  { label: '₦150,000+', min: 150000, max: Infinity },
];

const SORTS = {
  newest: { label: 'Newest', fn: () => 0 }, // API already returns newest first
  low: { label: 'Price: Low to High', fn: (a, b) => a.price - b.price },
  high: { label: 'Price: High to Low', fn: (a, b) => b.price - a.price },
  name: { label: 'Name: A to Z', fn: (a, b) => a.name.localeCompare(b.name) },
};

export default function ProductsView() {
  const searchParams = useSearchParams();
  const activeCategory = findCategory(searchParams.get('category') || '');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [priceIndex, setPriceIndex] = useState(0);
  const [sort, setSort] = useState('newest');

  const categorySlug = activeCategory?.slug || '';
  useEffect(() => {
    setLoading(true);
    setError('');
    const url = categorySlug ? `/api/products?category=${categorySlug}` : '/api/products';
    fetch(url)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('Failed'))))
      .then(setProducts)
      .catch(() => setError('Could not load products. Please try again.'))
      .finally(() => setLoading(false));
  }, [categorySlug]);

  const visible = useMemo(() => {
    const range = PRICE_RANGES[priceIndex];
    const q = query.trim().toLowerCase();
    return products
      .filter((p) => p.name.toLowerCase().includes(q))
      .filter((p) => p.price >= range.min && p.price < range.max)
      .sort(SORTS[sort].fn);
  }, [products, query, priceIndex, sort]);

  return (
    <div className="container my-5">
      <h2 className="mb-3">{activeCategory ? activeCategory.name : 'All Products'}</h2>

      <div className="mb-3 d-flex flex-wrap gap-2">
        <Link href="/products" className={`btn btn-sm ${!activeCategory ? 'btn-primary' : 'btn-outline-primary'}`}>
          All
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            href={`/products?category=${c.slug}`}
            className={`btn btn-sm ${activeCategory?.slug === c.slug ? 'btn-primary' : 'btn-outline-primary'}`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      <div className="row g-2 mb-4">
        <div className="col-md-6">
          <SearchBar onSearch={setQuery} />
        </div>
        <div className="col-md-3 mb-3">
          <select className="form-select" value={priceIndex} onChange={(e) => setPriceIndex(Number(e.target.value))} aria-label="Price range">
            {PRICE_RANGES.map((r, i) => (
              <option key={r.label} value={i}>{r.label}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3 mb-3">
          <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort by">
            {Object.entries(SORTS).map(([key, s]) => (
              <option key={key} value={key}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && <p className="text-muted">Loading products…</p>}
      {error && <p className="text-danger">{error}</p>}
      {!loading && !error && visible.length === 0 && <p>No products found.</p>}

      <div className="row">
        {visible.map((product) => (
          <div key={product._id} className="col-lg-4 col-md-6 mb-4">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
