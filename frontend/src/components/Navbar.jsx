import React, { useState } from 'react';
import { Github, Search, Sparkles, RefreshCw, Share2, Code2, ArrowLeft } from 'lucide-react';

export function Navbar({ onSearch, currentUsername, onRefresh, onShare, onHome, isSearching }) {
  const [navInput, setNavInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (navInput.trim()) {
      onSearch(navInput.trim());
      setNavInput('');
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-github-border bg-github-darkest/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          {currentUsername ? (
            <button
              onClick={onHome}
              className="flex items-center gap-2 text-github-textMuted hover:text-white transition-colors text-sm font-medium py-1 px-2.5 rounded-md hover:bg-github-dark"
              title="Back to search"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : null}

          <button
            onClick={onHome}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-github-accent to-github-purple flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Code2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-white tracking-tight leading-none group-hover:text-github-accent transition-colors">
                GitProfile<span className="text-github-accent">.ai</span>
              </span>
              <span className="text-[10px] font-mono text-github-textMuted leading-none mt-1">
                Analyzer & Score
              </span>
            </div>
          </button>
        </div>

        {/* Quick Search Bar (when user has active profile or on desktop) */}
        {currentUsername ? (
          <form onSubmit={handleSubmit} className="hidden sm:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-github-textMuted" />
              <input
                type="text"
                placeholder="Analyze another user (e.g. gaearon)..."
                value={navInput}
                onChange={(e) => setNavInput(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-github-dark border border-github-border rounded-lg text-sm text-github-textPrimary placeholder-github-textMuted focus:outline-none focus:border-github-accent focus:ring-1 focus:ring-github-accent transition-all font-mono"
              />
            </div>
          </form>
        ) : null}

        {/* Actions */}
        <div className="flex items-center gap-2">
          {currentUsername ? (
            <>
              <button
                onClick={onRefresh}
                disabled={isSearching}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-github-textPrimary bg-github-dark hover:bg-github-card border border-github-border rounded-lg transition-colors disabled:opacity-50"
                title="Bypass cache & refresh data"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSearching ? 'animate-spin text-github-accent' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              <button
                onClick={onShare}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-github-accent hover:bg-github-accentHover rounded-lg transition-colors shadow-sm"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            </>
          ) : (
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-github-textMuted hover:text-white bg-github-dark hover:bg-github-card border border-github-border rounded-lg transition-colors"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
