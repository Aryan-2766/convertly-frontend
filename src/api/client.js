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
