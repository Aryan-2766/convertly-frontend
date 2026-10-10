import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ToolCard from './components/ToolCard';
import FileUploadZone from './components/FileUploadZone';
import ImageToolPanel from './components/ImageToolPanel';
import PdfToolPanel from './components/PdfToolPanel';
import DocumentToolPanel from './components/DocumentToolPanel';
import AudioToolPanel from './components/AudioToolPanel';
import VideoToolPanel from './components/VideoToolPanel';
import JobResultCard from './components/JobResultCard';
import HistoryModal from './components/HistoryModal';
import AdvisorModal from './components/AdvisorModal';
import {
  fetchHealth,
  fetchTools,
  convertImageApi,
  resizeImageApi,
  mergePdfsApi,
  splitPdfApi,
  convertDocxToPdfApi
} from './api/client';
import './App.css';

export default function App() {
  const [health, setHealth] = useState(null);
  const [healthLoading, setHealthLoading] = useState(true);
  const [tools, setTools] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Active Tool & Workspace State
  const [activeTool, setActiveTool] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversionResult, setConversionResult] = useState(null);
  const [processingError, setProcessingError] = useState(null);

  // Modals state
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);

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
    try {
      const data = await fetchTools();
      setTools(data);
    } catch (err) {
      // Fallback local tool list
      setTools([
        {
          id: 'image-convert',
          name: 'Image Format Converter',
          description: 'Convert images between JPG, PNG, WebP, and BMP with high fidelity.',
          category: 'IMAGES',
          phase: 'MVP',
          supportedInputFormats: ['jpg', 'jpeg', 'png', 'webp', 'bmp'],
          supportedOutputFormats: ['jpg', 'jpeg', 'png', 'webp', 'bmp'],
          available: true
        },
        {
          id: 'image-resize',
          name: 'Image Resizer & Compressor',
          description: 'Resize dimensions and adjust quality settings for optimal web performance.',
          category: 'IMAGES',
          phase: 'MVP',
          supportedInputFormats: ['jpg', 'jpeg', 'png', 'webp'],
          supportedOutputFormats: ['jpg', 'jpeg', 'png', 'webp'],
          available: true
        },
        {
          id: 'pdf-merge',
          name: 'PDF Merger',
          description: 'Combine multiple PDF documents into a single organized PDF file.',
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
    }
  };

  useEffect(() => {
    checkConnection();
    loadTools();
  }, []);

  const handleToolSelect = (tool) => {
    setActiveTool(tool);
    setSelectedFile(null);
    setConversionResult(null);
    setProcessingError(null);
    setTimeout(() => {
      document.getElementById('active-workspace')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleResetWorkspace = () => {
    setSelectedFile(null);
    setConversionResult(null);
    setProcessingError(null);
  };

  // Image actions
  const handleImageConvert = async ({ file, targetFormat, quality }) => {
    setIsProcessing(true);
    setProcessingError(null);
    try {
      const result = await convertImageApi({ file, targetFormat, quality });
      setConversionResult(result);
    } catch (err) {
      setProcessingError(err.message || 'Conversion failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImageResize = async ({ file, width, height, keepAspectRatio, targetFormat, quality }) => {
    setIsProcessing(true);
    setProcessingError(null);
    try {
      const result = await resizeImageApi({ file, width, height, keepAspectRatio, targetFormat, quality });
      setConversionResult(result);
    } catch (err) {
      setProcessingError(err.message || 'Resize failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // PDF actions
  const handlePdfMerge = async (files) => {
    setIsProcessing(true);
    setProcessingError(null);
    try {
      const result = await mergePdfsApi(files);
      setConversionResult(result);
    } catch (err) {
      setProcessingError(err.message || 'PDF merge failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePdfSplit = async ({ file, pageRange }) => {
    setIsProcessing(true);
    setProcessingError(null);
    try {
      const result = await splitPdfApi({ file, pageRange });
      setConversionResult(result);
    } catch (err) {
      setProcessingError(err.message || 'PDF split failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Document action
  const handleDocxConvert = async (file) => {
    setIsProcessing(true);
    setProcessingError(null);
    try {
      const result = await convertDocxToPdfApi(file);
      setConversionResult(result);
    } catch (err) {
      setProcessingError(err.message || 'DOCX to PDF conversion failed.');
    } finally {
      setIsProcessing(false);
    }
  };

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
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenAdvisor={() => setIsAdvisorOpen(true)}
      />

      <main className="main-content">
        {/* Architecture Notice Banner */}
        <section className="notice-banner">
          <div className="banner-row">
            <div className="banner-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
              </svg>
            </div>
            <div>
              <div className="banner-title">
                Cloud Database & Transient File Processing
                <span className="banner-pill">Zero Permanent Local Storage</span>
              </div>
              <p className="banner-text">
                All metadata and conversion audit logs are recorded in <strong>Aiven Cloud MySQL</strong>.
                Conversions run strictly in-memory or in an auto-purged scratch folder with 15-minute expiration, guaranteeing zero permanent files on disk.
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
              <span className="diag-label">Cloud MySQL Status</span>
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
              <span className="diag-label">Cloud Database</span>
              <span className="diag-value">Aiven MySQL (SSL Required)</span>
            </div>
          </div>
        </section>

        {/* Active Tool Processing Workspace */}
        {activeTool && (
          <section id="active-workspace" className="tool-workspace">
            <div className="workspace-header">
              <div className="workspace-title-box">
                <span className={`category-tag cat-${activeTool.category.toLowerCase()}`}>
                  {activeTool.category}
                </span>
                <h2 className="workspace-title">{activeTool.name}</h2>
              </div>
              <button
                type="button"
                className="btn-close-workspace"
                onClick={() => setActiveTool(null)}
              >
                ✕ Close Workspace
              </button>
            </div>

            {/* Render Tool based on selected tool type */}
            {!conversionResult ? (
              <>
                {/* 1. IMAGE TOOLS */}
                {activeTool.category === 'IMAGES' && (
                  <>
                    <FileUploadZone
                      file={selectedFile}
                      onFileSelected={(f) => {
                        setSelectedFile(f);
                        setConversionResult(null);
                        setProcessingError(null);
                      }}
                      onFileRemoved={handleResetWorkspace}
                      disabled={isProcessing}
                    />
                    {selectedFile && (
                      <ImageToolPanel
                        file={selectedFile}
                        isProcessing={isProcessing}
                        onConvert={handleImageConvert}
                        onResize={handleImageResize}
                        error={processingError}
                      />
                    )}
                  </>
                )}

                {/* 2. PDF TOOLS */}
                {activeTool.category === 'PDFS' && (
                  <PdfToolPanel
                    toolId={activeTool.id}
                    isProcessing={isProcessing}
                    onMerge={handlePdfMerge}
                    onSplit={handlePdfSplit}
                    error={processingError}
                  />
                )}

                {/* 3. DOCUMENT TOOLS */}
                {activeTool.category === 'DOCUMENTS' && (
                  <DocumentToolPanel
                    file={selectedFile}
                    onFileSelected={(f) => {
                      setSelectedFile(f);
                      setConversionResult(null);
                      setProcessingError(null);
                    }}
                    isProcessing={isProcessing}
                    onConvert={handleDocxConvert}
                    error={processingError}
                  />
                )}

                {/* 4. AUDIO TOOLS */}
                {activeTool.category === 'AUDIO' && (
                  <AudioToolPanel
                    ffmpegAvailable={activeTool.available}
                  />
                )}

                {/* 5. VIDEO TOOLS */}
                {activeTool.category === 'VIDEO' && (
                  <VideoToolPanel
                    ffmpegAvailable={activeTool.available}
                  />
                )}
              </>
            ) : (
              /* Conversion Result & Download Action */
              <JobResultCard
                result={conversionResult}
                onReset={handleResetWorkspace}
              />
            )}
          </section>
        )}

        {/* Category Filter Bar */}
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
              onSelect={handleToolSelect}
            />
          ))}
        </div>
      </main>

      <footer className="app-footer">
        <p>Convertly © 2026 — College Full Stack Development Project. Local processing with Aiven Cloud MySQL.</p>
      </footer>

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />

      {/* Format Advisor Modal */}
      <AdvisorModal
        isOpen={isAdvisorOpen}
        onClose={() => setIsAdvisorOpen(false)}
      />
    </div>
  );
}
