import React from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft, Key, HelpCircle } from 'lucide-react';

export function ErrorState({ error, onRetry, onHome, username }) {
  const isRateLimit = error?.status === 429 || error?.code === 'RATE_LIMIT_EXCEEDED';
  const isNotFound = error?.code === 'USER_NOT_FOUND' || (error?.status === 404 && error?.message?.toLowerCase().includes('user not found'));
  const isRouteNotFound = error?.status === 404 && !isNotFound;

  return (
    <div className="max-w-xl mx-auto my-16 px-4">
      <div className="bg-github-dark border border-github-border rounded-2xl p-6 sm:p-8 shadow-card text-center">
        <div className="w-12 h-12 rounded-full bg-github-red/10 border border-github-red/20 flex items-center justify-center text-github-red mx-auto mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-white mb-2">
          {isNotFound
            ? `User "${username}" Not Found`
            : isRouteNotFound
            ? 'API Route Not Found'
            : isRateLimit
            ? 'GitHub API Rate Limit Reached'
            : 'Analysis Failed'}
        </h3>

        <p className="text-sm text-github-textMuted max-w-md mx-auto leading-relaxed mb-6 font-mono">
          {error?.message || 'Unable to complete GitHub profile analysis at this time.'}
        </p>

        {isRateLimit && (
          <div className="bg-github-darkest border border-github-border rounded-xl p-4 text-left text-xs text-github-textMuted mb-6 space-y-2">
            <div className="flex items-center gap-2 text-github-accent font-semibold">
              <Key className="w-4 h-4" />
              <span>How to avoid rate limits</span>
            </div>
            <p>
              GitHub limits unauthenticated public IP requests to 60/hr. To increase your limit to 5,000 requests/hr:
            </p>
            <ol className="list-decimal pl-4 space-y-1 font-mono text-[11px] text-github-textPrimary">
              <li>Create a fine-grained or classic token on GitHub (Settings → Developer Settings → Personal Access Tokens)</li>
              <li>Add <code className="bg-github-card px-1 py-0.5 rounded text-github-accent">GITHUB_TOKEN=your_token</code> to <code className="bg-github-card px-1 py-0.5 rounded text-github-accent">backend/.env</code></li>
              <li>Restart the backend server.</li>
            </ol>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2.5 bg-github-accent hover:bg-github-accentHover text-github-darkest font-semibold rounded-lg text-xs transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <button
            onClick={onHome}
            className="flex items-center gap-2 px-4 py-2.5 bg-github-dark hover:bg-github-card border border-github-border text-github-textPrimary font-medium rounded-lg text-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Search</span>
          </button>
        </div>
      </div>
    </div>
  );
}
