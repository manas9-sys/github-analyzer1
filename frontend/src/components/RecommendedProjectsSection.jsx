import React from 'react';
import { Rocket, Target, Zap, ArrowUpRight, Award } from 'lucide-react';

export function RecommendedProjectsSection({ recommendedProjects }) {
  if (!recommendedProjects || recommendedProjects.length === 0) return null;

  return (
    <div className="bg-github-dark border border-github-border rounded-2xl p-6 shadow-card space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-github-border/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-github-accent/10 border border-github-accent/20 flex items-center justify-center text-github-accent">
            <Rocket className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Tailored Project Recommendations</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-github-darkest border border-github-border text-github-accent font-semibold">
                3 Suggested Roadmap Milestones
              </span>
            </h2>
          </div>
        </div>
      </div>

      {/* 3 Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {recommendedProjects.map((project, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between p-5 rounded-xl bg-github-darkest/90 border border-github-border hover:border-github-accent/50 hover:bg-github-card transition-all group"
          >
            <div>
              {/* Badge & Number */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-github-dark border border-github-border text-github-textMuted uppercase">
                  Project #{idx + 1}
                </span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded border border-github-purple/30 bg-github-purple/10 text-github-purpleLight">
                  {project.difficulty}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-sm font-bold text-white group-hover:text-github-accent transition-colors mb-2 leading-snug">
                {project.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-github-textMuted leading-relaxed mb-4">
                {project.description}
              </p>
            </div>

            <div className="space-y-3 pt-3 border-t border-github-border/60">
              {/* Target Tech Stack */}
              <div>
                <span className="text-[10px] font-mono text-github-textMuted uppercase block mb-1.5">
                  Target Tech Stack
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {project.targetTech.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 text-[10px] font-mono font-medium rounded-md bg-github-dark border border-github-border text-github-textPrimary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Skill Gain */}
              <div className="p-2.5 rounded-lg bg-github-dark/80 border border-github-border/70 flex items-start gap-2">
                <Target className="w-3.5 h-3.5 text-github-greenText flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-github-textPrimary/90 leading-tight">
                  <strong className="text-github-greenText">Skill Gain:</strong> {project.skillGain}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
