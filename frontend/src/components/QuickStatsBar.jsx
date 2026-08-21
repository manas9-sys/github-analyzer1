import React from 'react';
import { GitFork, Star, FolderGit2, Code, Flame, Award, Scale } from 'lucide-react';
import { formatCompactNumber } from '../utils/formatters.js';

export function QuickStatsBar({ overview, languageDistribution }) {
  const stats = [
    {
      label: 'Repositories',
      value: formatCompactNumber(overview.totalRepos),
      subtext: `${overview.originalReposCount} original · ${overview.forkedReposCount} forks`,
      icon: FolderGit2,
      color: 'text-github-accent',
      bgColor: 'bg-blue-500/10 border-blue-500/20'
    },
    {
      label: 'Stars Earned',
      value: formatCompactNumber(overview.totalStars),
      subtext: 'across original repos',
      icon: Star,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10 border-yellow-500/20'
    },
    {
      label: 'Forks Count',
      value: formatCompactNumber(overview.totalForks),
      subtext: 'community forks',
      icon: GitFork,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10 border-purple-500/20'
    },
    {
      label: 'Languages',
      value: languageDistribution.length.toString(),
      subtext: `Top: ${overview.topLanguage}`,
      icon: Code,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20'
    },
    {
      label: 'Active Projects',
      value: overview.activeReposCount.toString(),
      subtext: 'updated in last 12 mo',
      icon: Flame,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10 border-orange-500/20'
    },
    {
      label: 'License Coverage',
      value: `${overview.licensePercentage}%`,
      subtext: `${overview.descriptionPercentage}% have docs`,
      icon: Scale,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10 border-cyan-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="bg-github-dark border border-github-border rounded-xl p-4 flex flex-col justify-between hover:border-github-borderLight transition-all group shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-github-textMuted truncate">
                {stat.label}
              </span>
              <div className={`w-7 h-7 rounded-lg ${stat.bgColor} border flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3">
              <div className="text-xl sm:text-2xl font-bold text-white font-mono tracking-tight">
                {stat.value}
              </div>
              <p className="text-[11px] text-github-textMuted truncate mt-0.5 font-mono">
                {stat.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
