'use client';

import React, { useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PRODUCTS } from '@/lib/data';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import ProductCard from '@/components/ProductCard/ProductCard';
import styles from './page.module.css';

const BREWING: Record<string, { temp: string; time: string; ratio: string; tips: string }> = {
  'Black Tea':       { temp: '95–100°C', time: '3–5 min', ratio: '2g / 200ml', tips: 'Can be enjoyed with or without milk. Avoid over-steeping to prevent bitterness.' },
  'Green Tea':       { temp: '75–80°C',  time: '2–3 min', ratio: '2g / 200ml', tips: 'Never use boiling water. Multiple infusions possible.' },
  'White Tea':       { temp: '70–75°C',  time: '3–5 min', ratio: '3g / 200ml', tips: 'Delicate leaves need cool water. Enjoy naturally, without milk.' },
  'Oolong Tea':      { temp: '85–90°C',  time: '3–4 min', ratio: '3g / 150ml', tips: 'Can be steeped 4–6 times. Flavor evolves beautifully with each infusion.' },
  'Herbal & Blends': { temp: '95–100°C', time: '5–7 min', ratio: '2g / 200ml', tips: 'Caffeine-free. Perfect for evenings. Sweeten with honey if desired.' },
};

function ProductDetail({ slug }: { slug: string }) {
  const product = PRODUCTS.find(p => p.slug === slug);
  const { addItem } = useCart();
  const { showToast } = useToast();

  const [selectedWeight, setSelectedWeight] = useState(product?.weight_options?.[0] || '100g');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'brewing' | 'origin'>('description');

  if (!product) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20, textAlign: 'center' }}>
        <span style={{ fontSize: '3rem' }}>🍵</span>
        <h1 style={{ fontFamily: 'Outfit', fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>Tea Not Found</h1>
        <p style={{ color: 'var(--text-secondary)' }}>We could not find that product. Browse our full collection.</p>
        <Link href="/shop" className="btn btn-primary">Back to Shop</Link>
      </div>
    );
  }

  const related = PRODUCTS.filter(p => p.id !== product.id && p.category === product.category).slice(0, 3);
  const brewing = BREWING[product.category] ?? BREWING['Black Tea'];

  const handleAdd = async () => {
    setAdding(true);
    addItem(product, quantity, selectedWeight);
    showToast(`${product.name} added to cart! 🍵`, 'success', '✓');
    await new Promise(r => setTimeout(r, 700));
    setAdding(false);
  };

  return (
    <div className={styles.page}>
      {/* Breadcrumb */}
      <div className="container">
        <div className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/shop">Shop</Link>
          <span>/</span>
          <span>{product.name}</span>
        </div>
      </div>

      {/* Main Product */}
      <section className={styles.productSection}>
        <div className="container">
          <div className={styles.productGrid}>
            {/* Image */}
            <div className={styles.imagePanel}>
              <div className={styles.imageWrap}>
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  priority
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className={styles.imageTopLeft}>
                  <span className="badge badge-gold">{product.category}</span>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className={styles.infoPanel}>
              <div className={styles.origin}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                {product.origin}
              </div>

              <h1 className={styles.productName}>{product.name}</h1>
              <p className={styles.productDesc}>{product.description}</p>

              <div className={styles.ratingRow}>
                <span className={styles.stars}>★★★★★</span>
                <span className={styles.ratingCount}>(47 reviews)</span>
                <span className={styles.stockStatus}>
                  <span className={`${styles.stockDot} ${product.stock < 20 ? styles.stockDotLow : styles.stockDotGood}`} />
                  {product.stock < 20 ? `Only ${product.stock} left` : 'In Stock'}
                </span>
              </div>

              <div className={styles.priceSection}>
                <div className={styles.price}>
                  ₹{product.price.toLocaleString('en-IN')}
                </div>
                <div className={styles.priceNote}>per {selectedWeight}</div>
              </div>

              {/* Weight */}
              {product.weight_options && product.weight_options.length > 0 && (
                <div className={styles.optionGroup}>
                  <label className={styles.optionLabel}>
                    Size: <span className={styles.optionValue}>{selectedWeight}</span>
                  </label>
                  <div className={styles.weightOptions}>
                    {product.weight_options.map(w => (
                      <button
                        key={w}
                        onClick={() => setSelectedWeight(w)}
                        className={`${styles.weightBtn} ${selectedWeight === w ? styles.weightBtnActive : ''}`}
                        id={`weight-btn-${w}`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className={styles.optionGroup}>
                <label className={styles.optionLabel}>Quantity</label>
                <div className={styles.qtyRow}>
                  <div className={styles.qtyControl}>
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className={styles.qtyBtn} aria-label="Decrease">−</button>
                    <span className={styles.qtyNum}>{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className={styles.qtyBtn} aria-label="Increase">+</button>
                  </div>
                  <span className={styles.totalPrice}>Total: ₹{(product.price * quantity).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* CTAs */}
              <div className={styles.ctaRow}>
                <button
                  onClick={handleAdd}
                  disabled={adding}
                  className="btn btn-primary btn-lg"
                  style={{ flex: 1 }}
                  id="product-add-to-cart"
                >
                  {adding ? (
                    <><div className={styles.spinner} /> Adding...</>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <path d="M16 10a4 4 0 01-8 0"/>
                      </svg>
                      Add to Cart
                    </>
                  )}
                </button>
                <Link
                  href="/checkout"
                  onClick={() => addItem(product, quantity, selectedWeight)}
                  className="btn btn-secondary btn-lg"
                  id="product-buy-now"
                >
                  Buy Now
                </Link>
              </div>

              {/* Trust badges */}
              <div className={styles.trustBadges}>
                {[
                  { icon: '🌿', text: 'Organic Certified' },
                  { icon: '📦', text: 'Free shipping ₹999+' },
                  { icon: '↩️', text: '7-day returns' },
                  { icon: '🔒', text: 'Secure payment' },
                ].map(b => (
                  <div key={b.text} className={styles.trustBadge}>
                    <span>{b.icon}</span>
                    <span>{b.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className={styles.tabsSection}>
        <div className="container">
          <div className={styles.tabs}>
            {(['description', 'brewing', 'origin'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                id={`product-tab-${tab}`}
              >
                {tab === 'description' ? '📖 Description' : tab === 'brewing' ? '☕ Brewing Guide' : '🗺️ Origin'}
              </button>
            ))}
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'description' && (
              <div className={styles.descriptionContent}>
                <p>{product.long_description || product.description}</p>
              </div>
            )}

            {activeTab === 'brewing' && (
              <div className={styles.brewingContent}>
                <div className={styles.brewingGrid}>
                  {[
                    { icon: '🌡️', label: 'Water Temperature', value: brewing.temp },
                    { icon: '⏱️', label: 'Steep Time',         value: brewing.time },
                    { icon: '⚖️', label: 'Tea to Water Ratio', value: brewing.ratio },
                  ].map(b => (
                    <div key={b.label} className={styles.brewingCard}>
                      <span className={styles.brewingIcon}>{b.icon}</span>
                      <span className={styles.brewingLabel}>{b.label}</span>
                      <span className={styles.brewingValue}>{b.value}</span>
                    </div>
                  ))}
                </div>
                <div className={styles.brewingTip}>
                  <span>💡</span>
                  <p><strong>Pro Tip:</strong> {brewing.tips}</p>
                </div>
              </div>
            )}

            {activeTab === 'origin' && (
              <div className={styles.originContent}>
                <div className={styles.originCard}>
                  <span style={{ fontSize: '3rem' }}>🏔️</span>
                  <div>
                    <h3>{product.origin}</h3>
                    <p>
                      This tea is sourced directly from carefully selected estates in {product.origin},
                      known for their exceptional terroir and traditional cultivation methods.
                      The unique combination of altitude, climate, and soil composition gives this tea its distinct character.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="section">
          <div className="container">
            <div style={{ marginBottom: 40 }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 3, color: 'var(--gold-primary)', marginBottom: 8 }}>
                You May Also Like
              </p>
              <h2 style={{ fontFamily: 'Outfit', fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Related Teas
              </h2>
            </div>
            <div className="grid-3">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  return <ProductDetail slug={resolvedParams.slug} />;
}
