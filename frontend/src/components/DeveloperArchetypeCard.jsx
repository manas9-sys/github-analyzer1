import React from 'react';
import { Sparkles, Terminal, Layers, HelpCircle, Compass, CheckCircle } from 'lucide-react';

export function DeveloperArchetypeCard({ aiAnalysis, username }) {
  const { archetype, estimatedLevel, summary, provider } = aiAnalysis;

  const levelColorMap = {
    Beginner: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
    Junior: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
    Intermediate: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    Advanced: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
  };

  const levelBadgeClass = levelColorMap[estimatedLevel] || 'text-github-accent border-github-accent/30 bg-github-accent/10';

  return (
    <div className="bg-github-dark border border-github-border rounded-2xl p-6 shadow-card flex flex-col justify-between h-full relative overflow-hidden">
      {/* Top Banner */}
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-github-border/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-github-purple/10 border border-github-purple/20 flex items-center justify-center text-github-purpleLight">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Developer Archetype
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-github-darkest border border-github-border text-github-textMuted flex items-center gap-1">
              <span>{provider === 'gemini' ? 'Gemini 1.5' : 'Heuristic Engine'}</span>
            </span>
          </div>
        </div>

        {/* Archetype & Level Badges */}
        <div className="my-5 space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-github-purple/20 to-github-accent/20 border border-github-purple/30 text-white font-bold text-base sm:text-lg">
              <Terminal className="w-4 h-4 text-github-purpleLight" />
              <span>{archetype}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className={`px-2.5 py-1 rounded-lg border text-xs font-semibold font-mono ${levelBadgeClass}`}>
                {estimatedLevel}
              </span>
              <span
                className="text-[10px] font-mono text-github-textMuted underline decoration-dotted cursor-help"
                title="Estimated by AI based on repository depth, tech variety and project complexity. Not an objective human certification."
              >
                (AI-Estimated)
              </span>
            </div>
          </div>

          {/* AI Narrative Summary */}
          <div className="p-4 rounded-xl bg-github-darkest/90 border border-github-border text-xs sm:text-sm text-github-textPrimary/90 leading-relaxed font-sans mt-3">
            <p>{summary}</p>
          </div>
        </div>
      </div>

      {/* Footer hint */}
      <div className="pt-3 border-t border-github-border/60 flex items-center justify-between text-[11px] text-github-textMuted font-mono">
        <span className="flex items-center gap-1">
          <CheckCircle className="w-3.5 h-3.5 text-github-greenText" />
          Evidence-grounded evaluation
        </span>
        <span className="hidden sm:inline">No fabricated claims</span>
      </div>
    </div>
  );
}
