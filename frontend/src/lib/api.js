/**
 * Centralised API client.
 * All fetch calls go through here so the base URL is configured once.
 *
 * Usage (inside a React component or hook):
 *   import { useApi } from '../lib/api';
 *   const api = useApi();
 *   const chapters = await api.listChapters();
 */

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

// --- Plain fetch helpers (usable outside React) ----------------

export function createApi(baseUrl) {
  async function request(path, options = {}) {
    const res = await fetch(`${baseUrl}${path}`, options);
    if (!res.ok) {
      const err = new Error(`API ${res.status}: ${path}`);
      err.status = res.status;
      throw err;
    }
    return res.json();
  }

  return {
    /** GET /api/chapters → { chapters: ChapterMeta[] } */
    listChapters() {
      return request('/api/chapters');
    },

    /** GET /api/chapters/:id?level=... → Chapter */
    getChapter(id, level = 'intermediate') {
      return request(`/api/chapters/${encodeURIComponent(id)}?level=${level}`);
    },

    /** POST /api/chat — returns raw Response for SSE streaming */
    chatStream(question) {
      return fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
    },

    /** POST /api/translate — returns raw Response for SSE streaming */
    translateStream(chapterId, level = 'intermediate') {
      return fetch(`${baseUrl}/api/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapter_id: chapterId, level }),
      });
    },
  };
}

// --- React hook ------------------------------------------------

/** Returns an api client pre-configured with the site's apiUrl. */
export function useApi() {
  const { siteConfig } = useDocusaurusContext();
  return createApi(siteConfig.customFields.apiUrl);
}
