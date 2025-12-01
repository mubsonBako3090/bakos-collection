'use client';
import { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value); // pass query to parent
  };

  return (
    <div className="mb-3">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        className="form-control"
        placeholder="Search products..."
      />
    </div>
  );
}
