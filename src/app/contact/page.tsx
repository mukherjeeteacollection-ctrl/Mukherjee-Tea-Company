'use client';

import React, { useState } from 'react';
import type { Metadata } from 'next';
import { useToast } from '@/context/ToastContext';

export default function ContactPage() {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 1200));
    showToast("Message sent! We'll get back to you within 24 hours. 🍵", 'success');
    setForm({ name: '', email: '', subject: '', message: '' });
    setSending(false);
  };

  const infoItems = [
    { icon: '📧', title: 'Email Us', value: 'hello@mukherjeetea.com', sub: 'We reply within 24 hours' },
    { icon: '📞', title: 'Call Us', value: '+91 98765 43210', sub: 'Mon–Sat, 9AM–6PM IST' },
    { icon: '📍', title: 'Our Location', value: 'Kolkata, West Bengal', sub: 'India 700001' },
  ];

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Header */}
      <section style={{ padding: '80px 0 70px', textAlign: 'center', borderBottom: '1px solid var(--glass-border)' }}>
        <div className="container">
          <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 3, color: 'var(--gold-primary)', marginBottom: 12 }}>Get In Touch</p>
          <h1 style={{ fontFamily: 'Outfit', fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 16px', lineHeight: 1.1 }}>
            We'd Love to Hear From You
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto', lineHeight: 1.8 }}>
            Questions about our teas, wholesale inquiries, or just want to share your favourite brew? Drop us a message!
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 64, alignItems: 'start' }}>
            {/* Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <h2 style={{ fontFamily: 'Outfit', fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Contact Information</h2>
              {infoItems.map(item => (
                <div key={item.title} style={{
                  padding: '24px',
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  gap: 18,
                  alignItems: 'center',
                  backdropFilter: 'var(--glass-blur)',
                }}>
                  <div style={{ fontSize: '1.8rem', flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--gold-primary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{item.title}</p>
                    <p style={{ fontFamily: 'Outfit', fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: 2 }}>{item.value}</p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.sub}</p>
                  </div>
                </div>
              ))}

              <div style={{
                padding: 24,
                background: 'rgba(201, 168, 76, 0.07)',
                border: '1px solid rgba(201,168,76,0.2)',
                borderRadius: 'var(--radius-lg)',
              }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--gold-primary)', marginBottom: 8 }}>🎁 Wholesale & Corporate Orders</p>
                <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  Interested in stocking Mukherjee Teas or ordering in bulk for your office, restaurant, or hotel? We offer special wholesale pricing. Reach out and we'll craft a bespoke proposal.
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-xl)',
              padding: '40px',
              backdropFilter: 'var(--glass-blur)',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}>
              <h2 style={{ fontFamily: 'Outfit', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Send a Message</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Your Name *</label>
                  <input value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} placeholder="Jane Doe" className="form-input" required id="contact-name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input type="email" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} placeholder="jane@example.com" className="form-input" required id="contact-email" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <select value={form.subject} onChange={e => setForm(p => ({...p, subject: e.target.value}))} className="form-select" id="contact-subject">
                  <option value="">Select a topic...</option>
                  <option value="product">Product Inquiry</option>
                  <option value="order">Order Support</option>
                  <option value="wholesale">Wholesale / Bulk Orders</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea
                  value={form.message}
                  onChange={e => setForm(p => ({...p, message: e.target.value}))}
                  placeholder="Tell us what's on your mind..."
                  className="form-input"
                  rows={6}
                  required
                  style={{ resize: 'vertical' }}
                  id="contact-message"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', justifyContent: 'center' }}
                id="contact-submit-btn"
              >
                {sending ? '⏳ Sending...' : '✉️ Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
