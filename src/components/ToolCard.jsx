import React from 'react';

export default function ToolCard({ tool, onSelect }) {
  const isAvailable = tool.available !== false; // default true if not set

  const getCategoryColor = (category) => {
    switch (category) {
      case 'IMAGES':    return 'cat-images';
      case 'PDFS':      return 'cat-pdfs';
      case 'DOCUMENTS': return 'cat-docs';
      case 'AUDIO':     return 'cat-audio';
      case 'VIDEO':     return 'cat-video';
      default:          return 'cat-default';
    }
  };

  const getPhaseBadge = (phase) => {
    if (!phase) return '';
    return `phase-${phase.toLowerCase()}`;
  };

  const phaseLabel = tool.phase === 'MVP' ? 'MVP'
    : tool.phase === 'PHASE_2' ? 'Phase 2'
    : tool.phase || '';

  return (
    <div className={`tool-card ${!isAvailable ? 'tool-card-disabled' : ''}`}>
      <div className="tool-card-header">
        <span className={`category-tag ${getCategoryColor(tool.category)}`}>
          {tool.category}
        </span>
        <span className={`phase-badge ${tool.phase === 'MVP' ? 'phase-mvp' : getPhaseBadge(tool.phase)}`}>
          {phaseLabel}
        </span>
      </div>

      <h3 className="tool-card-title">{tool.name}</h3>
      <p className="tool-card-desc">{tool.description}</p>

      <div className="tool-formats-box">
        <div className="format-row">
          <span className="format-label">Inputs:</span>
          <span className="format-values">
            {tool.supportedInputFormats.map(fmt => fmt.toUpperCase()).join(', ')}
          </span>
        </div>
        <div className="format-row">
          <span className="format-label">Outputs:</span>
          <span className="format-values">
            {tool.supportedOutputFormats.map(fmt => fmt.toUpperCase()).join(', ')}
          </span>
        </div>
      </div>

      <div className="tool-card-footer">
        {isAvailable ? (
          <button
            className="action-btn-primary"
            onClick={() => onSelect(tool)}
          >
            Select Tool
          </button>
        ) : (
          <button className="action-btn-disabled" disabled>
            FFmpeg required
          </button>
        )}
      </div>
    </div>
  );
}
