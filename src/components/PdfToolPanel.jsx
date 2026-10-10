import React, { useState, useRef } from 'react';

export default function PdfToolPanel({ toolId, isProcessing, onMerge, onSplit, error }) {
  const isMerge = toolId === 'pdf-merge';

  // Merge state (multi-file)
  const [mergeFiles, setMergeFiles] = useState([]);
  const mergeInputRef = useRef(null);

  // Split state (single file + page range)
  const [splitFile, setSplitFile] = useState(null);
  const [pageRange, setPageRange] = useState('1-3');
  const splitInputRef = useRef(null);

  const handleMergeFilesAdded = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(f => f.name.toLowerCase().endsWith('.pdf'));
      setMergeFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeMergeFile = (index) => {
    setMergeFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSplitFileAdded = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const f = e.target.files[0];
      if (f.name.toLowerCase().endsWith('.pdf')) {
        setSplitFile(f);
      }
    }
  };

  const formatSize = (bytes) => {
    if (!bytes) return '0 B';
    return (bytes / 1024).toFixed(1) + ' KB';
  };

  const handleMergeSubmit = (e) => {
    e.preventDefault();
    if (mergeFiles.length < 2 || isProcessing) return;
    onMerge(mergeFiles);
  };

  const handleSplitSubmit = (e) => {
    e.preventDefault();
    if (!splitFile || isProcessing) return;
    onSplit({ file: splitFile, pageRange });
  };

  if (isMerge) {
    return (
      <form className="settings-panel" onSubmit={handleMergeSubmit}>
        <div className="panel-body">
          <div className="form-group">
            <label className="form-label">
              Select PDFs to Combine
              <span className="label-tip">Requires 2 or more files</span>
            </label>

            <div
              className="dropzone"
              onClick={() => mergeInputRef.current?.click()}
              style={{ padding: '1.75rem' }}
            >
              <input
                type="file"
                ref={mergeInputRef}
                style={{ display: 'none' }}
                accept=".pdf,application/pdf"
                multiple
                onChange={handleMergeFilesAdded}
                disabled={isProcessing}
              />
              <div className="dropzone-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="12" y1="18" x2="12" y2="12"></line>
                  <line x1="9" y1="15" x2="15" y2="15"></line>
                </svg>
              </div>
              <p className="dropzone-title">Click to <span>add PDF files</span> to merge</p>
              <p className="dropzone-subtitle">Files will be combined in the order listed below</p>
            </div>
          </div>

          {mergeFiles.length > 0 && (
            <div className="file-list-box">
              <div className="file-list-header">
                <span>Selected Files ({mergeFiles.length})</span>
                <button
                  type="button"
                  className="btn-clear-all"
                  onClick={() => setMergeFiles([])}
                  disabled={isProcessing}
                >
                  Clear All
                </button>
              </div>
              <div className="file-items-stack">
                {mergeFiles.map((f, idx) => (
                  <div key={idx} className="file-item-row">
                    <span className="file-index-badge">{idx + 1}</span>
                    <span className="item-name" title={f.name}>{f.name}</span>
                    <span className="item-size">{formatSize(f.size)}</span>
                    <button
                      type="button"
                      className="btn-remove-item"
                      onClick={() => removeMergeFile(idx)}
                      disabled={isProcessing}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="error-callout" role="alert">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="submit-process-btn"
            disabled={mergeFiles.length < 2 || isProcessing}
          >
            {isProcessing ? (
              <span className="btn-loading-state">
                <span className="spinner"></span>
                Merging PDFs using PDFBox...
              </span>
            ) : (
              <span>Merge {mergeFiles.length} PDF Files</span>
            )}
          </button>
        </div>
      </form>
    );
  }

  // Split Tool Panel
  return (
    <form className="settings-panel" onSubmit={handleSplitSubmit}>
      <div className="panel-body">
        <div className="form-group">
          <label className="form-label">Upload PDF Document</label>
          {!splitFile ? (
            <div
              className="dropzone"
              onClick={() => splitInputRef.current?.click()}
              style={{ padding: '1.75rem' }}
            >
              <input
                type="file"
                ref={splitInputRef}
                style={{ display: 'none' }}
                accept=".pdf,application/pdf"
                onChange={handleSplitFileAdded}
                disabled={isProcessing}
              />
              <div className="dropzone-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
              </div>
              <p className="dropzone-title">Click to <span>select PDF file</span> to split</p>
            </div>
          ) : (
            <div className="file-preview-card">
              <div className="file-info-group">
                <div className="file-avatar">PDF</div>
                <div className="file-meta">
                  <span className="file-name">{splitFile.name}</span>
                  <span className="file-size-tag">{formatSize(splitFile.size)}</span>
                </div>
              </div>
              <button
                type="button"
                className="btn-remove-file"
                onClick={() => setSplitFile(null)}
                disabled={isProcessing}
              >
                ✕ Change File
              </button>
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            Page Range to Extract
            <span className="label-tip">e.g. 1-3, 5, or all</span>
          </label>
          <input
            type="text"
            className="dimension-input"
            value={pageRange}
            onChange={(e) => setPageRange(e.target.value)}
            placeholder="1-3, 5"
            disabled={isProcessing}
          />
          <div className="range-hints">
            <span>Examples: <strong>1-3</strong> (Pages 1 through 3)</span>
            <span><strong>2, 4, 6</strong> (Specific pages)</span>
            <span><strong>all</strong> (Full doc)</span>
          </div>
        </div>

        {error && (
          <div className="error-callout" role="alert">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          className="submit-process-btn"
          disabled={!splitFile || !pageRange.trim() || isProcessing}
        >
          {isProcessing ? (
            <span className="btn-loading-state">
              <span className="spinner"></span>
              Extracting pages...
            </span>
          ) : (
            <span>Extract & Split PDF</span>
          )}
        </button>
      </div>
    </form>
  );
}
