import React, { useState, useEffect } from 'react';
import { fetchHistoryApi } from '../api/client';

export default function HistoryModal({ isOpen, onClose }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await fetchHistoryApi();
      setHistory(data);
    } catch (e) {
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (isoString) => {
    if (!isoString) return '-';
    try {
      return new Date(isoString).toLocaleString();
    } catch {
      return isoString;
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <h3 className="modal-title">Aiven Cloud MySQL — Conversion History</h3>
            <span className="ephemeral-tag">Cloud Metadata Audit Log</span>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Recent conversion jobs recorded in your cloud database (File contents are never stored in MySQL).
            </p>
            <button
              type="button"
              className="refresh-btn"
              onClick={loadHistory}
              disabled={loading}
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              <div className="spinner" style={{ margin: '0 auto 0.75rem' }}></div>
              Loading history from Aiven MySQL...
            </div>
          ) : history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
              No conversions recorded yet. Convert a file to see it logged here!
            </div>
          ) : (
            <div className="history-table-wrapper">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Operation</th>
                    <th>File</th>
                    <th>Input Size</th>
                    <th>Output Size</th>
                    <th>Status</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((job) => (
                    <tr key={job.id}>
                      <td>
                        <span className="op-tag">{job.operation}</span>
                      </td>
                      <td className="file-cell" title={job.originalFilename}>
                        {job.originalFilename}
                      </td>
                      <td>{formatBytes(job.inputSizeBytes)}</td>
                      <td>{formatBytes(job.outputSizeBytes)}</td>
                      <td>
                        <span className={`status-tag ${job.status === 'COMPLETED' ? 'status-ok' : 'status-fail'}`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="date-cell">{formatDate(job.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
