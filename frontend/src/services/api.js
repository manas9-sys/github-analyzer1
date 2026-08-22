/**
 * Backend API Client
 */

const API_BASE = 'https://github-analyzer1-b1cm.onrender.com';

export async function fetchAnalysis(username, forceRefresh = false) {
  const query = forceRefresh ? '?refresh=true' : '';
  const response = await fetch(`${API_BASE}/analyze/${encodeURIComponent(username)}${query}`, {
    headers: {
      'Accept': 'application/json'
    }
  });

  const json = await response.json();
  if (!response.ok || !json.success) {
    const rawError = json.error;
    const errorMsg =
      typeof rawError === 'string'
        ? rawError
        : rawError?.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
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
    const rawError = json.error;
    const errorMsg =
      typeof rawError === 'string'
        ? rawError
        : rawError?.message || 'Failed to fetch repository details';
    throw new Error(errorMsg);
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
