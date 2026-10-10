import React, { useState, useEffect } from 'react';

export default function ImageToolPanel({ file, isProcessing, onConvert, onResize, error }) {
  const [activeTab, setActiveTab] = useState('convert'); // 'convert' | 'resize'
  const [targetFormat, setTargetFormat] = useState('webp');
  const [quality, setQuality] = useState(85);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const [imageMeta, setImageMeta] = useState({ width: 0, height: 0, aspectRatio: 1 });

  // Load natural image dimensions when a file is selected
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const ar = img.naturalWidth / img.naturalHeight;
        setImageMeta({ width: img.naturalWidth, height: img.naturalHeight, aspectRatio: ar });
        setWidth(img.naturalWidth.toString());
        setHeight(img.naturalHeight.toString());
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }
  }, [file]);

  const handleWidthChange = (val) => {
    setWidth(val);
    if (keepAspectRatio && imageMeta.aspectRatio && val && !isNaN(val)) {
      const computedHeight = Math.round(Number(val) / imageMeta.aspectRatio);
      setHeight(computedHeight > 0 ? computedHeight.toString() : '');
    }
  };

  const handleHeightChange = (val) => {
    setHeight(val);
    if (keepAspectRatio && imageMeta.aspectRatio && val && !isNaN(val)) {
      const computedWidth = Math.round(Number(val) * imageMeta.aspectRatio);
      setWidth(computedWidth > 0 ? computedWidth.toString() : '');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file || isProcessing) return;

    if (activeTab === 'convert') {
      onConvert({
        file,
        targetFormat,
        quality: quality / 100.0,
      });
    } else {
      onResize({
        file,
        width: width ? parseInt(width, 10) : 0,
        height: height ? parseInt(height, 10) : 0,
        keepAspectRatio,
        targetFormat,
        quality: quality / 100.0,
      });
    }
  };

  return (
    <form className="settings-panel" onSubmit={handleSubmit}>
      <div className="panel-tabs">
        <button
          type="button"
          className={`panel-tab ${activeTab === 'convert' ? 'active' : ''}`}
          onClick={() => setActiveTab('convert')}
          disabled={isProcessing}
        >
          Format Converter
        </button>
        <button
          type="button"
          className={`panel-tab ${activeTab === 'resize' ? 'active' : ''}`}
          onClick={() => setActiveTab('resize')}
          disabled={isProcessing}
        >
          Resize & Dimensions
        </button>
      </div>

      <div className="panel-body">
        {/* Target Format Selector */}
        <div className="form-group">
          <label className="form-label">
            Target Output Format
            <span className="label-tip">Local ImageIO engine</span>
          </label>
          <div className="format-picker">
            {[
              { id: 'webp', label: 'WebP', note: 'Best for web' },
              { id: 'jpg', label: 'JPG', note: 'Standard photo' },
              { id: 'png', label: 'PNG', note: 'Lossless & transparent' },
              { id: 'bmp', label: 'BMP', note: 'Uncompressed' }
            ].map(fmt => (
              <button
                key={fmt.id}
                type="button"
                className={`format-option ${targetFormat === fmt.id ? 'selected' : ''}`}
                onClick={() => setTargetFormat(fmt.id)}
                disabled={isProcessing}
              >
                <span className="fmt-name">{fmt.label}</span>
                <span className="fmt-note">{fmt.note}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quality Slider (for JPG & WebP) */}
        {(targetFormat === 'jpg' || targetFormat === 'webp') && (
          <div className="form-group">
            <div className="form-label-row">
              <label className="form-label">Compression Quality</label>
              <span className="quality-value-badge">{quality}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="range-slider"
              disabled={isProcessing}
            />
            <div className="range-hints">
              <span>Smaller file size</span>
              <span>Balanced (Recommended: 85%)</span>
              <span>Maximum fidelity</span>
            </div>
          </div>
        )}

        {/* Resize Controls (if on Resize tab) */}
        {activeTab === 'resize' && (
          <div className="resize-fields-box">
            {imageMeta.width > 0 && (
              <div className="current-dimensions-banner">
                Original Dimensions: <strong>{imageMeta.width} × {imageMeta.height} px</strong>
              </div>
            )}

            <div className="dimension-inputs-row">
              <div className="form-group dimension-group">
                <label className="form-label">Width (px)</label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={width}
                  onChange={(e) => handleWidthChange(e.target.value)}
                  placeholder="e.g. 1200"
                  className="dimension-input"
                  disabled={isProcessing}
                />
              </div>

              <div className="dimensions-separator">×</div>

              <div className="form-group dimension-group">
                <label className="form-label">Height (px)</label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={height}
                  onChange={(e) => handleHeightChange(e.target.value)}
                  placeholder="e.g. 800"
                  className="dimension-input"
                  disabled={isProcessing}
                />
              </div>
            </div>

            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={keepAspectRatio}
                onChange={(e) => setKeepAspectRatio(e.target.checked)}
                disabled={isProcessing}
              />
              <span>Maintain original aspect ratio</span>
            </label>
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
          disabled={!file || isProcessing}
        >
          {isProcessing ? (
            <span className="btn-loading-state">
              <span className="spinner"></span>
              Processing local conversion...
            </span>
          ) : (
            <span>
              {activeTab === 'convert' ? `Convert to ${targetFormat.toUpperCase()}` : `Resize & Convert`}
            </span>
          )}
        </button>
      </div>
    </form>
  );
}
