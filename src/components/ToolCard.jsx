import React from 'react';

export default function ToolCard({ tool, onSelect }) {
  const isMvp = tool.phase === 'MVP';

  const getCategoryColor = (category) => {
    switch (category) {
      case 'IMAGES': return 'cat-images';
      case 'PDFS': return 'cat-pdfs';
      case 'DOCUMENTS': return 'cat-docs';
      case 'AUDIO': return 'cat-audio';
      case 'VIDEO': return 'cat-video';
      default: return 'cat-default';
    }
  };

  return (
    <div className={`tool-card ${!isMvp ? 'tool-card-disabled' : ''}`}>
      <div className="tool-card-header">
        <span className={`category-tag ${getCategoryColor(tool.category)}`}>
          {tool.category}
        </span>
        <span className={`phase-badge ${isMvp ? 'phase-mvp' : 'phase-next'}`}>
          {isMvp ? 'MVP' : 'Phase 2'}
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
        {isMvp ? (
          <button
            className="action-btn-primary"
            onClick={() => onSelect(tool)}
          >
            Select Tool
          </button>
        ) : (
          <button className="action-btn-disabled" disabled>
            Unlocks in Phase 2
          </button>
        )}
      </div>
    </div>
  );
}
