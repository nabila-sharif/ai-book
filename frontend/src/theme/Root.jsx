import React from 'react';
import ChatWidget from '../components/ChatWidget';

// Docusaurus Root wrapper — wraps every page.
// Mounts the ChatWidget so it appears site-wide.
export default function Root({ children }) {
  return (
    <>
      {children}
      <ChatWidget />
    </>
  );
}
