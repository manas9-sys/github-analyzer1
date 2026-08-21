import React, { useState } from 'react';
import { Cpu, Layers, CheckCircle2, FileCode, Tag } from 'lucide-react';

export function TechStackSection({ techStack }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [hoveredTech, setHoveredTech] = useState(null);

  const categories = Object.entries(techStack.categories).filter(([_, list]) => list.length > 0);
  const categoryNames = ['All', ...categories.map(([name]) => name)];

  const displayedTechs = activeCategory === 'All'
    ? techStack.all
    : (techStack.categories[activeCategory] || []);

  return (
    <div className="bg-github-dark border border-github-border rounded-2xl p-6 shadow-card space-y-5">
      {/* Header & Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-github-border/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-github-accent">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Detected Tech Stack</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-github-darkest border border-github-border text-github-accent font-semibold">
                {techStack.all.length} Verified
              </span>
            </h2>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1.5">
          {categoryNames.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                activeCategory === cat
                  ? 'bg-github-accent text-github-darkest font-semibold shadow-sm'
                  : 'bg-github-darkest hover:bg-github-card text-github-textMuted hover:text-white border border-github-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tech Pills Grid */}
      {displayedTechs.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {displayedTechs.map((tech) => (
            <div
              key={tech.name}
              onMouseEnter={() => setHoveredTech(tech)}
              onMouseLeave={() => setHoveredTech(null)}
              className="relative p-3 rounded-xl bg-github-darkest/90 border border-github-border hover:border-github-accent/50 hover:bg-github-card transition-all cursor-default group"
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-xs font-semibold text-white group-hover:text-github-accent transition-colors truncate">
                  {tech.name}
                </span>
                <span className="text-[10px] font-mono text-github-textMuted px-1.5 py-0.2 rounded bg-github-dark border border-github-border">
                  {tech.repoCount} {tech.repoCount === 1 ? 'repo' : 'repos'}
                </span>
              </div>

              <div className="flex items-center gap-1 text-[10px] text-github-textMuted truncate">
                <Tag className="w-2.5 h-2.5 text-github-textMuted flex-shrink-0" />
                <span className="truncate">{tech.category}</span>
              </div>

              {/* Hover Tooltip showing Evidence */}
              {hoveredTech?.name === tech.name && tech.evidence && tech.evidence.length > 0 && (
                <div className="absolute z-30 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-github-card border border-github-borderLight rounded-xl shadow-2xl text-left pointer-events-none">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-white mb-1.5 pb-1 border-b border-github-border">
                    <CheckCircle2 className="w-3.5 h-3.5 text-github-greenText" />
                    <span>Evidence for {tech.name}</span>
                  </div>
                  <ul className="space-y-1 text-[10px] font-mono text-github-textMuted">
                    {tech.evidence.map((ev, i) => (
                      <li key={i} className="truncate">
                        • {ev}
                      </li>
                    ))}
                  </ul>
                  {tech.repos.length > 0 && (
                    <p className="mt-1.5 text-[9px] text-github-textMuted italic border-t border-github-border/60 pt-1">
                      Found in: {tech.repos.join(', ')}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-xs text-github-textMuted italic font-mono">
          No technologies detected in the selected category.
        </div>
      )}

      <div className="text-[11px] text-github-textMuted font-mono pt-2 border-t border-github-border/60 flex items-center gap-2">
        <FileCode className="w-3.5 h-3.5 text-github-accent" />
        <span>Extracted from manifest dependencies (`package.json`, `requirements.txt`, etc.), topics and codebase markers.</span>
      </div>
    </div>
  );
}
