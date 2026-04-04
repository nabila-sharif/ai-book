import React from 'react';
import { useAuth } from '../../context/AuthContext';

const LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export default function LevelSelector() {
  const { user, updateLevel } = useAuth();
  if (!user) return null;

  return (
    <div style={styles.wrapper}>
      <select
        style={styles.select}
        value={user.level || 'intermediate'}
        onChange={e => updateLevel(e.target.value)}
        title="Reading level"
      >
        {LEVELS.map(l => (
          <option key={l.value} value={l.value}>{l.label}</option>
        ))}
      </select>
    </div>
  );
}

const styles = {
  wrapper: { display: 'inline-flex', alignItems: 'center' },
  select: {
    padding: '0.3rem 0.6rem',
    borderRadius: 6,
    border: '1px solid var(--ifm-color-emphasis-300)',
    background: 'var(--ifm-background-color)',
    color: 'var(--ifm-font-color-base)',
    fontSize: '0.85rem',
    cursor: 'pointer',
  },
};
