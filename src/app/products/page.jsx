'use client';
import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard/ProductCard';
import SearchBar from '@/components/SearchBar/SearchBar';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setFiltered(data);
      });
  }, []);

  const handleSearch = (query) => {
    const filteredProducts = products.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
    setFiltered(filteredProducts);
  };

  return (
    <div className="container my-5">
      <h2>All Products</h2>
      <SearchBar onSearch={handleSearch} />
      <div className="row">
        {filtered.map((product) => (
          <div key={product._id} className="col-lg-4 col-md-6 mb-4">
            <ProductCard product={product} />
          </div>
        ))}
        {filtered.length === 0 && <p>No products found.</p>}
        <div className="mb-3">
  {['All', 'Art', 'Fashion', 'Phones'].map((cat) => (
    <button
      key={cat}
      className="btn btn-outline-primary me-2"
      onClick={() => {
        if (cat === 'All') setFiltered(products);
        else
          setFiltered(
            products.filter((p) => p.category.toLowerCase() === cat.toLowerCase())
          );
      }}
    >
      {cat}
    </button>
  ))}
</div>

      </div>
    </div>
    
  );
}
