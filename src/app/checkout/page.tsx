'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import styles from './page.module.css';

type Step = 'cart' | 'shipping' | 'review' | 'success';

const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi'];

export default function CheckoutPage() {
  const { state, subtotal, shipping, total, clearCart } = useCart();
  const { showToast } = useToast();
  const [step, setStep] = useState<Step>('cart');
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    line1: '', line2: '', city: '', state: 'West Bengal', pincode: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    const id = 'MTC' + Date.now().toString().slice(-6);
    setOrderId(id);
    clearCart();
    setStep('success');
    setSubmitting(false);
  };

  const isShippingValid = form.name && form.email && form.phone && form.line1 && form.city && form.pincode;

  if (step === 'success') {
    return (
      <div className={styles.successPage}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✓</div>
          <h1 className={styles.successTitle}>Order Placed!</h1>
          <p className={styles.successSubtitle}>
            Your order <strong>{orderId}</strong> has been confirmed. We'll send you a confirmation email shortly.
          </p>
          <div className={styles.successInfo}>
            <div className={styles.successInfoItem}>
              <span>📦</span>
              <span>Estimated delivery: 5-7 business days</span>
            </div>
            <div className={styles.successInfoItem}>
              <span>📧</span>
              <span>Confirmation sent to {form.email}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 8 }}>
            <Link href="/" className="btn btn-primary">Back to Home</Link>
            <Link href="/shop" className="btn btn-secondary">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  if (state.items.length === 0 && step !== 'success') {
    return (
      <div className={styles.emptyPage}>
        <div className={styles.emptyCard}>
          <span style={{ fontSize: '4rem' }}>🛒</span>
          <h2>Your cart is empty</h2>
          <p>Add some teas to get started</p>
          <Link href="/shop" className="btn btn-primary">Browse Teas</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Checkout</h1>
          {/* Steps */}
          <div className={styles.steps}>
            {(['cart', 'shipping', 'review'] as const).map((s, i) => (
              <React.Fragment key={s}>
                <div className={`${styles.step} ${step === s ? styles.stepActive : (i < ['cart','shipping','review'].indexOf(step) ? styles.stepDone : '')}`}>
                  <div className={styles.stepNum}>{step !== 'success' && i < ['cart','shipping','review'].indexOf(step) ? '✓' : i + 1}</div>
                  <span className={styles.stepLabel}>{s === 'cart' ? 'Cart' : s === 'shipping' ? 'Shipping' : 'Review'}</span>
                </div>
                {i < 2 && <div className={styles.stepLine} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className={styles.layout}>
          {/* Main */}
          <div className={styles.main}>
            {step === 'cart' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Cart Review</h2>
                <div className={styles.cartItems}>
                  {state.items.map(item => (
                    <div key={`${item.product.id}-${item.weight}`} className={styles.cartItem}>
                      <div className={styles.cartItemImage}>
                        <Image src={item.product.image_url} alt={item.product.name} fill style={{ objectFit: 'cover' }} />
                      </div>
                      <div className={styles.cartItemInfo}>
                        <p className={styles.cartItemName}>{item.product.name}</p>
                        <p className={styles.cartItemMeta}>{item.weight} · Qty: {item.quantity}</p>
                      </div>
                      <p className={styles.cartItemPrice}>₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                </div>
                <button onClick={() => setStep('shipping')} className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: 24 }} id="checkout-next-shipping">
                  Continue to Shipping →
                </button>
              </div>
            )}

            {step === 'shipping' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Shipping Details</h2>
                <div className={styles.formGrid}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Rahul Mukherjee" className="form-input" id="checkout-name" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="rahul@example.com" className="form-input" id="checkout-email" />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Phone *</label>
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" className="form-input" id="checkout-phone" />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Address Line 1 *</label>
                    <input name="line1" value={form.line1} onChange={handleChange} placeholder="House/Flat No., Street Name" className="form-input" id="checkout-line1" />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Address Line 2</label>
                    <input name="line2" value={form.line2} onChange={handleChange} placeholder="Landmark, Area (optional)" className="form-input" id="checkout-line2" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input name="city" value={form.city} onChange={handleChange} placeholder="Kolkata" className="form-input" id="checkout-city" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pincode *</label>
                    <input name="pincode" value={form.pincode} onChange={handleChange} placeholder="700001" className="form-input" id="checkout-pincode" maxLength={6} />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">State *</label>
                    <select name="state" value={form.state} onChange={handleChange} className="form-select" id="checkout-state">
                      {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Order Notes (optional)</label>
                    <textarea name="notes" value={form.notes} onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))} placeholder="Any special instructions..." className="form-input" rows={3} style={{ resize: 'vertical' }} id="checkout-notes" />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                  <button onClick={() => setStep('cart')} className="btn btn-secondary btn-lg" id="checkout-back-cart">← Back</button>
                  <button
                    onClick={() => isShippingValid && setStep('review')}
                    disabled={!isShippingValid}
                    className="btn btn-primary btn-lg"
                    style={{ flex: 1, justifyContent: 'center', opacity: isShippingValid ? 1 : 0.5 }}
                    id="checkout-next-review"
                  >
                    Review Order →
                  </button>
                </div>
              </div>
            )}

            {step === 'review' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Review & Confirm</h2>
                <div className={styles.reviewBlock}>
                  <h3 className={styles.reviewBlockTitle}>📍 Shipping To</h3>
                  <p className={styles.reviewText}><strong>{form.name}</strong></p>
                  <p className={styles.reviewText}>{form.line1}{form.line2 ? `, ${form.line2}` : ''}</p>
                  <p className={styles.reviewText}>{form.city}, {form.state} – {form.pincode}</p>
                  <p className={styles.reviewText}>{form.email} · {form.phone}</p>
                </div>
                <div className={styles.reviewBlock}>
                  <h3 className={styles.reviewBlockTitle}>📦 Items</h3>
                  {state.items.map(item => (
                    <div key={`${item.product.id}-${item.weight}`} className={styles.reviewRow}>
                      <span>{item.product.name} ({item.weight}) × {item.quantity}</span>
                      <span>₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
                <div className={styles.reviewBlock}>
                  <h3 className={styles.reviewBlockTitle}>💳 Payment</h3>
                  <p className={styles.reviewText} style={{ color: 'var(--gold-light)' }}>Cash on Delivery — No payment required now</p>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                  <button onClick={() => setStep('shipping')} className="btn btn-secondary btn-lg">← Edit</button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={submitting}
                    className="btn btn-primary btn-lg"
                    style={{ flex: 1, justifyContent: 'center' }}
                    id="checkout-place-order"
                  >
                    {submitting ? <><div className={styles.spinner} /> Placing Order...</> : '🛒 Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <aside className={styles.sidebar}>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>Order Summary</h3>
              {state.items.map(item => (
                <div key={`${item.product.id}-${item.weight}`} className={styles.summaryItem}>
                  <span className={styles.summaryItemName}>{item.product.name} <span className={styles.summaryItemMeta}>×{item.quantity}</span></span>
                  <span className={styles.summaryItemPrice}>₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
              <div className={styles.summaryDivider} />
              <div className={styles.summaryRow}><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span style={{ color: shipping === 0 ? '#4ade80' : undefined }}>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
              {shipping === 0 && (
                <div className={styles.freeShipping}>🎉 Free shipping applied!</div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
