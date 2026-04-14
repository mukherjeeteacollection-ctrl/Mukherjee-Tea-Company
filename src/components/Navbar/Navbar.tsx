'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import Logo from '../Logo/Logo';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { totalItems, toggleCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/about', label: 'Our Story' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.inner}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <Logo height={42} />
            <div className={styles.logoText}>
              <span className={styles.logoMain}>MUKHERJEE</span>
              <span className={styles.logoSub}>Tea Company</span>
              <span className={styles.logoSub}>Since - 1971</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className={styles.desktopNav}>
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className={styles.navLink}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className={styles.actions}>
            <Link href="/shop" className="btn btn-sm btn-primary" style={{ padding: '8px 22px' }}>
              Shop Now
            </Link>

            <button
              onClick={toggleCart}
              className={styles.cartBtn}
              aria-label={`Open cart (${totalItems} items)`}
              id="cart-toggle-btn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {totalItems > 0 && (
                <span className={styles.cartBadge}>{totalItems > 9 ? '9+' : totalItems}</span>
              )}
            </button>

            <button
              className={styles.mobileMenuBtn}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              id="mobile-menu-btn"
            >
              <span className={`${styles.hamburger} ${mobileOpen ? styles.hamburgerOpen : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`${styles.mobileOverlay} ${mobileOpen ? styles.mobileOverlayOpen : ''}`}
        onClick={() => setMobileOpen(false)}
      />
      <nav className={`${styles.mobileNav} ${mobileOpen ? styles.mobileNavOpen : ''}`}>
        <div className={styles.mobileNavInner}>
          <div className={styles.mobileLogoRow}>
            <Logo height={32} />
            <div className={styles.logoText}>
              <span className={styles.logoMain} style={{ fontSize: '0.95rem' }}>MUKHERJEE</span>
              <span className={styles.logoSub} style={{ fontSize: '0.5rem', letterSpacing: '2px' }}>Tea Company</span>
              <span className={styles.logoSub} style={{ fontSize: '0.5rem', letterSpacing: '2px' }}>Since - 1971</span>
            </div>
          </div>
          <div className={styles.divider} />
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={styles.mobileNavLink}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className={styles.divider} />
          <Link
            href="/shop"
            className="btn btn-primary"
            onClick={() => setMobileOpen(false)}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Shop All Teas
          </Link>
          <button
            onClick={() => { toggleCart(); setMobileOpen(false); }}
            className="btn btn-secondary"
            style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
          >
            🛒 View Cart {totalItems > 0 && `(${totalItems})`}
          </button>
        </div>
      </nav>
    </>
  );
}
