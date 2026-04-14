'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { CATEGORIES } from '@/lib/data';
import { Product, supabase } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard/ProductCard';
import styles from './page.module.css';

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [searchQuery, setSearchQuery] = useState('');

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (data) setProducts(data);
      setLoading(false);
    }
    getProducts();
  }, []);

  const filtered = useMemo(() => {
    let result = [...products];

    if (activeCategory !== 'all') {
      result = result.filter(p => p.category === activeCategory);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.origin || '').toLowerCase().includes(q)
      );
    }

    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'featured': result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0)); break;
    }

    return result;
  }, [products, activeCategory, sortBy, priceRange, searchQuery]);

  return (
    <div className={styles.page}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className="container">
          <p className={styles.eyebrow}>Our Collection</p>
          <h1 className={styles.title}>The Tea Shop</h1>
          <p className={styles.subtitle}>
            Explore our collection of exceptional teas, handcrafted from India's finest gardens.
          </p>
        </div>
      </div>

      <div className="container">
        {/* Search & Sort Bar */}
        <div className={styles.controlBar}>
          <div className={styles.searchWrap}>
            <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input
              type="text"
              placeholder="Search teas, origins..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={styles.searchInput}
              id="shop-search-input"
            />
          </div>

          <div className={styles.sortWrap}>
            <label className={styles.sortLabel}>Sort by:</label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="form-select"
              style={{ width: 'auto', minWidth: 160 }}
              id="shop-sort-select"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>
        </div>

        <div className={styles.layout}>
          {/* Sidebar Filters */}
          <aside className={styles.sidebar}>
            <div className={styles.filterSection}>
              <h3 className={styles.filterTitle}>Category</h3>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`${styles.filterBtn} ${activeCategory === cat.id ? styles.filterBtnActive : ''}`}
                  id={`filter-cat-${cat.id}`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span className={styles.filterCount}>
                    {cat.id === 'all' ? products.length : products.filter(p => p.category === cat.id).length}
                  </span>
                </button>
              ))}
            </div>

            <div className={styles.filterSection}>
              <h3 className={styles.filterTitle}>Price Range</h3>
              <div className={styles.priceRange}>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="50"
                  value={priceRange[1]}
                  onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className={styles.rangeInput}
                />
                <div className={styles.priceLabels}>
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className={styles.products}>
            <div className={styles.resultsInfo}>
              <span>{filtered.length} product{filtered.length !== 1 ? 's' : ''} found</span>
              {activeCategory !== 'all' && (
                <button
                  onClick={() => setActiveCategory('all')}
                  className={styles.clearFilter}
                >
                  Clear filter ✕
                </button>
              )}
            </div>

            {filtered.length === 0 ? (
              <div className={styles.noResults}>
                <span style={{ fontSize: '3rem' }}>🔍</span>
                <h3>No teas found</h3>
                <p>Try adjusting your search or filter criteria</p>
                <button onClick={() => { setActiveCategory('all'); setSearchQuery(''); }} className="btn btn-secondary">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className={styles.grid}>
                {filtered.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
