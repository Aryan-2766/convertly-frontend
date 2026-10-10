import React, { useState } from 'react';
import { askAdvisorApi } from '../api/client';

export default function AdvisorModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState(null);

  const samplePrompts = [
    'What is the best photo size for desktop wallpaper?',
    'Which document format is best for legal contracts?',
    'What resolution is required for 300 DPI poster printing?',
    'When should I convert PNG to WebP?'
  ];


  const handleAsk = async (textToAsk) => {
    const q = textToAsk || query;
    if (!q.trim()) return;

    setLoading(true);
    setAdvice(null);
    try {
      const data = await askAdvisorApi(q);
      setAdvice(data);
    } catch (e) {
      setAdvice({
        recommendedFormat: 'WEBP',
        title: 'Local Engine Advisory',
        explanation: 'For web images, WebP offers the smallest file size. For documents, use PDF.',
        tips: ['Check your file size in the dashboard.', 'Try 85% quality.'],
        source: 'FALLBACK'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container advisor-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <h3 className="modal-title">Smart Format Advisor</h3>
            <span className="ephemeral-tag">AI &amp; Expert Knowledge Engine</span>
          </div>

          <button type="button" className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Ask questions about optimal file formats, compression ratios, and conversion best practices.
          </p>

          <div className="sample-prompts-bar">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                className="sample-prompt-pill"
                onClick={() => {
                  setQuery(p);
                  handleAsk(p);
                }}
                disabled={loading}
              >
                {p}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk();
            }}
            className="advisor-input-form"
          >
            <input
              type="text"
              className="dimension-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Which format should I choose for an email attachment?"
              disabled={loading}
            />
            <button
              type="submit"
              className="action-btn-primary"
              style={{ width: 'auto', padding: '0.65rem 1.25rem' }}
              disabled={!query.trim() || loading}
            >
              {loading ? 'Consulting...' : 'Ask Advisor'}
            </button>
          </form>

          {advice && (
            <div className="advice-result-card">
              <div className="advice-badge-row">
                <span className="recommended-format-badge">Recommended: {advice.recommendedFormat}</span>
                <span className="advice-engine-tag">{advice.source}</span>
              </div>
              <h4 className="advice-title">{advice.title}</h4>
              <p className="advice-desc">{advice.explanation}</p>
              {advice.tips && advice.tips.length > 0 && (
                <div className="advice-tips-box">
                  <strong>Recommended Settings & Tips:</strong>
                  <ul>
                    {advice.tips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
