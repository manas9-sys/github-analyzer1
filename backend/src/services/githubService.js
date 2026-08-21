import axios from 'axios';

const GITHUB_API_BASE = 'https://api.github.com';

function getHeaders() {
  const headers = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'GitHub-Profile-Analyzer-App/1.0'
  };

  const token = process.env.GITHUB_TOKEN;
  if (token && token.trim()) {
    headers.Authorization = `Bearer ${token.trim()}`;
  }

  return headers;
}

/**
 * Fetches user profile from GitHub
 */
export async function fetchUserProfile(username) {
  try {
    const response = await axios.get(`${GITHUB_API_BASE}/users/${username}`, {
      headers: getHeaders(),
      timeout: 10000
    });

    const data = response.data;
    return {
      avatarUrl: data.avatar_url,
      name: data.name || data.login,
      username: data.login,
      bio: data.bio || '',
      location: data.location || '',
      company: data.company || '',
      blog: data.blog || '',
      twitterUsername: data.twitter_username || '',
      followers: data.followers || 0,
      following: data.following || 0,
      publicRepos: data.public_repos || 0,
      publicGists: data.public_gists || 0,
      profileUrl: data.html_url,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    handleGitHubError(error, `fetching profile for ${username}`);
  }
}

/**
 * Fetches public repositories for a user with pagination up to 100
 */
export async function fetchUserRepositories(username) {
  try {
    const response = await axios.get(`${GITHUB_API_BASE}/users/${username}/repos`, {
      headers: getHeaders(),
      params: {
        per_page: 100,
        sort: 'updated',
        direction: 'desc'
      },
      timeout: 15000
    });

    const repos = response.data.map(repo => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description || '',
      url: repo.html_url,
      homepage: repo.homepage || '',
      language: repo.language || 'Other',
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      watchers: repo.watchers_count || 0,
      openIssues: repo.open_issues_count || 0,
      topics: Array.isArray(repo.topics) ? repo.topics : [],
      isFork: Boolean(repo.fork),
      isArchived: Boolean(repo.archived),
      isTemplate: Boolean(repo.is_template),
      defaultBranch: repo.default_branch || 'main',
      license: repo.license ? repo.license.spdx_id || repo.license.name : null,
      hasReadme: true, // Will verify if possible
      hasWiki: Boolean(repo.has_wiki),
      hasPages: Boolean(repo.has_pages),
      size: repo.size || 0, // KB
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
      pushedAt: repo.pushed_at
    }));

    return repos;
  } catch (error) {
    handleGitHubError(error, `fetching repositories for ${username}`);
  }
}

/**
 * Fetches repository root contents or specific config files to detect dependencies
 */
export async function fetchRepoConfigManifests(username, repoName) {
  try {
    const response = await axios.get(`${GITHUB_API_BASE}/repos/${username}/${repoName}/contents`, {
      headers: getHeaders(),
      timeout: 8000
    });

    if (!Array.isArray(response.data)) return [];

    const fileNames = response.data.map(f => f.name.toLowerCase());
    const matchedFiles = [];

    const targetManifests = [
      'package.json',
      'requirements.txt',
      'pipfile',
      'pyproject.toml',
      'go.mod',
      'cargo.toml',
      'pom.xml',
      'build.gradle',
      'dockerfile',
      'docker-compose.yml',
      'docker-compose.yaml',
      'tsconfig.json',
      'vite.config.js',
      'vite.config.ts',
      'next.config.js',
      'next.config.mjs',
      'nuxt.config.js',
      'nuxt.config.ts',
      'tailwind.config.js',
      'tailwind.config.ts',
      'webpack.config.js'
    ];

    for (const item of response.data) {
      const lower = item.name.toLowerCase();
      if (targetManifests.includes(lower)) {
        matchedFiles.push({
          name: item.name,
          path: item.path,
          downloadUrl: item.download_url
        });
      }
    }

    return matchedFiles;
  } catch (error) {
    // If 404 or contents cannot be read, return empty list gracefully
    return [];
  }
}

/**
 * Fetches and parses file content (e.g. package.json or requirements.txt)
 */
export async function fetchFileContent(downloadUrl) {
  if (!downloadUrl) return null;
  try {
    const response = await axios.get(downloadUrl, {
      timeout: 6000,
      transformResponse: [data => data] // Keep raw text
    });
    return response.data;
  } catch (error) {
    return null;
  }
}

/**
 * Fetches README preview for a repository
 */
export async function fetchRepoReadme(username, repoName) {
  try {
    const response = await axios.get(`${GITHUB_API_BASE}/repos/${username}/${repoName}/readme`, {
      headers: {
        ...getHeaders(),
        Accept: 'application/vnd.github.raw+json'
      },
      timeout: 6000
    });
    return typeof response.data === 'string' ? response.data.slice(0, 3000) : '';
  } catch {
    return '';
  }
}

function handleGitHubError(error, context) {
  if (error.response) {
    const status = error.response.status;
    const rateLimitRemaining = error.response.headers['x-ratelimit-remaining'];
    const rateLimitReset = error.response.headers['x-ratelimit-reset'];

    if (status === 404) {
      const customErr = new Error(`GitHub user not found.`);
      customErr.status = 404;
      customErr.code = 'USER_NOT_FOUND';
      throw customErr;
    }

    if (status === 403 && rateLimitRemaining === '0') {
      const resetDate = rateLimitReset ? new Date(rateLimitReset * 1000).toLocaleTimeString() : 'later';
      const customErr = new Error(`GitHub API rate limit exceeded. Resets at ${resetDate}. Add a GITHUB_TOKEN to backend/.env to increase rate limit.`);
      customErr.status = 429;
      customErr.code = 'RATE_LIMIT_EXCEEDED';
      throw customErr;
    }

    const message = error.response.data?.message || error.message;
    const customErr = new Error(`GitHub API error (${status}) while ${context}: ${message}`);
    customErr.status = status;
    throw customErr;
  }

  const customErr = new Error(`Network error while ${context}: ${error.message}`);
  customErr.status = 500;
  throw customErr;
}
