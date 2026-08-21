import React from 'react';
import {
  Github,
  MapPin,
  Building,
  Link as LinkIcon,
  Twitter,
  Calendar,
  Users,
  ExternalLink,
  Clock,
  Sparkles,
  Share2
} from 'lucide-react';
import { formatDate, formatCompactNumber } from '../utils/formatters.js';

export function DashboardHeader({ userProfile, analyzedAt, fromCache, onShare }) {
  return (
    <div className="bg-github-dark border border-github-border rounded-2xl p-6 sm:p-8 shadow-card">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        {/* Left: Avatar & Profile Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center md:items-start gap-5">
          <div className="relative">
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.name || userProfile.username}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-github-borderLight object-cover bg-github-darkest shadow-md"
            />
            <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-lg bg-github-dark border border-github-border flex items-center justify-center text-white shadow">
              <Github className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {userProfile.name || userProfile.username}
              </h1>
              <span className="text-sm font-mono text-github-textMuted">
                @{userProfile.username}
              </span>

              {fromCache && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-github-darkest border border-github-border text-github-textMuted" title="Serving cached snapshot">
                  <Clock className="w-3 h-3" />
                  Cached
                </span>
              )}
            </div>

            {userProfile.bio ? (
              <p className="text-sm text-github-textPrimary/90 max-w-2xl leading-relaxed">
                {userProfile.bio}
              </p>
            ) : (
              <p className="text-xs italic text-github-textMuted">
                No bio provided on GitHub.
              </p>
            )}

            {/* Metadata Tags */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-github-textMuted pt-1">
              {userProfile.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-github-textMuted" />
                  <span>{userProfile.location}</span>
                </div>
              )}

              {userProfile.company && (
                <div className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-github-textMuted" />
                  <span>{userProfile.company}</span>
                </div>
              )}

              {userProfile.blog && (
                <a
                  href={userProfile.blog.startsWith('http') ? userProfile.blog : `https://${userProfile.blog}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-github-accent hover:underline"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span className="max-w-[180px] truncate">{userProfile.blog.replace(/^https?:\/\//, '')}</span>
                </a>
              )}

              {userProfile.twitterUsername && (
                <a
                  href={`https://twitter.com/${userProfile.twitterUsername}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-github-accent hover:underline"
                >
                  <Twitter className="w-3.5 h-3.5" />
                  <span>@{userProfile.twitterUsername}</span>
                </a>
              )}

              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-github-textMuted" />
                <span>Joined {formatDate(userProfile.createdAt)}</span>
              </div>

              <div className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-github-textMuted" />
                <span>
                  <strong className="text-white font-mono">{formatCompactNumber(userProfile.followers)}</strong> followers · <strong className="text-white font-mono">{formatCompactNumber(userProfile.following)}</strong> following
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={onShare}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-github-dark hover:bg-github-card border border-github-border rounded-xl transition-all shadow-sm"
          >
            <Share2 className="w-4 h-4 text-github-accent" />
            <span>Export & Share</span>
          </button>

          <a
            href={userProfile.profileUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-github-textPrimary hover:text-white bg-github-dark hover:bg-github-card border border-github-border rounded-xl transition-all shadow-sm"
          >
            <span>GitHub Profile</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
