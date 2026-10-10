# Convertly Frontend 🎨

The modern, responsive web application for **Convertly** — a unified media and document conversion workspace built with React 18, Vite, and clean vanilla CSS.

---

## 🌟 Highlights

- **Unified Tool Workspace**: Intuitive workspace panels for Images, PDFs, Documents, Audio, and Video.
- **Drag & Drop Upload Zone**: Client-side format detection, magic bytes validation, and 50MB file size limits.
- **Live Diagnostics Bar**: Real-time health monitoring of the Spring Boot backend, Aiven Cloud MySQL connection, and storage mode.
- **Interactive Image Tools**:
  - Format converter (JPG, PNG, WebP, BMP) with quality sliders.
  - Custom image dimensions with aspect-ratio locking.
- **Advanced PDF Tools**:
  - Multi-file PDF merger with stack reordering.
  - PDF splitter supporting custom page ranges (`1-3, 5` or `all`).
- **Phase 2 Media Hub**:
  - Audio format converter (MP3, WAV, AAC, OGG, FLAC, M4A).
  - Video format converter (MP4, MKV, AVI, MOV, WebM) with resolution presets (`720p HD`, `480p SD`, `360p Low`).
  - Video to MP3 audio extractor.
- **Batch Processing & ZIP Download**: Multi-file result panel with one-click "Download All as ZIP".
- **Aiven Cloud Conversion History**: Live modal showing timestamped conversion audit logs retrieved from MySQL.
- **Smart Format Advisor**: Built-in zero-cost recommendation modal that suggests optimal file formats and compression settings for specific use cases.

---

## 🛠️ Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite 5
- **Styling**: Modern Custom CSS (Dark Theme, responsive layout, CSS variables)
- **API Communication**: Native Fetch API with Vite development proxy (`/api` -> `http://localhost:8080`)

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure **Node.js** (v18+) and **npm** are installed.

### 2. Clone the repository
```bash
git clone https://github.com/Aryan-2766/convertly-frontend.git
cd convertly-frontend
```

### 3. Install dependencies
```bash
npm install
```

### 4. Run development server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`. Make sure the **convertly-backend** is running on port `8080` for API requests.

### 5. Build for production
```bash
npm run build
```
The optimized production bundle will be generated in the `dist/` directory.

---

## 📁 Project Architecture

```
convertly-frontend/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── index.css
    ├── App.jsx                 # Main application dashboard & workspace router
    ├── App.css                 # Comprehensive styling system
    ├── api/
    │   └── client.js           # API client for backend communication
    └── components/
        ├── Header.jsx          # Top bar with health badges & action buttons
        ├── ToolCard.jsx        # Category cards with dynamic availability badges
        ├── FileUploadZone.jsx  # Drag-and-drop file upload zone
        ├── ImageToolPanel.jsx  # Image conversion & resize panel
        ├── PdfToolPanel.jsx    # PDF merge & split panel
        ├── DocumentToolPanel.jsx # DOCX to PDF converter panel
        ├── AudioToolPanel.jsx  # Audio conversion panel
        ├── VideoToolPanel.jsx  # Video converter & audio extractor panel
        ├── JobResultCard.jsx   # Single conversion result & download card
        ├── BatchResultPanel.jsx# Batch result manager with ZIP download
        ├── HistoryModal.jsx    # Aiven Cloud MySQL audit log modal
        └── AdvisorModal.jsx    # Smart format advisor modal
```

---

## 📄 License
MIT License. Created for College Full Stack Development Project.
