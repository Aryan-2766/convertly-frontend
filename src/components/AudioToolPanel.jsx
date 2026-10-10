import React, { useState } from 'react';
import FileUploadZone from './FileUploadZone';
import JobResultCard from './JobResultCard';
import { convertAudioApi } from '../api/client';

const AUDIO_FORMATS = ['mp3', 'wav', 'aac', 'ogg', 'flac'];

export default function AudioToolPanel({ ffmpegAvailable = true }) {
  const [activeTab, setActiveTab] = useState('convert');
  const [file, setFile] = useState(null);
  const [outputFormat, setOutputFormat] = useState('mp3');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleConvert = async () => {
    if (!file) { setError('Please select an audio file.'); return; }
    setIsProcessing(true);
    setError('');
    setResult(null);
    try {
      const data = await convertAudioApi(file, outputFormat);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Audio conversion failed.');
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
        <JobResultCard
          result={result}
          onReset={handleReset}
          label="Audio Converted"
        />
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
          🎵 Format Converter
        </button>
      </div>

      <FileUploadZone
        accept=".mp3,.wav,.aac,.ogg,.flac,.m4a,audio/*"
        label="Drop your audio file here"
        hint="MP3, WAV, AAC, OGG, FLAC, M4A — max 50 MB"
        onFileSelected={setFile}
        currentFile={file}
      />

      {file && (
        <div className="conversion-options">
          <div className="option-group">
            <label>Convert to</label>
            <div className="format-grid">
              {AUDIO_FORMATS.map(fmt => (
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

          {error && <p className="error-msg">{error}</p>}

          <button
            className="convert-btn"
            onClick={handleConvert}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <><span className="spinner" /> Converting…</>
            ) : (
              `Convert to ${outputFormat.toUpperCase()}`
            )}
          </button>
        </div>
      )}
    </div>
  );
}
