import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '@theme/Layout';

export default function Login() {
  const { setUser } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/sign-in/email', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(res.status === 401 ? 'Incorrect email or password' : (data.message || 'Login failed'));
        return;
      }
      setUser(data.user);
      const prev = new URLSearchParams(window.location.search).get('from');
      window.location.href = prev || '/';
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="Log In">
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Log In</h1>
          <form onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input
                style={styles.input}
                type="email"
                required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input
                style={styles.input}
                type="password"
                required
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              />
            </div>
            {error && <p style={styles.error}>{error}</p>}
            <button style={styles.button} type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
          <p style={styles.link}>
            Don't have an account? <a href="/signup">Create one</a>
          </p>
        </div>
      </div>
    </Layout>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', padding: '3rem 1rem' },
  card: { width: '100%', maxWidth: 400, background: 'var(--ifm-card-background-color)', border: '1px solid var(--ifm-color-emphasis-200)', borderRadius: 8, padding: '2rem' },
  title: { marginBottom: '1.5rem', fontSize: '1.5rem' },
  field: { marginBottom: '1rem' },
  label: { display: 'block', marginBottom: 4, fontWeight: 600, fontSize: '0.9rem' },
  input: { width: '100%', padding: '0.6rem 0.75rem', fontSize: '1rem', border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: 6, boxSizing: 'border-box', background: 'var(--ifm-background-color)', color: 'var(--ifm-font-color-base)' },
  error: { color: 'var(--ifm-color-danger)', marginBottom: '1rem', fontSize: '0.9rem' },
  button: { width: '100%', padding: '0.75rem', background: 'var(--ifm-color-primary)', color: '#fff', border: 'none', borderRadius: 6, fontSize: '1rem', fontWeight: 600, cursor: 'pointer' },
  link: { textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' },
};
