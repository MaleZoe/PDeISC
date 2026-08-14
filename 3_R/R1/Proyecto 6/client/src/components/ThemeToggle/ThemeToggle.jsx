import React, { useEffect, useState } from 'react';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      setIsDark(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <>
      <style>{`
        .theme-toggle-btn {
          position: fixed;
          top: 2rem;
          right: 2rem;
          width: 55px;
          height: 55px;
          background-color: var(--card-bg);
          color: var(--text-color);
          z-index: 1050;
          border: 2px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.6rem;
          transition: all 0.3s ease;
          line-height: 1;
          padding: 0;
        }
        @media (max-width: 768px) {
          .theme-toggle-btn {
            top: 1rem;
            right: 1rem;
            width: 42px;
            height: 42px;
            font-size: 1.2rem;
          }
        }
      `}</style>
      <button 
        onClick={toggleTheme}
        className="btn rounded-circle shadow-sm theme-toggle-btn"
        aria-label="Alternar tema"
      >
        {isDark ? '☀️' : '🌙'}
      </button>
    </>
  );
};

export default ThemeToggle;
