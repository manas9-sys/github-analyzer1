import React, { useState } from 'react';
import { Award, Info, CheckCircle2, ChevronRight, HelpCircle, X } from 'lucide-react';
import { getScoreColor, getScoreRingColor } from '../utils/formatters.js';

export function DeveloperScoreCard({ scoreData }) {
  const [showRubric, setShowRubric] = useState(false);
  const { totalScore, tier, tierColor, breakdown } = scoreData;

  const ringRadius = 42;
  const circumference = 2 * Math.PI * ringRadius;
  const strokeDashoffset = circumference - (totalScore / 100) * circumference;
  const strokeColor = getScoreRingColor(totalScore);

  return (
    <div className="bg-github-dark border border-github-border rounded-2xl p-6 shadow-card flex flex-col justify-between h-full relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-github-border/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-github-accent/10 border border-github-accent/20 flex items-center justify-center text-github-accent">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Developer Score</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-github-darkest border border-github-border text-github-textMuted font-normal">
                Factual Rubric
              </span>
            </h2>
          </div>
        </div>

        <button
          onClick={() => setShowRubric(true)}
          className="text-xs font-mono text-github-textMuted hover:text-github-accent flex items-center gap-1 transition-colors"
          title="View transparent scoring formula"
        >
          <Info className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Rubric</span>
        </button>
      </div>

      {/* Main Score Area */}
      <div className="my-5 flex flex-col sm:flex-row items-center gap-6 justify-between">
        {/* Radial Circle */}
        <div className="relative flex items-center justify-center flex-shrink-0">
          <svg className="w-28 h-28 transform -rotate-90">
            <circle
              cx="56"
              cy="56"
              r={ringRadius}
              stroke="#21262d"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="56"
              cy="56"
              r={ringRadius}
              stroke={strokeColor}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold font-mono text-white tracking-tight leading-none">
              {totalScore}
            </span>
            <span className="text-[10px] font-mono text-github-textMuted uppercase mt-0.5">
              / 100
            </span>
          </div>
        </div>

        {/* Tier badge & description */}
        <div className="flex-1 text-center sm:text-left space-y-1.5">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-xs font-mono text-github-textMuted uppercase tracking-wider">
              Proficiency Tier
            </span>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getScoreColor(totalScore)} font-mono`}>
              {tier}
            </span>
          </div>
          <p className="text-xs text-github-textMuted leading-relaxed">
            Deterministic index evaluated from public commits, repository quality, technology breadth, documentation and engineering rigor.
          </p>
        </div>
      </div>

      {/* 6 Category Breakdown Bars */}
      <div className="space-y-3 pt-2">
        {breakdown.map((item, idx) => {
          const pct = Math.round((item.score / item.maxScore) * 100);
          return (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-github-textPrimary font-medium truncate">
                  {item.category}
                </span>
                <span className="font-mono text-github-textMuted text-[11px]">
                  <strong className="text-white font-semibold">{item.score}</strong> / {item.maxScore} pts
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-github-darkest h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-github-accent to-github-purple"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Transparent Rubric Modal */}
      {showRubric && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-github-dark border border-github-border rounded-2xl p-6 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setShowRubric(false)}
              className="absolute top-4 right-4 text-github-textMuted hover:text-white p-1 rounded-lg hover:bg-github-card"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Award className="w-5 h-5 text-github-accent" />
              Transparent Scoring Rubric
            </h3>
            <p className="text-xs text-github-textMuted mb-4">
              All 100 points are calculated strictly from verifiable GitHub signals without manual bias.
            </p>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {breakdown.map((b, i) => (
                <div key={i} className="p-3 rounded-lg bg-github-darkest border border-github-border text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-white">{b.category}</span>
                    <span className="font-mono text-github-accent font-bold">Max {b.maxScore} pts</span>
                  </div>
                  <p className="text-github-textMuted text-[11px] leading-relaxed">
                    {b.description}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowRubric(false)}
              className="mt-5 w-full py-2 bg-github-accent hover:bg-github-accentHover text-github-darkest font-semibold rounded-lg text-xs transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
