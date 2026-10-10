import React from 'react';
import { getBatchDownloadUrl } from '../api/client';

/**
 * Displays multiple job results with individual download + Download All as ZIP.
 *
 * Props:
 *   results: Array<{ jobId, outputFileName, outputSizeBytes, inputSizeBytes, inputFormat, outputFormat }>
 *   onReset: () => void
 */
export default function BatchResultPanel({ results = [], onReset, label = 'Batch Results' }) {
  if (!results || results.length === 0) return null;

  const jobIds = results.map(r => r.jobId).filter(Boolean);
  const zipUrl = getBatchDownloadUrl(jobIds);

  const formatSize = (bytes) => {
    if (bytes == null) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="batch-result-panel">
      <div className="batch-header">
        <div className="batch-title">
          <span className="result-icon">✅</span>
          <strong>{label}</strong>
          <span className="batch-count">{results.length} file{results.length > 1 ? 's' : ''} ready</span>
        </div>
        {results.length > 1 && (
          <a
            className="download-btn batch-zip-btn"
            href={zipUrl}
            download="convertly-batch.zip"
          >
            📦 Download All as ZIP
          </a>
        )}
      </div>

      <div className="batch-items">
        {results.map((r, idx) => (
          <div key={r.jobId || idx} className="batch-item">
            <div className="batch-item-info">
              <span className="batch-item-name">{r.outputFileName || `file_${idx + 1}`}</span>
              <span className="batch-item-meta">
                {r.inputFormat} → {r.outputFormat}
                {r.outputSizeBytes != null && (
                  <> · {formatSize(r.outputSizeBytes)}</>
                )}
                {r.resolution && r.resolution !== 'original' && (
                  <> · {r.resolution}</>
                )}
              </span>
            </div>
            <a
              className="download-btn small"
              href={`${(import.meta.env.VITE_API_BASE || '').replace(/\/$/, '')}/api/jobs/${r.jobId}/download`}
              download={r.outputFileName}
            >
              ↓ Download
            </a>

          </div>
        ))}
      </div>

      <button className="reset-btn" onClick={onReset}>
        ← Convert More Files
      </button>
    </div>
  );
}
