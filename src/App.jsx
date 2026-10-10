import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ToolCard from './components/ToolCard';
import { fetchHealth, fetchTools } from './api/client';
import './App.css';

export default function App() {
  const [health, setHealth] = useState(null);
  const [healthLoading, setHealthLoading] = useState(true);
  const [tools, setTools] = useState([]);
  const [toolsLoading, setToolsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activeTool, setActiveTool] = useState(null);

  const checkConnection = async () => {
    setHealthLoading(true);
    try {
      const data = await fetchHealth();
      setHealth(data);
    } catch (err) {
      setHealth(null);
    } finally {
      setHealthLoading(false);
    }
  };

  const loadTools = async () => {
    setToolsLoading(true);
    try {
      const data = await fetchTools();
      setTools(data);
    } catch (err) {
      // Fallback local tool list if backend is momentarily unreachable
      setTools([
        {
          id: 'image-convert',
          name: 'Image Format Converter',
          description: 'Convert images between JPG, PNG, WebP, and BMP.',
          category: 'IMAGES',
          phase: 'MVP',
          supportedInputFormats: ['jpg', 'jpeg', 'png', 'webp'],
          supportedOutputFormats: ['jpg', 'jpeg', 'png', 'webp'],
          available: true
        },
        {
          id: 'image-resize',
          name: 'Image Resizer & Compressor',
          description: 'Resize dimensions and adjust quality settings for web performance.',
          category: 'IMAGES',
          phase: 'MVP',
          supportedInputFormats: ['jpg', 'jpeg', 'png', 'webp'],
          supportedOutputFormats: ['jpg', 'jpeg', 'png', 'webp'],
          available: true
        },
        {
          id: 'pdf-merge',
          name: 'PDF Merger',
          description: 'Combine multiple PDF documents into a single organized file.',
          category: 'PDFS',
          phase: 'MVP',
          supportedInputFormats: ['pdf'],
          supportedOutputFormats: ['pdf'],
          available: true
        },
        {
          id: 'pdf-split',
          name: 'PDF Splitter',
          description: 'Extract specific page ranges or split a PDF into separate files.',
          category: 'PDFS',
          phase: 'MVP',
          supportedInputFormats: ['pdf'],
          supportedOutputFormats: ['pdf'],
          available: true
        },
        {
          id: 'docx-to-pdf',
          name: 'DOCX to PDF',
          description: 'Convert Microsoft Word documents (.docx) into standard PDF format.',
          category: 'DOCUMENTS',
          phase: 'MVP',
          supportedInputFormats: ['docx'],
          supportedOutputFormats: ['pdf'],
          available: true
        },
        {
          id: 'audio-convert',
          name: 'Audio Converter',
          description: 'Convert audio files between MP3, WAV, AAC, and OGG using local FFmpeg.',
          category: 'AUDIO',
          phase: 'PHASE_2',
          supportedInputFormats: ['mp3', 'wav', 'aac'],
          supportedOutputFormats: ['mp3', 'wav', 'aac'],
          available: false
        },
        {
          id: 'video-convert',
          name: 'Video Converter & Audio Extractor',
          description: 'Convert video formats or extract audio track using local FFmpeg.',
          category: 'VIDEO',
          phase: 'PHASE_2',
          supportedInputFormats: ['mp4', 'mkv', 'avi'],
          supportedOutputFormats: ['mp4', 'webm', 'mp3'],
          available: false
        }
      ]);
    } finally {
      setToolsLoading(false);
    }
  };

  useEffect(() => {
    checkConnection();
    loadTools();
  }, []);

  const categories = ['ALL', 'IMAGES', 'PDFS', 'DOCUMENTS', 'AUDIO', 'VIDEO'];

  const filteredTools = selectedCategory === 'ALL'
    ? tools
    : tools.filter(t => t.category === selectedCategory);

  return (
    <div className="app-container">
      <Header
        health={health}
        loading={healthLoading}
        onRefresh={() => {
          checkConnection();
          loadTools();
        }}
      />

      <main className="main-content">
        {/* Cloud & Ephemeral Architecture Notice */}
        <section className="notice-banner">
          <div className="banner-row">
            <div className="banner-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
              </svg>
            </div>
            <div>
              <div className="banner-title">
                Cloud-Connected Architecture & Transient Storage
                <span className="banner-pill">Zero Permanent Local Storage</span>
              </div>
              <p className="banner-text">
                All metadata and conversion audit logs are routed to <strong>Aiven Cloud MySQL</strong>.
                Uploaded files are processed strictly in-memory or inside an auto-purging ephemeral scratch folder and deleted immediately after conversion.
              </p>
            </div>
          </div>
        </section>

        {/* Live Diagnostics Panel */}
        <section className="diagnostics-panel">
          <div className="diagnostics-header">System Health & Live Environment</div>
          <div className="diagnostics-grid">
            <div className="diag-item">
              <span className="diag-label">Spring Boot API</span>
              <span className="diag-value">
                {health ? health.status : (healthLoading ? 'Checking...' : 'Offline (Start backend)')}
              </span>
            </div>
            <div className="diag-item">
              <span className="diag-label">Database Connection</span>
              <span className="diag-value">
                {health ? health.databaseStatus : (healthLoading ? 'Checking...' : 'Disconnected')}
              </span>
            </div>
            <div className="diag-item">
              <span className="diag-label">Storage Retention Policy</span>
              <span className="diag-value">
                {health ? health.storageMode : 'Ephemeral Scratch (Auto-Purge 15m)'}
              </span>
            </div>
            <div className="diag-item">
              <span className="diag-label">Cloud Target</span>
              <span className="diag-value">Aiven MySQL (SSL Required)</span>
            </div>
          </div>
        </section>

        {/* Category Filters */}
        <div className="filter-bar">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tool Cards Grid */}
        <div className="tool-grid">
          {filteredTools.map(tool => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onSelect={(t) => setActiveTool(t)}
            />
          ))}
        </div>

        {/* Tool Selection Preview Modal */}
        {activeTool && (
          <div style={{
            marginTop: '2rem',
            padding: '1.5rem',
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--card-radius)',
            border: '1px solid var(--accent-primary)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h3 style={{ color: 'var(--text-primary)', margin: 0 }}>Selected: {activeTool.name}</h3>
              <button
                onClick={() => setActiveTool(null)}
                style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', cursor: 'pointer' }}
              >
                ✕ Close
              </button>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              {activeTool.description}
            </p>
            <div style={{
              background: 'var(--bg-primary)',
              padding: '1rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)'
            }}>
              <strong>Phase 1 Foundation Verified:</strong> This tool interface is ready. In the next phase, we attach the multipart upload dropzone and processing pipeline!
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Convertly © 2026 — College Full Stack Development Project. Local processing with Aiven Cloud MySQL.</p>
      </footer>
    </div>
  );
}
