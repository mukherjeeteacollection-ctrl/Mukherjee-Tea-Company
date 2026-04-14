'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo/Logo';
import { createClient } from '@/utils/supabase/client';
import styles from './page.module.css';

type Mode = 'login' | 'signup';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // If user is already signed in, redirect away
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      const profile = data as { role: 'admin' | 'customer' } | null;
      router.replace(profile?.role === 'admin' ? '/admin' : '/');
    });
  }, [supabase, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    // Fetch role to redirect correctly
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      const profile = data as { role: 'admin' | 'customer' } | null;
      router.push(profile?.role === 'admin' ? '/admin' : '/');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setMessage(
      "✅ Account created! Check your email to confirm your account, then log in.",
    );
    setMode('login');
    setLoading(false);
  };

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setError('');
    setMessage('');
  };

  return (
    <div className={styles.page}>
      {/* Decorative background orbs */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <div className={styles.orb3} />

      <div className={styles.card}>
        {/* Header */}
        <Link href="/" className={styles.logoLink}>
          <Logo height={56} />
          <div className={styles.logoText}>
            <span className={styles.logoMain}>MUKHERJEE</span>
            <span className={styles.logoSub}>Tea Company · Since 1971</span>
          </div>
        </Link>

        <div className={styles.divider} />

        {/* Tab Switcher */}
        <div className={styles.tabs}>
          <button
            id="auth-tab-login"
            className={`${styles.tab} ${mode === 'login' ? styles.tabActive : ''}`}
            onClick={() => switchMode('login')}
          >
            Log In
          </button>
          <button
            id="auth-tab-signup"
            className={`${styles.tab} ${mode === 'signup' ? styles.tabActive : ''}`}
            onClick={() => switchMode('signup')}
          >
            Sign Up
          </button>
        </div>

        {/* Success / Error messages */}
        {message && <p className={styles.successMsg}>{message}</p>}
        {error && <p className={styles.errorMsg}>{error}</p>}

        {/* Login Form */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className={styles.form}>
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="form-input"
                required
                autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••"
                className="form-input"
                required
                autoComplete="current-password"
              />
            </div>
            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className={`btn btn-primary btn-lg ${styles.submitBtn}`}
            >
              {loading ? (
                <span className={styles.spinner} />
              ) : (
                '→ Log In'
              )}
            </button>
            <p className={styles.switchHint}>
              Don&apos;t have an account?{' '}
              <button type="button" onClick={() => switchMode('signup')} className={styles.switchLink}>
                Sign up free
              </button>
            </p>
          </form>
        )}

        {/* Sign Up Form */}
        {mode === 'signup' && (
          <form onSubmit={handleSignup} className={styles.form}>
            <div className="form-group">
              <label className="form-label" htmlFor="signup-name">Full Name</label>
              <input
                id="signup-name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your full name"
                className="form-input"
                required
                autoComplete="name"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="signup-email">Email Address</label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="form-input"
                required
                autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="form-input"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
            <p className={styles.roleHint}>
              🎋 Your account will be registered as a <strong>Customer</strong> by default.
            </p>
            <button
              id="signup-submit-btn"
              type="submit"
              disabled={loading}
              className={`btn btn-primary btn-lg ${styles.submitBtn}`}
            >
              {loading ? (
                <span className={styles.spinner} />
              ) : (
                '✦ Create Account'
              )}
            </button>
            <p className={styles.switchHint}>
              Already have an account?{' '}
              <button type="button" onClick={() => switchMode('login')} className={styles.switchLink}>
                Log in
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
