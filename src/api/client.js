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

