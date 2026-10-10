import React from 'react';

export default function JobResultCard({ result, onReset }) {
  if (!result) return null;

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = () => {
    // Initiate direct download from backend streaming endpoint
    window.location.href = result.downloadUrl;
  };

  return (
    <div className="result-card">
      <div className="result-header">
        <div className="result-success-badge">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Conversion Completed</span>
        </div>
        <span className="ephemeral-tag">Auto-purges in {result.expiresInMinutes || 15}m</span>
      </div>

      <div className="result-grid">
        <div className="result-stat">
          <span className="stat-label">Original File</span>
          <span className="stat-value">{result.originalFilename}</span>
          <span className="stat-sub">{formatBytes(result.inputSizeBytes)} ({result.inputFormat?.toUpperCase()})</span>
        </div>

        <div className="result-stat">
          <span className="stat-label">Converted Output</span>
          <span className="stat-value">{formatBytes(result.outputSizeBytes)}</span>
          <span className="stat-sub">
            {result.outputFormat?.toUpperCase()} • {result.width} × {result.height} px
          </span>
        </div>

        <div className="result-stat stat-savings">
          <span className="stat-label">Size Change</span>
          <span className="stat-value">
            {result.sizeReductionPercent > 0
              ? `-${result.sizeReductionPercent}%`
              : `+${Math.abs(result.sizeReductionPercent)}%`}
          </span>
          <span className="stat-sub">
            {result.sizeReductionPercent > 0 ? 'File size reduced!' : 'High-fidelity export'}
          </span>
        </div>
      </div>

      <div className="result-actions">
        <button
          type="button"
          className="btn-download-primary"
          onClick={handleDownload}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <span>Download Converted File</span>
        </button>

        <button
          type="button"
          className="btn-convert-another"
          onClick={onReset}
        >
          Convert Another File
        </button>
      </div>
    </div>
  );
}
