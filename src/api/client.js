/**
 * Centralized API client for communicating with the Convertly Spring Boot backend.
 */

const API_BASE = '/api';

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, {
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`Backend returned HTTP ${res.status}`);
    }
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error('Failed to fetch health status:', error);
    throw error;
  }
}

export async function fetchTools() {
  try {
    const res = await fetch(`${API_BASE}/tools`, {
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`Backend returned HTTP ${res.status}`);
    }
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error('Failed to fetch tool definitions:', error);
    throw error;
  }
}

export async function convertImageApi({ file, targetFormat, quality }) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('targetFormat', targetFormat);
  formData.append('quality', quality.toString());

  const res = await fetch(`${API_BASE}/files/images/convert`, {
    method: 'POST',
    body: formData,
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || `Conversion failed with status ${res.status}`);
  }
  return json.data;
}

export async function resizeImageApi({ file, width, height, keepAspectRatio, targetFormat, quality }) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('width', width.toString());
  formData.append('height', height.toString());
  formData.append('keepAspectRatio', keepAspectRatio.toString());
  if (targetFormat) {
    formData.append('targetFormat', targetFormat);
  }
  formData.append('quality', quality.toString());

  const res = await fetch(`${API_BASE}/files/images/resize`, {
    method: 'POST',
    body: formData,
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || `Resize failed with status ${res.status}`);
  }
  return json.data;
}

export async function mergePdfsApi(files) {
  const formData = new FormData();
  for (const file of files) {
    formData.append('files', file);
  }

  const res = await fetch(`${API_BASE}/files/pdfs/merge`, {
    method: 'POST',
    body: formData,
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || `PDF merge failed with status ${res.status}`);
  }
  return json.data;
}

export async function splitPdfApi({ file, pageRange }) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('pageRange', pageRange || 'all');

  const res = await fetch(`${API_BASE}/files/pdfs/split`, {
    method: 'POST',
    body: formData,
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || `PDF split failed with status ${res.status}`);
  }
  return json.data;
}

export async function convertDocxToPdfApi(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/files/documents/docx-to-pdf`, {
    method: 'POST',
    body: formData,
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || `DOCX conversion failed with status ${res.status}`);
  }
  return json.data;
}

export async function fetchHistoryApi() {
  const res = await fetch(`${API_BASE}/history`, {
    headers: { 'Accept': 'application/json' },
  });
  const json = await res.json();
  return json.data || [];
}

export async function askAdvisorApi(query) {
  const res = await fetch(`${API_BASE}/assistant/suggest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  const json = await res.json();
  return json.data;
}

// ─────────────────────────────────────────────────────────────
// Phase 2: Audio / Video / Batch
// ─────────────────────────────────────────────────────────────

export async function convertAudioApi(file, outputFormat) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('outputFormat', outputFormat);

  const res = await fetch(`${API_BASE}/files/audio/convert`, {
    method: 'POST',
    body: formData,
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || `Audio conversion failed (${res.status})`);
  }
  return json.data;
}

export async function convertVideoApi(file, outputFormat, resolution = 'original') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('outputFormat', outputFormat);
  formData.append('resolution', resolution);

  const res = await fetch(`${API_BASE}/files/video/convert`, {
    method: 'POST',
    body: formData,
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || `Video conversion failed (${res.status})`);
  }
  return json.data;
}

export async function extractAudioApi(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/files/video/extract-audio`, {
    method: 'POST',
    body: formData,
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || `Audio extraction failed (${res.status})`);
  }
  return json.data;
}

/**
 * Returns the GET URL for batch ZIP download.
 * @param {string[]} jobIds
 */
export function getBatchDownloadUrl(jobIds) {
  return `${API_BASE}/batch/download?jobIds=${encodeURIComponent(jobIds.join(','))}`;
}
