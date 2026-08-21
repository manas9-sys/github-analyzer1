/**
 * Backend API Client
 */

const API_BASE = '/api';

export async function fetchAnalysis(username, forceRefresh = false) {
  const query = forceRefresh ? '?refresh=true' : '';
  const response = await fetch(`${API_BASE}/analyze/${encodeURIComponent(username)}${query}`, {
    headers: {
      'Accept': 'application/json'
    }
  });

  const json = await response.json();
  if (!response.ok || !json.success) {
    const error = new Error(json.error || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.code = json.code;
    throw error;
  }

  return json;
}

export async function fetchRepoDetails(username, repo) {
  const response = await fetch(`${API_BASE}/repos/${encodeURIComponent(username)}/${encodeURIComponent(repo)}`);
  const json = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(json.error || 'Failed to fetch repository details');
  }
  return json.data;
}

export async function checkServerHealth() {
  try {
    const response = await fetch(`${API_BASE}/health`);
    return await response.json();
  } catch {
    return { status: 'offline' };
  }
}
