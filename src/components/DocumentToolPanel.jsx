import React, { useRef } from 'react';

export default function DocumentToolPanel({ toolId = 'docx-to-pdf', file, onFileSelected, isProcessing, onConvert, error }) {
  const fileInputRef = useRef(null);

  const isPptx = toolId === 'pptx-to-pdf';
  const docTypeLabel = isPptx ? 'Microsoft PowerPoint (.pptx)' : 'Microsoft Word Document (.docx)';
  const fileExtLabel = isPptx ? 'PPTX' : 'DOCX';
  const acceptPattern = isPptx
    ? '.pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation'
    : '.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file || isProcessing) return;
    onConvert(file, isPptx);
  };

  const isLibreOfficeMissing = error && error.toLowerCase().includes('libreoffice');

  return (
    <form className="settings-panel" onSubmit={handleSubmit}>
      <div className="panel-body">
        <div className="form-group">
          <label className="form-label">
            {docTypeLabel}
            <span className="label-tip">Local headless conversion</span>
          </label>

          {!file ? (
            <div
              className="dropzone"
              onClick={() => fileInputRef.current?.click()}
              style={{ padding: '2rem' }}
            >
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept={acceptPattern}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    onFileSelected(e.target.files[0]);
                  }
                }}
                disabled={isProcessing}
              />
              <div className="dropzone-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <p className="dropzone-title">Click to <span>browse {fileExtLabel} document</span></p>
              <p className="dropzone-subtitle">Convert slides &amp; formatting directly into standard PDF</p>
            </div>
          ) : (
            <div className="file-preview-card">
              <div className="file-info-group">
                <div className="file-avatar">{isPptx ? 'PPT' : 'DOC'}</div>
                <div className="file-meta">
                  <span className="file-name">{file.name}</span>
                  <span className="file-size-tag">{(file.size / 1024).toFixed(1)} KB</span>
                </div>
              </div>
              <button
                type="button"
                className="btn-remove-file"
                onClick={() => onFileSelected(null)}
                disabled={isProcessing}
              >
                ✕ Change File
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="error-callout" role="alert">
            <span className="error-icon">⚠️</span>
            <div>
              <p style={{ fontWeight: 600 }}>{error}</p>
              {isLibreOfficeMissing && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#e2e8f0' }}>
                  <strong>How to enable Office-to-PDF:</strong>
                  <ol style={{ paddingLeft: '1.25rem', marginTop: '0.25rem' }}>
                    <li>Install LibreOffice from <a href="https://www.libreoffice.org/download/download-libreoffice/" target="_blank" rel="noreferrer" style={{ color: '#93c5fd', textDecoration: 'underline' }}>libreoffice.org</a></li>
                    <li>Ensure it's in the standard directory (or system PATH)</li>
                    <li>Convertly will automatically detect <code>soffice</code>!</li>
                  </ol>
                </div>
              )}
            </div>
          </div>
        )}

        <button
          type="submit"
          className="submit-process-btn"
          disabled={!file || isProcessing}
        >
          {isProcessing ? (
            <span className="btn-loading-state">
              <span className="spinner"></span>
              Converting {fileExtLabel} to PDF...
            </span>
          ) : (
            <span>Convert {fileExtLabel} to PDF</span>
          )}
        </button>
      </div>
    </form>
  );
}
