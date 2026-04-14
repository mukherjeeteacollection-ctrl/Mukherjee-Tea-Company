import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PRODUCTS, CATEGORIES } from '@/lib/data';
import ProductCard from '@/components/ProductCard/ProductCard';
import styles from './page.module.css';

export default function HomePage() {
  const featuredProducts = PRODUCTS.filter(p => p.is_featured);

  return (
    <>
      {/* ============================================================
          HERO
          ============================================================ */}
      <section className={styles.hero} id="hero">
        <div className={styles.heroBg}>
          <Image
            src="/hero-tea-estate.png"
            alt="Mukherjee Tea Estate — Darjeeling highlands"
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
          />
          <div className={styles.heroBgOverlay} />
        </div>

        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroBadge}>
            <span>🌿</span>
            <span>100% Artisanal · Single Estate · India</span>
          </div>

          <h1 className={styles.heroTitle}>
            <span className="font-serif" style={{ display: 'block', fontStyle: 'italic', fontSize: '0.55em', fontWeight: 400, color: 'var(--text-secondary)', marginBottom: 8, letterSpacing: '0.1em' }}>
              The essence of
            </span>
            Where Every Sip
            <span className="text-gradient" style={{ display: 'block' }}>Tells a Story</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Handcrafted teas from the mist-wrapped gardens of Darjeeling & Assam.
            Generations of expertise. One exceptional cup.
          </p>

          <div className={styles.heroActions}>
            <Link href="/shop" className="btn btn-primary btn-xl" id="hero-shop-btn">
              Explore Our Teas
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link href="/about" className="btn btn-secondary btn-xl">
              Our Story
            </Link>
          </div>

          <div className={styles.heroStats}>
            {[
              { value: '8+', label: 'Unique Varieties' },
              { value: '100%', label: 'Organic Certified' },
              { value: '3rd', label: 'Generation Expertise' },
              { value: '₹999+', label: 'Free Shipping' },
            ].map(stat => (
              <div key={stat.label} className={styles.heroStat}>
                <span className={styles.heroStatValue}>{stat.value}</span>
                <span className={styles.heroStatLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className={styles.scrollIndicator}>
          <div className={styles.scrollDot} />
        </div>
      </section>

      {/* ============================================================
          CATEGORY STRIP
          ============================================================ */}
      <section className={styles.categoryStrip} id="categories">
        <div className="container">
          <div className={styles.categoryScroll}>
            {CATEGORIES.slice(1).map(cat => (
              <Link
                key={cat.id}
                href={`/shop?category=${encodeURIComponent(cat.id)}`}
                className={styles.categoryChip}
              >
                <span className={styles.categoryEmoji}>{cat.icon}</span>
                <span>{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          FEATURED PRODUCTS
          ============================================================ */}
      <section className="section" id="featured">
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionEyebrow}>Featured Collection</p>
              <h2 className={styles.sectionTitle}>Our Finest Offerings</h2>
            </div>
            <Link href="/shop" className="btn btn-secondary">
              View All Teas →
            </Link>
          </div>

          <div className="grid-auto" style={{ gap: 24 }}>
            {featuredProducts.map((product, i) => (
              <div
                key={product.id}
                className="animate-fade-up"
                style={{ animationDelay: `${i * 100}ms`, opacity: 0 }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          BRAND STORY FEATURE BANNER
          ============================================================ */}
      <section className={styles.storyBanner} id="story">
        <div className="container">
          <div className={styles.storyGrid}>
            <div className={styles.storyImageWrap}>
              <div className={styles.storyImageInner}>
                <Image
                  src="/darjeeling-gold.png"
                  alt="Darjeeling Gold Tea — Mukherjee Tea Company"
                  fill
                  style={{ objectFit: 'cover' }}
                />
                <div className={styles.storyImageOverlay} />
              </div>
              <div className={styles.storyBadge}>
                <span className={styles.storyBadgeNum}>3rd</span>
                <span className={styles.storyBadgeText}>Generation<br />Tea Masters</span>
              </div>
            </div>

            <div className={styles.storyContent}>
              <p className={styles.sectionEyebrow}>Our Heritage</p>
              <h2 className={styles.sectionTitle}>
                Crafted with<br />
                <span className="text-gradient">Generations of Love</span>
              </h2>
              <div className={styles.goldLine} />
              <p className={styles.storyText}>
                The Mukherjee Tea Company was born from a singular devotion — to source and share the most extraordinary teas that India's highlands have to offer. We work directly with small-estate farmers, ensuring fair prices, sustainable practices, and teas of unparalleled quality.
              </p>
              <p className={styles.storyText}>
                Every batch is carefully hand-selected, tested for quality, and packed within hours of processing to preserve the full spectrum of flavors and aromas.
              </p>
              <div className={styles.storyFeatures}>
                {[
                  { icon: '🌿', text: 'Directly Sourced from Estates' },
                  { icon: '🔬', text: 'Lab-Tested for Purity' },
                  { icon: '🤝', text: 'Fair Trade Certified' },
                  { icon: '📦', text: 'Freshness-Sealed Packaging' },
                ].map(f => (
                  <div key={f.text} className={styles.storyFeature}>
                    <span>{f.icon}</span>
                    <span>{f.text}</span>
                  </div>
                ))}
              </div>
              <Link href="/about" className="btn btn-primary">
                Discover Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          PROCESS SECTION
          ============================================================ */}
      <section className="section" id="process">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p className={styles.sectionEyebrow}>The Journey</p>
            <h2 className={styles.sectionTitle}>From Garden to Cup</h2>
          </div>

          <div className={styles.processGrid}>
            {[
              { step: '01', icon: '🌱', title: 'Hand-Plucked', desc: 'Only the finest two leaves and a bud are selected by skilled workers at peak freshness.' },
              { step: '02', icon: '☀️', title: 'Sun Withered', desc: 'Fresh leaves are gently withered under controlled conditions to begin flavor development.' },
              { step: '03', icon: '🔄', title: 'Precision Processed', desc: 'Each tea type undergoes its unique rolling, oxidation or firing process to reveal its character.' },
              { step: '04', icon: '🧪', title: 'Quality Tested', desc: 'Every batch is hand-tasted by experts and laboratory-tested before it enters our selection.' },
              { step: '05', icon: '📦', title: 'Freshness Sealed', desc: 'Packed within hours of processing in our oxygen-barrier, eco-friendly packaging.' },
              { step: '06', icon: '🚀', title: 'Delivered to You', desc: 'Shipped with care so you receive the same quality as if you were standing on the estate.' },
            ].map((step, i) => (
              <div key={step.step} className={styles.processCard}>
                <div className={styles.processStep}>{step.step}</div>
                <div className={styles.processIcon}>{step.icon}</div>
                <h3 className={styles.processTitle}>{step.title}</h3>
                <p className={styles.processDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          TESTIMONIALS
          ============================================================ */}
      <section className="section-sm" id="testimonials" style={{ paddingBottom: 100 }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p className={styles.sectionEyebrow}>Customer Love</p>
            <h2 className={styles.sectionTitle}>What Our Customers Say</h2>
          </div>

          <div className={styles.testimonialGrid}>
            {[
              { name: 'Priya S.', location: 'Mumbai', stars: 5, text: 'The Darjeeling Gold is absolutely exquisite. The muscatel character is pronounced and the aroma is intoxicating. I\'ve been ordering for 6 months now.' },
              { name: 'Rahul M.', location: 'Bangalore', stars: 5, text: 'Silver Needle White Tea changed how I think about tea. So delicate, so complex. The packaging is premium and everything arrived in perfect condition.' },
              { name: 'Ananya K.', location: 'Delhi', stars: 5, text: 'The Jasmine Pearl is poetry in a cup. I brew it 3 times and each infusion reveals something new. This is the real deal — real artisanal quality.' },
            ].map(t => (
              <div key={t.name} className={styles.testimonialCard}>
                <div className={styles.testimonialStars}>
                  {'★'.repeat(t.stars)}
                </div>
                <p className={styles.testimonialText}>"{t.text}"</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.testimonialAvatar}>
                    {t.name[0]}
                  </div>
                  <div>
                    <p className={styles.testimonialName}>{t.name}</p>
                    <p className={styles.testimonialLocation}>{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          CTA BANNER
          ============================================================ */}
      <section className={styles.ctaBanner} id="cta">
        <div className="container">
          <div className={styles.ctaContent}>
            <span style={{ fontSize: '3rem' }}>🍵</span>
            <h2 className={styles.ctaTitle}>Ready to Begin Your Journey?</h2>
            <p className={styles.ctaSubtitle}>
              Explore our collection and discover your perfect cup. Free shipping on orders above ₹999.
            </p>
            <Link href="/shop" className="btn btn-primary btn-xl" id="cta-shop-btn">
              Shop All Teas
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
