import React, { useState, useEffect, useCallback } from 'react';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';
import Layout from '@theme/Layout';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useApi } from '../../lib/api';
import { ArrowLeftIcon, ArrowRightIcon, ClockIcon } from '../../components/Icons';
import ReadingProgressBar from '../../components/ReadingProgressBar';
import { useAuth } from '../../context/AuthContext';

// --- Skeleton -------------------------------------------------

function ChapterSkeleton() {
  return (
    <div className="chapter-page" aria-busy="true" aria-label="Loading chapter">
      <div style={{ marginBottom: '2rem' }}>
        <div className="skeleton skeleton-line" style={{ width: 100, height: '0.875rem' }} />
      </div>
      <div
        style={{
          marginBottom: '2.5rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="skeleton skeleton-line" style={{ width: 120, height: '0.75rem', marginBottom: '0.75rem' }} />
        <div className="skeleton skeleton-line" style={{ width: '65%', height: '2rem', marginBottom: '1rem' }} />
        <div className="skeleton skeleton-line" style={{ width: 100, height: '1.25rem' }} />
      </div>
      {[90, 100, 85, 100, 75, 100, 60, 80].map((w, i) => (
        <div
          key={i}
          className="skeleton skeleton-line"
          style={{ width: `${w}%`, marginBottom: '0.875rem' }}
        />
      ))}
    </div>
  );
}

// --- Main component -------------------------------------------

export default function ChapterPage() {
  const location = useLocation();
  const api = useApi();
  const { user } = useAuth();
  const level = user?.level || 'intermediate';

  const params = new URLSearchParams(location.search);
  const chapterId = params.get('id');

  const [chapter, setChapter] = useState(null);
  const [allChapters, setAllChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchChapter = useCallback(async () => {
    if (!chapterId) {
      setError('No chapter specified. Please choose a chapter from the list.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [chapterData, { chapters }] = await Promise.all([
        api.getChapter(chapterId, level),
        api.listChapters(),
      ]);
      setChapter(chapterData);
      setAllChapters(chapters);
    } catch (err) {
      setError(
        err.status === 404
          ? 'Chapter not found.'
          : 'Could not load this chapter. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [chapterId, level]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchChapter();
  }, [fetchChapter]);

  // Scroll to top on chapter change
  useEffect(() => {
    if (chapter) window.scrollTo({ top: 0, behavior: 'instant' });
  }, [chapter?.id]);

  // Prev / next
  const sorted = [...allChapters].sort((a, b) => a.order - b.order);
  const idx = sorted.findIndex((c) => c.id === chapterId);
  const prev = idx > 0 ? sorted[idx - 1] : null;
  const next = idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1] : null;

  const pageTitle = chapter ? `${chapter.title} — Physical AI` : 'Loading…';

  return (
    <Layout title={pageTitle} description={chapter?.description ?? ''}>
      {!loading && chapter && <ReadingProgressBar />}

      {loading && <ChapterSkeleton />}

      {!loading && error && (
        <div className="chapter-page">
          <Link to="/" className="chapter-back">
            <ArrowLeftIcon /> All Chapters
          </Link>
          <div className="error-state">
            <h3>{error}</h3>
            <p>
              <Link to="/">Return to chapter list</Link>
            </p>
          </div>
        </div>
      )}

      {!loading && chapter && (
        <article className="chapter-page">
          {/* Breadcrumb / back */}
          <Link to="/" className="chapter-back">
            <ArrowLeftIcon /> All Chapters
          </Link>

          {/* Header */}
          <header className="chapter-header">
            <div className="chapter-number">Chapter {chapter.order}</div>
            <h1>{chapter.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="chapter-reading-time">
                <ClockIcon size={13} />
                {chapter.readingTimeMinutes} min read
              </span>
              <span style={{ fontSize: '0.8rem', padding: '2px 8px', borderRadius: 4, background: 'var(--ifm-color-primary-lightest)', color: 'var(--ifm-color-primary-darkest)', textTransform: 'capitalize' }}>
                {level}
              </span>
            </div>
          </header>

          {/* Body */}
          <div className="chapter-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {chapter.content}
            </ReactMarkdown>
          </div>

          {/* Chapter navigation */}
          <nav className="chapter-nav" aria-label="Chapter navigation">
            {prev ? (
              <Link to={`/chapter/?id=${prev.id}`} className="chapter-nav-link prev">
                <ArrowLeftIcon />
                {prev.title}
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link to={`/chapter/?id=${next.id}`} className="chapter-nav-link next">
                {next.title}
                <ArrowRightIcon />
              </Link>
            )}
          </nav>
        </article>
      )}
    </Layout>
  );
}
