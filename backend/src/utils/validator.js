/**
 * Validates a GitHub username based on GitHub's username constraints:
 * - 1 to 39 characters
 * - May only contain alphanumeric characters or single hyphens
 * - Cannot begin or end with a hyphen
 */
export function isValidGitHubUsername(username) {
  if (!username || typeof username !== 'string') {
    return false;
  }
  const trimmed = username.trim();
  if (trimmed.length < 1 || trimmed.length > 39) {
    return false;
  }
  const regex = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;
  return regex.test(trimmed);
}

export function sanitizeUsername(username) {
  return typeof username === 'string' ? username.trim().toLowerCase() : '';
}
