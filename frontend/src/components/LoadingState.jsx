import React from 'react';
import { Loader2, CheckCircle2, CircleDot, Cpu, Sparkles } from 'lucide-react';
import { ANALYSIS_STEPS } from '../hooks/useAnalyzer.js';

export function LoadingState({ currentStepIndex, targetUsername }) {
  return (
    <div className="max-w-xl mx-auto my-16 px-4">
      <div className="bg-github-dark border border-github-border rounded-2xl p-6 sm:p-8 shadow-card glow-border relative overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center gap-3.5 pb-6 border-b border-github-border">
          <div className="w-10 h-10 rounded-xl bg-github-accent/10 border border-github-accent/20 flex items-center justify-center text-github-accent">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">
              Analyzing @{targetUsername || 'user'}
            </h3>
            <p className="text-xs text-github-textMuted font-mono">
              Running deep repository & AI telemetry...
            </p>
          </div>
        </div>

        {/* Stepper list */}
        <div className="mt-6 space-y-4">
          {ANALYSIS_STEPS.map((step, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const isPending = idx > currentStepIndex;

            return (
              <div
                key={step.id}
                className={`flex items-center gap-3.5 transition-all duration-300 ${
                  isCurrent ? 'scale-[1.01]' : isPending ? 'opacity-40' : 'opacity-85'
                }`}
              >
                {/* Step Status Icon */}
                <div className="flex-shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-github-greenText transition-all" />
                  ) : isCurrent ? (
                    <Loader2 className="w-5 h-5 text-github-accent animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-github-borderLight flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-github-textMuted/40" />
                    </div>
                  )}
                </div>

                {/* Step Label */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium transition-colors ${
                      isCurrent
                        ? 'text-github-accent font-semibold'
                        : isDone
                        ? 'text-github-textPrimary'
                        : 'text-github-textMuted'
                    }`}
                  >
                    {step.label}
                  </p>
                </div>

                {/* Status indicator */}
                <div className="text-right">
                  {isDone && (
                    <span className="text-[11px] font-mono text-github-greenText">
                      Done
                    </span>
                  )}
                  {isCurrent && (
                    <span className="text-[11px] font-mono text-github-accent animate-pulse">
                      Processing...
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress bar at bottom */}
        <div className="mt-8 pt-4 border-t border-github-border/60">
          <div className="w-full bg-github-darkest h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-github-accent to-github-purple h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.round(((currentStepIndex + 1) / ANALYSIS_STEPS.length) * 100)}%`
              }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-github-textMuted font-mono mt-2">
            <span>Step {currentStepIndex + 1} of {ANALYSIS_STEPS.length}</span>
            <span>{Math.round(((currentStepIndex + 1) / ANALYSIS_STEPS.length) * 100)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
