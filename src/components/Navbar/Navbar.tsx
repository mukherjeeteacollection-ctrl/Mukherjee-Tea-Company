'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Logo from '../Logo/Logo';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { totalItems, toggleCart } = useCart();
  const { user, profile, role, signOut } = useAuth();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/about', label: 'Our Story' },
    { href: '/contact', label: 'Contact' },
  ];

  const handleSignOut = async () => {
    setProfileOpen(false);
    setMobileOpen(false);
    await signOut();
    router.push('/');
  };

  // Derive display name + avatar initials
  const displayName = profile?.name || user?.email?.split('@')[0] || 'User';
  const initials = displayName.slice(0, 2).toUpperCase();

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

            {/* Cart */}
            <button
              onClick={toggleCart}
              className={styles.cartBtn}
              aria-label={`Open cart (${totalItems} items)`}
              id="cart-toggle-btn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {totalItems > 0 && (
                <span className={styles.cartBadge}>{totalItems > 9 ? '9+' : totalItems}</span>
              )}
            </button>

            {/* Auth: logged out */}
            {!user && (
              <Link
                href="/login"
                id="navbar-login-btn"
                className={styles.loginBtn}
              >
                Log In
              </Link>
            )}

            {/* Auth: logged in — profile dropdown */}
            {user && (
              <div className={styles.profileWrap} ref={profileRef}>
                <button
                  id="navbar-profile-btn"
                  className={styles.avatarBtn}
                  onClick={() => setProfileOpen(prev => !prev)}
                  aria-label="Open profile menu"
                  aria-expanded={profileOpen}
                >
                  <span className={styles.avatarInitials}>{initials}</span>
                  {role === 'admin' && (
                    <span className={styles.adminDot} title="Admin" />
                  )}
                </button>

                {profileOpen && (
                  <div className={styles.dropdown}>
                    <div className={styles.dropdownHeader}>
                      <p className={styles.dropdownName}>{displayName}</p>
                      <p className={styles.dropdownEmail}>{user.email}</p>
                      <span className={`${styles.roleBadge} ${role === 'admin' ? styles.roleBadgeAdmin : styles.roleBadgeCustomer}`}>
                        {role === 'admin' ? '⚡ Admin' : '🛒 Customer'}
                      </span>
                    </div>
                    <div className={styles.dropdownDivider} />
                    {role === 'admin' && (
                      <Link
                        href="/admin"
                        className={styles.dropdownItem}
                        onClick={() => setProfileOpen(false)}
                        id="navbar-admin-link"
                      >
                        <span>🖥️</span> Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
                      id="navbar-signout-btn"
                    >
                      <span>🚪</span> Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}

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

          {/* Mobile user profile area */}
          {user && (
            <div className={styles.mobileProfile}>
              <div className={styles.mobileAvatarCircle}>{initials}</div>
              <div>
                <p className={styles.mobileProfileName}>{displayName}</p>
                <span className={`${styles.roleBadge} ${role === 'admin' ? styles.roleBadgeAdmin : styles.roleBadgeCustomer}`} style={{ fontSize: '0.62rem' }}>
                  {role === 'admin' ? '⚡ Admin' : '🛒 Customer'}
                </span>
              </div>
            </div>
          )}

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

          {/* Mobile auth actions */}
          {!user ? (
            <Link
              href="/login"
              className="btn btn-ghost"
              onClick={() => setMobileOpen(false)}
              style={{ width: '100%', justifyContent: 'center', marginTop: 8, border: '1px solid var(--glass-border)' }}
              id="mobile-login-btn"
            >
              🔑 Log In / Sign Up
            </Link>
          ) : (
            <>
              {role === 'admin' && (
                <Link
                  href="/admin"
                  className="btn btn-secondary"
                  onClick={() => setMobileOpen(false)}
                  style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
                >
                  🖥️ Admin Dashboard
                </Link>
              )}
              <button
                onClick={handleSignOut}
                className="btn btn-ghost"
                style={{ width: '100%', justifyContent: 'center', marginTop: 8, color: '#f87171' }}
              >
                🚪 Sign Out
              </button>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
