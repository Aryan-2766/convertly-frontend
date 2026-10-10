import React from 'react';

export default function Header({ health, loading, onRefresh, onOpenHistory, onOpenAdvisor }) {
  const getBadge = () => {
    if (loading) {
      return {
        label: 'Checking status...',
        className: 'badge-warning',
        dot: 'status-dot dot-yellow'
      };
    }
    if (!health) {
      return {
        label: 'Backend Offline',
        className: 'badge-error',
        dot: 'status-dot dot-red'
      };
    }
    if (health.databaseStatus === 'CONNECTED') {
      return {
        label: 'Cloud MySQL Connected',
        className: 'badge-success',
        dot: 'status-dot dot-green'
      };
    }
    return {
      label: 'DB Pending (Aiven)',
      className: 'badge-warning',
      dot: 'status-dot dot-yellow'
    };
  };

  const badge = getBadge();

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="brand-group">
          <div className="brand-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
          </div>
          <div>
            <h1 className="brand-title">Convertly</h1>
            <p className="brand-subtitle">AI-Assisted File Utility & Conversion Platform</p>
          </div>
        </div>

        <div className="header-status-area">
          <div className={`status-pill ${badge.className}`} title={health ? health.databaseDetails : 'Spring Boot not reached'}>
            <span className={badge.dot}></span>
            <span>{badge.label}</span>
          </div>

          <button
            type="button"
            className="header-action-btn"
            onClick={onOpenAdvisor}
            title="Ask format recommendations"
          >
            ✨ Ask Advisor
          </button>

          <button
            type="button"
            className="header-action-btn"
            onClick={onOpenHistory}
            title="View Aiven MySQL conversion history"
          >
            📋 History
          </button>

          <button
            className="refresh-btn"
            onClick={onRefresh}
            disabled={loading}
            title="Check backend & database connection"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={loading ? 'spin' : ''}>
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
            </svg>
            <span>{loading ? 'Testing...' : 'Test Connection'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

