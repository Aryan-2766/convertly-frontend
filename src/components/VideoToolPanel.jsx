import React, { useState } from 'react';
import FileUploadZone from './FileUploadZone';
import JobResultCard from './JobResultCard';
import { convertVideoApi, extractAudioApi } from '../api/client';

const VIDEO_FORMATS = ['mp4', 'mkv', 'avi', 'mov', 'webm'];
const RESOLUTION_PRESETS = [
  { value: 'original', label: 'Original' },
  { value: '720p',     label: '720p HD' },
  { value: '480p',     label: '480p SD' },
  { value: '360p',     label: '360p Low' },
];

export default function VideoToolPanel({ ffmpegAvailable = true }) {
  const [activeTab, setActiveTab] = useState('convert');
  const [file, setFile] = useState(null);
  const [outputFormat, setOutputFormat] = useState('mp4');
  const [resolution, setResolution] = useState('original');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleConvert = async () => {
    if (!file) { setError('Please select a video file.'); return; }
    setIsProcessing(true);
    setError('');
    setResult(null);
    try {
      const data = await convertVideoApi(file, outputFormat, resolution);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Video conversion failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExtractAudio = async () => {
    if (!file) { setError('Please select a video file.'); return; }
    setIsProcessing(true);
    setError('');
    setResult(null);
    try {
      const data = await extractAudioApi(file);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Audio extraction failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError('');
  };

  if (!ffmpegAvailable) {
    return (
      <div className="tool-panel">
        <div className="unavailable-notice">
          <span className="unavailable-icon">⚠️</span>
          <div>
            <strong>FFmpeg not found</strong>
            <p>Install FFmpeg to enable audio &amp; video tools:</p>
            <code>winget install Gyan.FFmpeg</code>
            <p style={{ marginTop: 8, fontSize: '0.8rem', opacity: 0.7 }}>
              Then restart the backend server.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="tool-panel">
        <JobResultCard result={result} onReset={handleReset} label="Video Processed" />
      </div>
    );
  }

  return (
    <div className="tool-panel">
      <div className="tool-tabs">
        <button
          className={`tool-tab ${activeTab === 'convert' ? 'active' : ''}`}
          onClick={() => setActiveTab('convert')}
        >
          🎬 Format Converter
        </button>
        <button
          className={`tool-tab ${activeTab === 'extract' ? 'active' : ''}`}
          onClick={() => setActiveTab('extract')}
        >
          🎵 Extract Audio
        </button>
      </div>

      <FileUploadZone
        accept=".mp4,.mkv,.avi,.mov,.webm,video/*"
        label="Drop your video file here"
        hint="MP4, MKV, AVI, MOV, WebM — max 50 MB"
        onFileSelected={setFile}
        currentFile={file}
      />

      {activeTab === 'convert' && file && (
        <div className="conversion-options">
          <div className="option-group">
            <label>Output Format</label>
            <div className="format-grid">
              {VIDEO_FORMATS.map(fmt => (
                <button
                  key={fmt}
                  className={`format-btn ${outputFormat === fmt ? 'selected' : ''}`}
                  onClick={() => setOutputFormat(fmt)}
                >
                  {fmt.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="option-group">
            <label>Resolution Preset</label>
            <div className="format-grid">
              {RESOLUTION_PRESETS.map(p => (
                <button
                  key={p.value}
                  className={`format-btn ${resolution === p.value ? 'selected' : ''}`}
                  onClick={() => setResolution(p.value)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button className="convert-btn" onClick={handleConvert} disabled={isProcessing}>
            {isProcessing ? (
              <><span className="spinner" /> Converting…</>
            ) : (
              `Convert to ${outputFormat.toUpperCase()}${resolution !== 'original' ? ` (${resolution})` : ''}`
            )}
          </button>
        </div>
      )}

      {activeTab === 'extract' && file && (
        <div className="conversion-options">
          <p style={{ color: '#94a3b8', marginBottom: 12 }}>
            Extracts the audio track from your video and saves it as <strong>MP3</strong>.
          </p>

          {error && <p className="error-msg">{error}</p>}

          <button className="convert-btn" onClick={handleExtractAudio} disabled={isProcessing}>
            {isProcessing ? (
              <><span className="spinner" /> Extracting…</>
            ) : (
              'Extract Audio as MP3'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
