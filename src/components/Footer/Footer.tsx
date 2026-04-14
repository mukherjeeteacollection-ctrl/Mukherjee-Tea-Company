import Link from 'next/link';
import Logo from '../Logo/Logo';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.glow} />
      <div className="container">
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brand}>
            <div className={styles.logo}>
              <Logo height={54} />
              <div className={styles.logoText}>
                <p className={styles.logoMain}>MUKHERJEE</p>
                <p className={styles.logoSub}>Tea Company</p>
                <p className={styles.logoSub}>Since - 1971</p>
              </div>
            </div>
            <p className={styles.brandDesc}>
              Curating the finest single-estate and artisanal teas from the high-altitude gardens of India. Every cup tells a story.
            </p>
            <div className={styles.socials}>
              {['Instagram', 'Facebook', 'Twitter', 'Pinterest'].map(s => (
                <a key={s} href="#" className={styles.socialLink} aria-label={s}>
                  {s[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Shop</h4>
            {[
              { href: '/shop', label: 'All Teas' },
              { href: '/shop?category=Black+Tea', label: 'Black Tea' },
              { href: '/shop?category=Green+Tea', label: 'Green Tea' },
              { href: '/shop?category=White+Tea', label: 'White Tea' },
              { href: '/shop?category=Oolong+Tea', label: 'Oolong Tea' },
              { href: '/shop?category=Herbal+%26+Blends', label: 'Herbal & Blends' },
            ].map(l => (
              <Link key={l.href} href={l.href} className={styles.colLink}>{l.label}</Link>
            ))}
          </div>

          {/* Company */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Company</h4>
            {[
              { href: '/about', label: 'Our Story' },
              { href: '/about#process', label: 'Our Process' },
              { href: '/contact', label: 'Contact Us' },
            ].map(l => (
              <Link key={l.href} href={l.href} className={styles.colLink}>{l.label}</Link>
            ))}
          </div>

          {/* Trust */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>WHY MUKHERJEE</h4>
            <div className={styles.features}>
              {[
                { icon: '🌿', text: '100% Organic Certified' },
                { icon: '🏔️', text: 'High-Altitude Gardens' },
                { icon: '📦', text: 'Free Shipping on ₹999+' },
                { icon: '🔒', text: 'Secure Checkout' },
                { icon: '♻️', text: 'Eco Packaging' },
              ].map(f => (
                <div key={f.text} className={styles.feature}>
                  <span>{f.icon}</span>
                  <span>{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.bottom}>
          <p className={styles.copy}>
            © {currentYear} MUKHERJEE TEA COMPANY. All rights reserved.
          </p>
          <div className={styles.bottomLinks}>
            <Link href="/privacy" className={styles.bottomLink}>Privacy Policy</Link>
            <Link href="/terms" className={styles.bottomLink}>Terms of Service</Link>
            <Link href="/admin" className={styles.bottomLink} style={{ opacity: 0.4, fontSize: '0.7rem' }}>Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
