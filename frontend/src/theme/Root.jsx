import React from 'react';
import ChatWidget from '../components/ChatWidget';
import { AuthProvider, useAuth } from '../context/AuthContext';
import LevelSelector from '../components/LevelSelector';

function NavbarExtras() {
  const { user, loading, logout } = useAuth();
  if (loading) return null;
  return (
    <div style={styles.navExtras}>
      <LevelSelector />
      {user ? (
        <>
          <span style={styles.email}>{user.name || user.email}</span>
          <button style={styles.navBtn} onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <a style={styles.navBtn} href="/login">Login</a>
          <a style={{ ...styles.navBtn, ...styles.navBtnPrimary }} href="/signup">Sign Up</a>
        </>
      )}
    </div>
  );
}

export default function Root({ children }) {
  return (
    <AuthProvider>
      {children}
      <ChatWidget />
      <NavbarExtras />
    </AuthProvider>
  );
}

const styles = {
  navExtras: {
    position: 'fixed',
    top: 10,
    right: 16,
    zIndex: 999,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  email: { fontSize: '0.85rem', opacity: 0.8 },
  navBtn: {
    padding: '0.3rem 0.75rem',
    borderRadius: 6,
    border: '1px solid var(--ifm-color-emphasis-300)',
    background: 'var(--ifm-background-color)',
    color: 'var(--ifm-font-color-base)',
    fontSize: '0.85rem',
    cursor: 'pointer',
    textDecoration: 'none',
  },
  navBtnPrimary: {
    background: 'var(--ifm-color-primary)',
    color: '#fff',
    border: 'none',
  },
};
