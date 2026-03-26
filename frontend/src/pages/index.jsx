import React, { useState, useEffect } from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import { useApi } from '../lib/api';
import { ClockIcon } from '../components/Icons';

// --- Skeleton card -------------------------------------------

function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton skeleton-line" style={{ width: '40%', height: '0.75rem' }} />
      <div className="skeleton skeleton-line" style={{ width: '80%', height: '1.125rem' }} />
      <div className="skeleton skeleton-line" style={{ width: '100%' }} />
      <div className="skeleton skeleton-line" style={{ width: '90%' }} />
      <div className="skeleton skeleton-line" style={{ width: '40%', height: '0.75rem', marginTop: '0.5rem' }} />
    </div>
  );
}

// --- Page ----------------------------------------------------

export default function Home() {
  const api = useApi();
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .listChapters()
      .then(({ chapters: data }) => {
        setChapters(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load chapters. Make sure the backend is running.');
        setLoading(false);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Layout
      title="Chapters"
      description="Physical AI & Humanoid Robotics — an AI-native interactive textbook"
    >
      {/* Hero */}
      <header className="hero-section">
        <h1>Physical AI &amp; Humanoid Robotics</h1>
        <p>A modern, interactive textbook. Read a chapter, then ask the AI chatbot anything.</p>
      </header>

      {/* Chapter list */}
      <main className="chapters-section">
        <h2>All Chapters</h2>

        {error && (
          <div className="error-state">
            <h3>Could not load chapters</h3>
            <p>{error}</p>
          </div>
        )}

        <div className="chapter-grid" role="list">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div role="listitem" key={i}>
                  <SkeletonCard />
                </div>
              ))
            : chapters.map((chapter) => (
                <Link
                  key={chapter.id}
                  to={`/chapter/?id=${chapter.id}`}
                  className="chapter-card"
                  role="listitem"
                >
                  <div className="chapter-number">Chapter {chapter.order}</div>
                  <h3>{chapter.title}</h3>
                  <p>{chapter.description}</p>
                  <div className="chapter-meta">
                    <ClockIcon size={14} />
                    {chapter.readingTimeMinutes} min read
                  </div>
                </Link>
              ))}
        </div>
      </main>
    </Layout>
  );
}
