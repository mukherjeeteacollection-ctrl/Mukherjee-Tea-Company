import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Story',
  description: 'Learn about the passion, heritage, and dedication behind Mukherjee Tea Company — a journey from the gardens of India to your cup.',
};

export default function AboutPage() {
  const values = [
    { icon: '🌿', title: 'Purity First', desc: 'Every tea we sell is 100% natural, organic-certified, with no artificial flavors, no additives, and no compromises. We believe the leaf should speak for itself.' },
    { icon: '🤝', title: 'Fair Trade', desc: 'We pay farmers above fair-trade rates, invest in their communities, and build long-term relationships — because the best tea comes from people who are treated with dignity.' },
    { icon: '♻️', title: 'Sustainability', desc: 'Our packaging is 100% eco-friendly and recyclable. We are committed to reducing our carbon footprint at every step of the supply chain.' },
    { icon: '🎓', title: 'Education', desc: "We believe that understanding a tea makes you appreciate it more. That's why every product comes with brewing guides, tasting notes, and origin stories." },
    { icon: '🔬', title: 'Quality Control', desc: 'Every batch goes through a multi-stage quality check — from visual inspection to laboratory testing — before it earns the Mukherjee Tea seal.' },
    { icon: '💚', title: 'Community', desc: 'We support the local communities around each tea estate we source from — from education funds to health initiatives.' },
  ];

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Hero */}
      <section style={{ padding: '80px 0 70px', textAlign: 'center', borderBottom: '1px solid var(--glass-border)' }}>
        <div className="container">
          <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 3, color: 'var(--gold-primary)', marginBottom: 12 }}>Our Heritage</p>
          <h1 style={{ fontFamily: 'Outfit', fontSize: 'clamp(2.4rem, 5vw, 4rem)', fontWeight: 900, color: 'var(--text-primary)', margin: '0 auto 20px', maxWidth: '700px', lineHeight: 1.1 }}>
            A Story Steeped in{' '}
            <span className="text-gradient">Passion &amp; Tradition</span>
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.8 }}>
            Three generations of devotion to the art of fine tea. From the misty highlands of Darjeeling to your cup — this is our story.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="section" id="story">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
            <div style={{ position: 'relative', height: '420px', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
              <Image src="/hero-tea-estate.png" alt="Mukherjee Tea Estate" fill style={{ objectFit: 'cover' }} sizes="(max-width:768px) 100vw, 50vw" />
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 3, color: 'var(--gold-primary)', marginBottom: 12 }}>The Beginning</p>
              <h2 style={{ fontFamily: 'Outfit', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 20, lineHeight: 1.2 }}>
                Born from a Love of the Leaf
              </h2>
              <div style={{ width: 60, height: 3, background: 'linear-gradient(90deg, var(--gold-primary), var(--gold-dark))', borderRadius: 2, marginBottom: 24 }} />
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, fontSize: '0.95rem', marginBottom: 16 }}>
                The MUKHERJEE TEA COMPANY was founded in 1971 by my grandfather, who spent his early years working in the tea gardens of Darjeeling. He was captivated by the complexity, the ritual, and the sheer joy of a perfectly brewed cup.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, fontSize: '0.95rem' }}>
                That passion was passed down through generations — from father to son, from kitchen wisdom to careful curation. Today, we continue that legacy with the same devotion: sourcing only the finest teas, working directly with estates, and ensuring that every bag we sell is worthy of your trust.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: '80px 0', background: 'rgba(10, 26, 18, 0.4)', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 3, color: 'var(--gold-primary)', marginBottom: 10 }}>What We Stand For</p>
            <h2 style={{ fontFamily: 'Outfit', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Our Values</h2>
          </div>
          <div className="grid-3">
            {values.map(v => (
              <div key={v.title} className="glass-card" style={{ padding: 32 }}>
                <div style={{ fontSize: '2.2rem', marginBottom: 16 }}>{v.icon}</div>
                <h3 style={{ fontFamily: 'Outfit', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>{v.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section" id="process">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 3, color: 'var(--gold-primary)', marginBottom: 12 }}>The Promise</p>
              <h2 style={{ fontFamily: 'Outfit', fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 20, lineHeight: 1.2 }}>
                From Garden to Your Cup — With Integrity
              </h2>
              <div style={{ width: 60, height: 3, background: 'linear-gradient(90deg, var(--gold-primary), var(--gold-dark))', borderRadius: 2, marginBottom: 24 }} />
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, fontSize: '0.95rem', marginBottom: 16 }}>
                We travel to the source. We do not buy through intermediaries — we visit the estates, meet the farmers, and taste the teas in the gardens they were grown in. This gives us absolute control over quality and ensures that our relationships are genuine.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, fontSize: '0.95rem', marginBottom: 28 }}>
                When a batch arrives at our facility, it undergoes our proprietary quality framework — a 15-point inspection covering appearance, aroma, liquor color, taste, and laboratory analysis — before it ever reaches your home.
              </p>
              <Link href="/shop" className="btn btn-primary">
                Experience the Difference →
              </Link>
            </div>
            <div style={{ position: 'relative', height: '420px', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
              <Image src="/darjeeling-gold.png" alt="Quality tea testing" fill style={{ objectFit: 'cover' }} sizes="(max-width:768px) 100vw, 50vw" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 0', textAlign: 'center', background: 'rgba(10, 26, 18, 0.3)', borderTop: '1px solid var(--glass-border)' }}>
        <div className="container">
          <div style={{ maxWidth: '560px', margin: '0 auto' }}>
            <span style={{ fontSize: '3rem' }}>🍵</span>
            <h2 style={{ fontFamily: 'Outfit', fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', margin: '16px 0' }}>
              Taste the Difference
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 28 }}>
              Join thousands of tea lovers who have made MUKHERJEE TEA COMPANY their trusted source for exceptional, artisanal teas.
            </p>
            <Link href="/shop" className="btn btn-primary btn-xl">
              Explore Our Collection
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
