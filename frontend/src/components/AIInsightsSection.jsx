import React from 'react';
import { CheckCircle2, AlertCircle, Sparkles, TrendingUp, Compass } from 'lucide-react';

export function AIInsightsSection({ aiAnalysis }) {
  const { strengths, improvementAreas } = aiAnalysis;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Evidence-Based Strengths */}
      <div className="bg-github-dark border border-github-border rounded-2xl p-6 shadow-card flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-github-border/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-github-greenText">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Evidence-Based Strengths
              </h2>
            </div>
            <span className="text-xs font-mono text-github-greenText px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              {strengths.length} Highlights
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {strengths.map((strength, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-github-darkest/70 border border-github-border/80 hover:border-emerald-500/30 transition-all text-xs sm:text-sm text-github-textPrimary/90 leading-relaxed"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-github-greenText flex-shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold font-mono">{idx + 1}</span>
                </div>
                <p className="flex-1">{strength}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-3 border-t border-github-border/60 text-[11px] font-mono text-github-textMuted">
          Grounded exclusively on public repositories and commit activity.
        </div>
      </div>

      {/* Realistic Improvement Areas */}
      <div className="bg-github-dark border border-github-border rounded-2xl p-6 shadow-card flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-github-border/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <AlertCircle className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Growth & Improvement Areas
              </h2>
            </div>
            <span className="text-xs font-mono text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
              {improvementAreas.length} Opportunities
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {improvementAreas.map((area, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-github-darkest/70 border border-github-border/80 hover:border-amber-500/30 transition-all text-xs sm:text-sm text-github-textPrimary/90 leading-relaxed"
              >
                <div className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 flex-shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold font-mono">{idx + 1}</span>
                </div>
                <p className="flex-1">{area}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-3 border-t border-github-border/60 text-[11px] font-mono text-github-textMuted">
          Actionable recommendations to enhance your portfolio impact.
        </div>
      </div>
    </div>
  );
}
