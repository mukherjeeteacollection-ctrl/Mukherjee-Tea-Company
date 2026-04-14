'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import styles from './CartDrawer.module.css';

export default function CartDrawer() {
  const { state, removeItem, updateQuantity, closeCart, subtotal, shipping, total, totalItems } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [closeCart]);

  useEffect(() => {
    document.body.style.overflow = state.isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [state.isOpen]);

  return (
    <>
      <div
        className={`${styles.overlay} ${state.isOpen ? styles.overlayOpen : ''}`}
        onClick={closeCart}
      />
      <aside
        ref={drawerRef}
        className={`${styles.drawer} ${state.isOpen ? styles.drawerOpen : ''}`}
        aria-label="Shopping Cart"
        aria-hidden={!state.isOpen}
        id="cart-drawer"
      >
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Your Cart</h2>
            <p className={styles.subtitle}>
              {totalItems === 0
                ? 'Your cart is empty'
                : `${totalItems} item${totalItems !== 1 ? 's' : ''}`}
            </p>
          </div>
          <button onClick={closeCart} className={styles.closeBtn} aria-label="Close cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className={styles.items}>
          {state.items.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>🍵</div>
              <p className={styles.emptyTitle}>Your cart is empty</p>
              <p className={styles.emptyText}>Discover our premium tea collection</p>
              <Link href="/shop" onClick={closeCart} className="btn btn-primary" style={{ marginTop: 16 }}>
                Browse Teas
              </Link>
            </div>
          ) : (
            state.items.map(item => (
              <div key={`${item.product.id}-${item.weight}`} className={styles.item}>
                <div className={styles.itemImage}>
                  <Image
                    src={item.product.image_url}
                    alt={item.product.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className={styles.itemContent}>
                  <div className={styles.itemHeader}>
                    <p className={styles.itemName}>{item.product.name}</p>
                    <button
                      onClick={() => removeItem(item.product.id, item.weight)}
                      className={styles.removeBtn}
                      aria-label={`Remove ${item.product.name}`}
                    >
                      ✕
                    </button>
                  </div>
                  <p className={styles.itemWeight}>{item.weight}</p>
                  <div className={styles.itemFooter}>
                    <div className={styles.qty}>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.weight, item.quantity - 1)}
                        className={styles.qtyBtn}
                        aria-label="Decrease quantity"
                      >−</button>
                      <span className={styles.qtyNum}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.weight, item.quantity + 1)}
                        className={styles.qtyBtn}
                        aria-label="Increase quantity"
                      >+</button>
                    </div>
                    <p className={styles.itemPrice}>
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        {state.items.length > 0 && (
          <div className={styles.summary}>
            {shipping === 0 && (
              <div className={styles.freeShippingBanner}>
                🎉 You've unlocked free shipping!
              </div>
            )}
            {shipping > 0 && (
              <div className={styles.shippingHint}>
                Add ₹{(999 - subtotal).toLocaleString('en-IN')} more for free shipping
              </div>
            )}
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>{shipping === 0 ? <span style={{ color: '#4ade80' }}>Free</span> : `₹${shipping}`}</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
              <span>Total</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
              id="checkout-btn"
            >
              Proceed to Checkout →
            </Link>
            <button
              onClick={closeCart}
              className="btn btn-ghost"
              style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
