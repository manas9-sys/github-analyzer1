import React from 'react';
import { Github, Code2, ShieldAlert, Cpu, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-github-border/80 bg-github-darkest text-xs text-github-textMuted py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Branding */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-github-dark border border-github-border flex items-center justify-center text-github-accent">
            <Code2 className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-white font-mono text-xs">
            GitHub Profile Analyzer
          </span>
          <span>—</span>
          <span>Public telemetry & AI developer profiling</span>
        </div>

        {/* Right: Disclaimer */}
        <div className="flex items-center gap-4 text-[11px] font-mono">
          <span className="flex items-center gap-1 text-github-textMuted">
            <ShieldAlert className="w-3 h-3 text-github-orange" />
            AI evaluations are qualitative estimates, not human certifications.
          </span>
        </div>
      </div>
    </footer>
  );
}
