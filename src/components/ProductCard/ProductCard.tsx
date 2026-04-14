'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import styles from './ProductCard.module.css';

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [selectedWeight, setSelectedWeight] = useState(product.weight_options?.[0] || '100g');
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    addItem(product, 1, selectedWeight);
    showToast(`${product.name} added to cart!`, 'success', '🍵');
    await new Promise(r => setTimeout(r, 600));
    setAdding(false);
  };

  return (
    <Link href={`/shop/${product.slug}`} className={styles.card} id={`product-card-${product.id}`}>
      {/* Image */}
      <div className={styles.imageWrap}>
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          style={{ objectFit: 'cover' }}
          className={styles.image}
        />
        <div className={styles.imageOverlay} />

        {/* Category badge */}
        <div className={styles.categoryBadge}>
          {product.category}
        </div>

        {/* Quick Add (appears on hover) */}
        <div className={styles.quickActions}>
          {product.weight_options && product.weight_options.length > 1 && (
            <div className={styles.weightPills} onClick={e => e.preventDefault()}>
              {product.weight_options.map(w => (
                <button
                  key={w}
                  className={`${styles.weightPill} ${selectedWeight === w ? styles.weightPillActive : ''}`}
                  onClick={e => { e.preventDefault(); e.stopPropagation(); setSelectedWeight(w); }}
                >
                  {w}
                </button>
              ))}
            </div>
          )}
          <button
            onClick={handleAddToCart}
            className={`${styles.addBtn} ${adding ? styles.adding : ''}`}
            aria-label={`Add ${product.name} to cart`}
            id={`add-to-cart-${product.id}`}
          >
            {adding ? (
              <span className={styles.addBtnSpinner} />
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.origin}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {product.origin || 'India'}
        </div>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.description}>{product.description}</p>
        <div className={styles.footer}>
          <div className={styles.price}>
            <span className={styles.priceFrom}>from</span>
            <span className={styles.priceValue}>₹{product.price.toLocaleString('en-IN')}</span>
          </div>
          <div className={styles.stockIndicator}>
            <span className={`${styles.stockDot} ${product.stock < 20 ? styles.stockLow : styles.stockGood}`} />
            <span className={styles.stockLabel}>
              {product.stock < 20 ? `Only ${product.stock} left` : 'In Stock'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
