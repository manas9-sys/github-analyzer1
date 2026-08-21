import React, { useState, useEffect } from 'react';
import {
  X,
  ExternalLink,
  Star,
  GitFork,
  Scale,
  Calendar,
  Code2,
  FileCode,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  Loader2
} from 'lucide-react';
import { getLanguageColor } from '../utils/languageColors.js';
import { formatDate, formatCompactNumber, getScoreColor } from '../utils/formatters.js';
import { fetchRepoDetails } from '../services/api.js';

export function RepoDetailModal({ repo, username, onClose }) {
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [details, setDetails] = useState(null);

  useEffect(() => {
    if (repo && username) {
      let isMounted = true;
      setLoadingDetails(true);
      fetchRepoDetails(username, repo.name)
        .then(data => {
          if (isMounted) {
            setDetails(data);
            setLoadingDetails(false);
          }
        })
        .catch(() => {
          if (isMounted) setLoadingDetails(false);
        });

      return () => {
        isMounted = false;
      };
    }
  }, [repo, username]);

  if (!repo) return null;

  const langColor = getLanguageColor(repo.language);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-github-dark border border-github-border rounded-2xl max-w-2xl w-full max-h-[85vh] shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-github-border flex items-start justify-between gap-4 bg-github-darkest/50">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                <span>{repo.name}</span>
                {repo.isFork && (
                  <span className="text-[10px] font-normal px-2 py-0.5 rounded bg-github-dark border border-github-border text-github-textMuted">
                    Forked
                  </span>
                )}
              </h3>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full border ${getScoreColor(repo.qualityScore)}`}>
                Quality: {repo.qualityScore}/100
              </span>
            </div>

            <p className="text-xs text-github-textMuted leading-relaxed">
              {repo.description || 'No description provided.'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-github-textMuted hover:text-white p-1 rounded-lg hover:bg-github-card transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-github-darkest border border-github-border">
              <span className="text-[10px] font-mono text-github-textMuted block mb-1">Language</span>
              <div className="flex items-center gap-1.5 font-bold text-white font-mono">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: langColor }} />
                <span>{repo.language || 'None'}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-github-darkest border border-github-border">
              <span className="text-[10px] font-mono text-github-textMuted block mb-1">Stars & Forks</span>
              <div className="flex items-center gap-3 font-bold text-white font-mono">
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-yellow-400" /> {formatCompactNumber(repo.stars)}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork className="w-3.5 h-3.5 text-purple-400" /> {formatCompactNumber(repo.forks)}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-github-darkest border border-github-border">
              <span className="text-[10px] font-mono text-github-textMuted block mb-1">License</span>
              <div className="flex items-center gap-1 font-bold text-white font-mono truncate">
                <Scale className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                <span className="truncate">{repo.license || 'No License'}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-github-darkest border border-github-border">
              <span className="text-[10px] font-mono text-github-textMuted block mb-1">Last Pushed</span>
              <div className="flex items-center gap-1 font-bold text-white font-mono">
                <Calendar className="w-3.5 h-3.5 text-github-accent flex-shrink-0" />
                <span>{formatDate(repo.pushedAt || repo.updatedAt)}</span>
              </div>
            </div>
          </div>

          {/* Topics */}
          {repo.topics && repo.topics.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-white mb-2 font-mono uppercase tracking-wider text-github-textMuted">
                Repository Topics
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {repo.topics.map((t, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 text-xs font-mono rounded-lg bg-github-darkest border border-github-border text-github-accent"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Detected Config Manifests */}
          {details?.manifests && details.manifests.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-white mb-2 font-mono uppercase tracking-wider text-github-textMuted flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-github-accent" />
                <span>Detected Configuration Manifests</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {details.manifests.map((m, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md bg-github-card border border-github-borderLight text-github-textPrimary font-mono text-[11px] flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3 text-github-greenText" />
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Readme Preview */}
          <div>
            <h4 className="text-xs font-bold text-white mb-2 font-mono uppercase tracking-wider text-github-textMuted flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-github-purpleLight" />
              <span>README Preview</span>
            </h4>
            {loadingDetails ? (
              <div className="p-6 rounded-xl bg-github-darkest border border-github-border flex items-center justify-center gap-2 text-github-textMuted font-mono">
                <Loader2 className="w-4 h-4 animate-spin text-github-accent" />
                <span>Loading README preview...</span>
              </div>
            ) : details?.readme ? (
              <div className="p-4 rounded-xl bg-github-darkest border border-github-border font-mono text-[11px] text-github-textMuted max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                {details.readme}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-github-darkest border border-github-border text-github-textMuted font-mono text-center">
                No README content available for preview.
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-github-border flex items-center justify-between bg-github-darkest/50">
          <span className="text-[11px] font-mono text-github-textMuted">
            Created: {formatDate(repo.createdAt)}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-github-dark hover:bg-github-card border border-github-border text-xs font-medium text-github-textPrimary transition-colors"
            >
              Close
            </button>
            <a
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-github-accent hover:bg-github-accentHover text-github-darkest text-xs font-bold transition-colors"
            >
              <span>Open on GitHub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
