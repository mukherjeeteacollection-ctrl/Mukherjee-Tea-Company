'use client';

import React, { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product, supabase } from '@/lib/supabase';
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
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { showToast } = useToast();

  const [selectedWeight, setSelectedWeight] = useState('100g');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await (supabase.from('products') as any)
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (data) {
        setProduct(data);
        if (data.weight_options?.[0]) {
          setSelectedWeight(data.weight_options[0]);
        }
        
        // Fetch related products
        const { data: relatedData } = await (supabase.from('products') as any)
          .select('*')
          .eq('category', data.category)
          .neq('id', data.id)
          .limit(3);
        
        if (relatedData) setRelated(relatedData);
      }
      setLoading(false);
    }
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className={styles.spinner} />
      </div>
    );
  }

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

      {/* ══════════════════════════════════════════════
          THE EXPERIENCE
          ══════════════════════════════════════════════ */}
      {(product.experience || product.long_description) && (
        <section className={styles.tabsSection}>
          <div className="container">
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 3, color: 'var(--gold-primary)', marginBottom: 8 }}>The Experience</p>
              <h2 style={{ fontFamily: 'Outfit', fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 20 }}>
                A Journey in Every Cup
              </h2>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
                {product.experience || product.long_description || product.description}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════
          PRODUCT DETAILS
          ══════════════════════════════════════════════ */}
      {(product.tea_type || product.flavor_profile || product.aroma || product.caffeine_level || product.benefits) && (
        <section style={{ padding: '60px 0', background: 'var(--surface-secondary, rgba(255,255,255,0.02))' }}>
          <div className="container">
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 3, color: 'var(--gold-primary)', marginBottom: 8, textAlign: 'center' }}>Product Details</p>
              <h2 style={{ fontFamily: 'Outfit', fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 36, textAlign: 'center' }}>
                Know Your Tea
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
                {product.tea_type && (
                  <div style={{ background: 'var(--dark-card, rgba(255,255,255,0.04))', borderRadius: 16, padding: '24px 20px', textAlign: 'center', border: '1px solid var(--border-subtle, rgba(255,255,255,0.06))' }}>
                    <span style={{ fontSize: '2rem', display: 'block', marginBottom: 8 }}>🍃</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--text-muted)' }}>Type</span>
                    <p style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginTop: 4 }}>{product.tea_type}</p>
                  </div>
                )}
                {product.flavor_profile && (
                  <div style={{ background: 'var(--dark-card, rgba(255,255,255,0.04))', borderRadius: 16, padding: '24px 20px', textAlign: 'center', border: '1px solid var(--border-subtle, rgba(255,255,255,0.06))' }}>
                    <span style={{ fontSize: '2rem', display: 'block', marginBottom: 8 }}>👅</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--text-muted)' }}>Flavor Profile</span>
                    <p style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginTop: 4 }}>{product.flavor_profile}</p>
                  </div>
                )}
                {product.aroma && (
                  <div style={{ background: 'var(--dark-card, rgba(255,255,255,0.04))', borderRadius: 16, padding: '24px 20px', textAlign: 'center', border: '1px solid var(--border-subtle, rgba(255,255,255,0.06))' }}>
                    <span style={{ fontSize: '2rem', display: 'block', marginBottom: 8 }}>🌸</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--text-muted)' }}>Aroma</span>
                    <p style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginTop: 4 }}>{product.aroma}</p>
                  </div>
                )}
                {product.caffeine_level && (
                  <div style={{ background: 'var(--dark-card, rgba(255,255,255,0.04))', borderRadius: 16, padding: '24px 20px', textAlign: 'center', border: '1px solid var(--border-subtle, rgba(255,255,255,0.06))' }}>
                    <span style={{ fontSize: '2rem', display: 'block', marginBottom: 8 }}>⚡</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--text-muted)' }}>Caffeine Level</span>
                    <p style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginTop: 4 }}>{product.caffeine_level}</p>
                  </div>
                )}
                {product.benefits && (
                  <div style={{ background: 'var(--dark-card, rgba(255,255,255,0.04))', borderRadius: 16, padding: '24px 20px', textAlign: 'center', border: '1px solid var(--border-subtle, rgba(255,255,255,0.06))', gridColumn: 'span 2' }}>
                    <span style={{ fontSize: '2rem', display: 'block', marginBottom: 8 }}>💚</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--text-muted)' }}>Benefits</span>
                    <p style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginTop: 4 }}>{product.benefits}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════
          THE PERFECT STEEP
          ══════════════════════════════════════════════ */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 3, color: 'var(--gold-primary)', marginBottom: 8, textAlign: 'center' }}>The Perfect Steep</p>
            <h2 style={{ fontFamily: 'Outfit', fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8, textAlign: 'center' }}>
              Brewing Guide
            </h2>
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.9rem', marginBottom: 36, maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>
              To enjoy the full complexity of these leaves without any bitterness, follow these steps:
            </p>
            <div className={styles.brewingGrid}>
              {[
                { icon: '🌡️', label: 'Water Temp', value: product.steep_temp || brewing.temp },
                { icon: '⚖️', label: 'Amount', value: product.steep_amount || brewing.ratio },
                { icon: '⏱️', label: 'Steep Time', value: product.steep_time || brewing.time },
                { icon: '🔄', label: 'Re-steeping', value: product.steep_resteep || 'Enjoy fresh' },
              ].map(b => (
                <div key={b.label} className={styles.brewingCard}>
                  <span className={styles.brewingIcon}>{b.icon}</span>
                  <span className={styles.brewingLabel}>{b.label}</span>
                  <span className={styles.brewingValue}>{b.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          WHY CHOOSE
          ══════════════════════════════════════════════ */}
      {product.why_choose && (
        <section style={{ padding: '60px 0', background: 'var(--surface-secondary, rgba(255,255,255,0.02))' }}>
          <div className="container">
            <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
              <span style={{ fontSize: '3rem', display: 'block', marginBottom: 16 }}>💎</span>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 3, color: 'var(--gold-primary)', marginBottom: 8 }}>Why Choose {product.name}</p>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
                {product.why_choose}
              </p>
            </div>
          </div>
        </section>
      )}

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
