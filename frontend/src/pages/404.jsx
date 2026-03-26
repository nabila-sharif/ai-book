import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

export default function NotFound() {
  return (
    <Layout title="Page not found">
      <div className="error-state" style={{ padding: '6rem 1.5rem' }}>
        <p style={{ fontSize: '3rem', margin: '0 0 0.5rem' }}>404</p>
        <h3>Page not found</h3>
        <p>The page you are looking for does not exist.</p>
        <Link
          to="/"
          style={{
            display: 'inline-block',
            marginTop: '1.5rem',
            padding: '0.625rem 1.25rem',
            background: 'var(--color-accent)',
            color: '#fff',
            borderRadius: 'var(--radius)',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          Back to chapters
        </Link>
      </div>
    </Layout>
  );
}
