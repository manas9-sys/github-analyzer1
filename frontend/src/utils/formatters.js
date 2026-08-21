/**
 * Formatting helpers for numbers, dates, and scores
 */

export function formatCompactNumber(num) {
  if (num === null || num === undefined) return '0';
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return num.toLocaleString();
}

export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function formatRelativeTime(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 1) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 30) return `${diffDays}d ago`;
  const diffMonths = Math.floor(diffDays / 30.5);
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  const diffYears = Math.floor(diffDays / 365);
  return `${diffYears}y ago`;
}

export function getScoreColor(score) {
  if (score >= 85) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
  if (score >= 70) return 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
  if (score >= 50) return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
  return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
}

export function getScoreRingColor(score) {
  if (score >= 85) return '#34d399'; // emerald-400
  if (score >= 70) return '#22d3ee'; // cyan-400
  if (score >= 50) return '#60a5fa'; // blue-400
  return '#fbbf24'; // amber-400
}
