'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Banner } from '@/lib/supabase';
import styles from './BannerCarousel.module.css';

const AUTO_ADVANCE_MS = 5000;
const PROGRESS_TICK_MS = 50;

export default function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Fetch banners from Supabase ──
  useEffect(() => {
    async function fetchBanners() {
      try {
        const { createClient } = await import('@/utils/supabase/client');
        const supabase = createClient();
        const { data } = await supabase
          .from('banners')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (data && data.length > 0) {
          setBanners(data);
        }
      } catch (err) {
        console.error('Failed to fetch banners:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchBanners();
  }, []);

  // ── Navigate helpers ──
  const goTo = useCallback(
    (index: number) => {
      if (banners.length === 0) return;
      setCurrent((index + banners.length) % banners.length);
      setProgress(0);
    },
    [banners.length],
  );

  const goNext = useCallback(() => goTo(current + 1), [current, goTo]);
  const goPrev = useCallback(() => goTo(current - 1), [current, goTo]);

  // ── Auto-advance timer ──
  useEffect(() => {
    if (banners.length <= 1 || paused) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
      return;
    }

    // Progress bar
    progressRef.current = setInterval(() => {
      setProgress((p) => {
        const next = p + (PROGRESS_TICK_MS / AUTO_ADVANCE_MS) * 100;
        return next >= 100 ? 100 : next;
      });
    }, PROGRESS_TICK_MS);

    // Auto-advance
    timerRef.current = setInterval(() => {
      goNext();
    }, AUTO_ADVANCE_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [banners.length, paused, current, goNext]);

  // ── Keyboard navigation ──
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    },
    [goNext, goPrev],
  );

  // ── Render nothing if no banners ──
  if (loading) {
    return <div className={styles.skeleton} aria-label="Loading banners" />;
  }

  if (banners.length === 0) {
    return null;
  }

  const showControls = banners.length > 1;

  return (
    <section
      className={styles.carousel}
      id="banner-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="Promotional banner carousel"
      aria-roledescription="carousel"
    >
      {/* ── Track ── */}
      <div
        className={styles.carouselTrack}
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((banner, i) => (
          <div
            key={banner.id}
            className={styles.slide}
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${i + 1} of ${banners.length}${banner.title ? `: ${banner.title}` : ''}`}
          >
            <Image
              src={banner.image_url}
              alt={banner.title || `Banner ${i + 1}`}
              fill
              priority={i === 0}
              sizes="100vw"
              className={styles.slideImage}
            />
            <div className={styles.slideOverlay} />

            {/* Optional text overlay */}
            {(banner.title || banner.subtitle || banner.link_url) && (
              <div className={styles.slideContent}>
                {banner.title && <h2 className={styles.slideTitle}>{banner.title}</h2>}
                {banner.subtitle && <p className={styles.slideSubtitle}>{banner.subtitle}</p>}
                {banner.link_url && (
                  <Link href={banner.link_url} className={styles.slideLink}>
                    {banner.link_text || 'Learn More'}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Persistent Hero Overlay (always visible on top of slides) ── */}
      <div className={styles.heroOverlay}>
        <div className={styles.heroContent}>
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
      </div>

      {/* ── Arrows ── */}
      {showControls && (
        <>
          <button
            className={`${styles.arrowBtn} ${styles.arrowPrev}`}
            onClick={goPrev}
            aria-label="Previous banner"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            className={`${styles.arrowBtn} ${styles.arrowNext}`}
            onClick={goNext}
            aria-label="Next banner"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </>
      )}

      {/* ── Dot indicators ── */}
      {showControls && (
        <div className={styles.dots} role="tablist" aria-label="Banner navigation">
          {banners.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
              onClick={() => goTo(i)}
              role="tab"
              aria-selected={i === current}
              aria-label={`Go to banner ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* ── Progress bar ── */}
      {showControls && !paused && (
        <div
          className={styles.progressBar}
          style={{ width: `${progress}%` }}
          aria-hidden="true"
        />
      )}
    </section>
  );
}
