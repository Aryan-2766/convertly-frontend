# Convertly Frontend

The user interface for **Convertly**, built with **React 18** and **Vite**.

## Features
- **Live System Health Monitor**: Real-time probe to the Spring Boot backend and Aiven Cloud MySQL database.
- **Categorized Dashboard**: Categorizes tools into Images, PDFs, Documents, Audio, and Video.
- **Accessible & Responsive**: Fully usable across screen sizes with clear status tags.
- **Vite Proxy Configured**: Routes `/api` calls directly to the Spring Boot backend (`http://localhost:8080`) during development.

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The frontend will start at: `http://localhost:5173`.

### 3. Production Build
```bash
npm run build
```
Outputs static assets into the `dist/` directory.
