import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  Star,
  GitFork,
  Scale,
  Calendar,
  ExternalLink,
  Code2,
  FolderGit2,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { getLanguageColor } from '../utils/languageColors.js';
import { formatCompactNumber, formatRelativeTime, getScoreColor } from '../utils/formatters.js';

export function RepoExplorer({ repos, onSelectRepo }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('quality'); // 'quality' | 'stars' | 'updated'
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'original' | 'forks'

  // Extract unique languages
  const languages = useMemo(() => {
    const set = new Set();
    repos.forEach(r => {
      if (r.language && r.language !== 'Other') set.add(r.language);
    });
    return ['All', ...Array.from(set).sort()];
  }, [repos]);

  // Filter & Sort
  const filteredRepos = useMemo(() => {
    return repos
      .filter(repo => {
        // Query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = repo.name.toLowerCase().includes(q);
          const matchesDesc = (repo.description || '').toLowerCase().includes(q);
          const matchesTopic = (repo.topics || []).some(t => t.toLowerCase().includes(q));
          if (!matchesName && !matchesDesc && !matchesTopic) return false;
        }

        // Language filter
        if (selectedLanguage !== 'All' && repo.language !== selectedLanguage) {
          return false;
        }

        // Type filter
        if (filterType === 'original' && repo.isFork) return false;
        if (filterType === 'forks' && !repo.isFork) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'stars') {
          return (b.stars || 0) - (a.stars || 0);
        }
        if (sortBy === 'updated') {
          return new Date(b.pushedAt || b.updatedAt) - new Date(a.pushedAt || a.updatedAt);
        }
        // default 'quality'
        return (b.qualityScore || 0) - (a.qualityScore || 0);
      });
  }, [repos, searchQuery, sortBy, selectedLanguage, filterType]);

  return (
    <div className="bg-github-dark border border-github-border rounded-2xl p-6 shadow-card space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-github-border/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-github-accent">
            <FolderGit2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Repository Explorer</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-github-darkest border border-github-border text-github-textMuted font-semibold">
                {filteredRepos.length} / {repos.length} Repositories
              </span>
            </h2>
          </div>
        </div>

        {/* Sort & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Sorting Buttons */}
          <div className="flex rounded-lg bg-github-darkest p-0.5 border border-github-border">
            <button
              onClick={() => setSortBy('quality')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                sortBy === 'quality'
                  ? 'bg-github-accent text-github-darkest font-semibold'
                  : 'text-github-textMuted hover:text-white'
              }`}
            >
              Quality Score
            </button>
            <button
              onClick={() => setSortBy('stars')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                sortBy === 'stars'
                  ? 'bg-github-accent text-github-darkest font-semibold'
                  : 'text-github-textMuted hover:text-white'
              }`}
            >
              Stars
            </button>
            <button
              onClick={() => setSortBy('updated')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                sortBy === 'updated'
                  ? 'bg-github-accent text-github-darkest font-semibold'
                  : 'text-github-textMuted hover:text-white'
              }`}
            >
              Recently Updated
            </button>
          </div>

          {/* Language Dropdown */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-2.5 py-1.5 bg-github-darkest border border-github-border rounded-lg text-xs text-github-textPrimary font-mono focus:outline-none focus:border-github-accent"
          >
            {languages.map((l) => (
              <option key={l} value={l}>
                {l === 'All' ? 'All Languages' : l}
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-2.5 py-1.5 bg-github-darkest border border-github-border rounded-lg text-xs text-github-textPrimary font-mono focus:outline-none focus:border-github-accent"
          >
            <option value="all">All Sources</option>
            <option value="original">Original Only</option>
            <option value="forks">Forks Only</option>
          </select>
        </div>
      </div>

      {/* Search Input Filter */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-github-textMuted" />
        <input
          type="text"
          placeholder="Filter repositories by name, topic or description keywords..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-github-darkest border border-github-border rounded-xl text-xs text-github-textPrimary placeholder-github-textMuted focus:outline-none focus:border-github-accent font-mono"
        />
      </div>

      {/* Repos Grid */}
      {filteredRepos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRepos.map((repo) => {
            const langColor = getLanguageColor(repo.language);
            return (
              <div
                key={repo.id}
                onClick={() => onSelectRepo(repo)}
                className="flex flex-col justify-between p-4 rounded-xl bg-github-darkest/80 border border-github-border hover:border-github-accent/50 hover:bg-github-card/90 transition-all cursor-pointer group shadow-sm"
              >
                <div>
                  {/* Top line: Name & Quality Score */}
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <FolderGit2 className="w-4 h-4 text-github-textMuted group-hover:text-github-accent transition-colors flex-shrink-0" />
                      <span className="text-sm font-bold text-white group-hover:text-github-accent transition-colors truncate font-mono">
                        {repo.name}
                      </span>
                      {repo.isFork && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-github-dark border border-github-border text-github-textMuted flex-shrink-0">
                          fork
                        </span>
                      )}
                    </div>

                    {/* Quality Badge */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${getScoreColor(repo.qualityScore)}`}>
                        {repo.qualityScore}/100 Q
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-github-textMuted line-clamp-2 leading-relaxed mb-3">
                    {repo.description || 'No description provided.'}
                  </p>

                  {/* Topics Pills */}
                  {repo.topics && repo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {repo.topics.slice(0, 4).map((topic, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 text-[9px] font-mono rounded bg-blue-500/10 border border-blue-500/20 text-github-accent"
                        >
                          #{topic}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Metadata */}
                <div className="pt-3 border-t border-github-border/60 flex items-center justify-between text-[11px] font-mono text-github-textMuted">
                  <div className="flex items-center gap-3">
                    {/* Language */}
                    {repo.language && (
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: langColor }}
                        />
                        <span className="text-github-textPrimary">{repo.language}</span>
                      </div>
                    )}

                    {/* Stars */}
                    <div className="flex items-center gap-1 hover:text-yellow-400 transition-colors">
                      <Star className="w-3.5 h-3.5" />
                      <span>{formatCompactNumber(repo.stars)}</span>
                    </div>

                    {/* Forks */}
                    {repo.forks > 0 && (
                      <div className="flex items-center gap-1">
                        <GitFork className="w-3.5 h-3.5" />
                        <span>{formatCompactNumber(repo.forks)}</span>
                      </div>
                    )}
                  </div>

                  {/* Updated Time */}
                  <div className="flex items-center gap-1 text-[10px]">
                    <Calendar className="w-3 h-3" />
                    <span>{formatRelativeTime(repo.pushedAt || repo.updatedAt)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-12 text-center text-xs text-github-textMuted font-mono">
          No repositories match the specified filters.
        </div>
      )}
    </div>
  );
}
