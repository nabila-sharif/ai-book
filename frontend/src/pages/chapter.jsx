/**
 * Redirect shim — keeps `/chapter?id=...` links working by forwarding
 * to the canonical route `/chapter/?id=...`.
 *
 * Docusaurus serves chapter/index.jsx at `/chapter/`.
 * This file lives at `/chapter` (no trailing slash).
 */
import { useEffect } from 'react';
import { useLocation } from '@docusaurus/router';
import BrowserOnly from '@docusaurus/BrowserOnly';

function Redirect() {
  const location = useLocation();
  useEffect(() => {
    // Preserve query string, e.g. ?id=01-intro-to-physical-ai
    window.location.replace(`/chapter/${location.search}`);
  }, [location.search]);
  return null;
}

export default function ChapterRedirect() {
  return <BrowserOnly>{() => <Redirect />}</BrowserOnly>;
}
