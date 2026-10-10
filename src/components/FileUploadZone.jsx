import React, { useState, useRef } from 'react';

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'bmp'];
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

export default function FileUploadZone({ file, onFileSelected, onFileRemoved, disabled }) {
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const fileInputRef = useRef(null);

  const validateAndSelect = (selectedFile) => {
    setValidationError(null);
    if (!selectedFile) return;

    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      setValidationError('File size exceeds the 50MB limit. Please choose a smaller image.');
      return;
    }

    const name = selectedFile.name.toLowerCase();
    const extension = name.substring(name.lastIndexOf('.') + 1);
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      setValidationError(`Unsupported file type (.${extension}). Allowed formats: JPG, PNG, WebP, BMP.`);
      return;
    }

    onFileSelected(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSelect(e.dataTransfer.files[0]);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="upload-section">
      {!file ? (
        <div
          className={`dropzone ${isDragging ? 'dropzone-active' : ''} ${disabled ? 'dropzone-disabled' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".jpg,.jpeg,.png,.webp,.bmp,image/jpeg,image/png,image/webp,image/bmp"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                validateAndSelect(e.target.files[0]);
              }
            }}
            disabled={disabled}
          />
          <div className="dropzone-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
          </div>
          <p className="dropzone-title">Drag & drop your image here, or <span>browse</span></p>
          <p className="dropzone-subtitle">Supported: JPG, PNG, WebP, BMP (Up to 50MB)</p>
        </div>
      ) : (
        <div className="file-preview-card">
          <div className="file-info-group">
            <div className="file-avatar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </div>
            <div className="file-meta">
              <span className="file-name" title={file.name}>{file.name}</span>
              <div className="file-meta-sub">
                <span className="file-size-tag">{formatFileSize(file.size)}</span>
                <span className="file-type-tag">{file.name.split('.').pop().toUpperCase()}</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn-remove-file"
            onClick={onFileRemoved}
            disabled={disabled}
            title="Change selected file"
          >
            ✕ Remove
          </button>
        </div>
      )}

      {validationError && (
        <div className="error-callout" role="alert">
          <span className="error-icon">⚠️</span>
          <span>{validationError}</span>
        </div>
      )}
    </div>
  );
}
