import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHome, FiCompass, FiSearch, FiTerminal } from 'react-icons/fi';
import MetaTags from '../components/MetaTags.jsx';

const NotFound = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--spacing-xl)',
      }}
    >
      <MetaTags
        title="404 — Page Not Found | DevHunt SRM"
        description="The page you are looking for does not exist or has been moved."
      />
      <div
        className="animate-slide-up"
        style={{
          maxWidth: '650px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        {/* Terminal Header graphic */}
        <div
          style={{
            backgroundColor: '#0d1117',
            border: '2px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.6)',
            marginBottom: 'var(--spacing-xl)',
          }}
        >
          <div
            style={{
              backgroundColor: '#161b22',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--color-border)',
            }}
          >
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff5f56' }} />
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#27c93f' }} />
            </div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiTerminal /> bash — 404_error.sh
            </div>
            <div style={{ width: '36px' }} />
          </div>

          <div style={{ padding: 'var(--spacing-xl)', fontFamily: 'monospace', textAlign: 'left' }}>
            <p style={{ color: '#ef4444', marginBottom: '8px' }}>
              ERR_404_PAGE_NOT_FOUND: The requested route could not be resolved.
            </p>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
              &gt; Status: 404 Not Found<br />
              &gt; Diagnostics: Route missing or deleted by author.<br />
              &gt; Suggestion: Search for projects or return to safety.
            </p>

            <h1
              style={{
                fontSize: '4rem',
                fontWeight: '900',
                color: 'var(--color-accent, #dfe104)',
                textAlign: 'center',
                margin: 'var(--spacing-md) 0',
                letterSpacing: '0.1em',
              }}
            >
              404
            </h1>
          </div>
        </div>

        {/* Search input to redirect to explore */}
        <form onSubmit={handleSearch} style={{ marginBottom: 'var(--spacing-xl)', display: 'flex', gap: '8px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <FiSearch
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-tertiary)',
              }}
            />
            <input
              type="text"
              placeholder="Search projects on DevHunt SRM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 48px',
                backgroundColor: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-primary)',
                outline: 'none',
              }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '0 20px', borderRadius: 'var(--radius-md)' }}>
            Search
          </button>
        </form>

        {/* Quick action buttons */}
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', borderRadius: 'var(--radius-md)' }}>
            <FiHome /> Back to Home
          </Link>
          <Link to="/explore" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', borderRadius: 'var(--radius-md)' }}>
            <FiCompass /> Explore Projects
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
