import React, { useState, useRef, useEffect } from 'react';
import { useApi } from '../../lib/api';
import { SendIcon, CloseIcon, ChatIcon } from '../Icons';
import styles from './ChatWidget.module.css';

export default function ChatWidget() {
  const api = useApi();
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && open) setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  async function handleSubmit(e) {
    e.preventDefault();
    const q = question.trim();
    if (!q || loading) return;

    setQuestion('');
    setMessages((prev) => [...prev, { role: 'user', text: q }]);
    setLoading(true);

    try {
      const res = await api.chatStream(q);
      if (!res.ok) throw new Error('Chat unavailable');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let botText = '';

      setMessages((prev) => [...prev, { role: 'bot', text: '', streaming: true }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        for (const line of decoder.decode(value, { stream: true }).split('\n')) {
          if (!line.startsWith('data: ')) continue;
          try {
            const event = JSON.parse(line.slice(6));
            if (event.type === 'delta') {
              botText += event.text;
              setMessages((prev) => {
                const copy = [...prev];
                copy[copy.length - 1] = { role: 'bot', text: botText, streaming: true };
                return copy;
              });
            } else if (event.type === 'not_found') {
              setMessages((prev) => {
                const copy = [...prev];
                copy[copy.length - 1] = { role: 'bot', text: event.text, notFound: true };
                return copy;
              });
            } else if (event.type === 'done') {
              setMessages((prev) => {
                const copy = [...prev];
                copy[copy.length - 1] = { ...copy[copy.length - 1], streaming: false };
                return copy;
              });
            }
          } catch { /* skip malformed event */ }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: 'Chat is temporarily unavailable. Please try again.', error: true },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        className={styles.trigger}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close chat' : 'Ask the textbook AI'}
        aria-expanded={open}
      >
        {open ? <CloseIcon /> : <ChatIcon />}
      </button>

      {open && (
        <div className={styles.panel} role="dialog" aria-label="Textbook AI Chat" aria-modal="true">
          <div className={styles.panelHeader}>
            <div>
              <div className={styles.panelTitle}>Ask the Textbook</div>
              <div className={styles.panelSubtitle}>Answers from chapter content only</div>
            </div>
            <button className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Close chat">
              <CloseIcon />
            </button>
          </div>

          <div className={styles.messages} aria-live="polite">
            {messages.length === 0 && (
              <div className={styles.emptyState}>
                <p>Ask any question about Physical AI or Humanoid Robotics.</p>
                <p className={styles.emptyHint}>Answers are grounded in the textbook with citations.</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={[
                  styles.message,
                  styles[msg.role],
                  msg.notFound ? styles.notFound : '',
                  msg.error ? styles.errorMsg : '',
                ].join(' ')}
              >
                {msg.text || (msg.streaming ? <span className={styles.cursor} aria-label="Typing" /> : null)}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form className={styles.inputRow} onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              className={styles.input}
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question…"
              disabled={loading}
              aria-label="Your question"
              maxLength={500}
            />
            <button
              className={styles.sendBtn}
              type="submit"
              disabled={!question.trim() || loading}
              aria-label="Send"
            >
              <SendIcon />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
