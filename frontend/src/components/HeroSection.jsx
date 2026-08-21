import React, { useState } from 'react';
import { Search, Sparkles, ArrowRight, ShieldCheck, Cpu, BarChart3, Layers, CheckCircle2 } from 'lucide-react';

const SUGGESTED_PROFILES = [
  { name: 'shadcn', desc: 'UI & Systems' },
  { name: 'gaearon', desc: 'React Creator' },
  { name: 'torvalds', desc: 'Linux / C' },
  { name: 'antfu', desc: 'Vue / Open Source' },
  { name: 'sindresorhus', desc: 'Node.js / Modules' }
];

export function HeroSection({ onSearch, loading }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const clean = username.trim();
    if (!clean) {
      setError('Please enter a GitHub username');
      return;
    }
    setError('');
    onSearch(clean);
  };

  const handleChipClick = (name) => {
    setUsername(name);
    setError('');
    onSearch(name);
  };

  return (
    <div className="flex flex-col items-center justify-center pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-github-dark border border-github-border text-xs font-medium text-github-accent mb-8 shadow-sm">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Evidence-Grounded AI Engineering Evaluation</span>
      </div>

      {/* Main Title */}
      <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight max-w-3xl leading-[1.15]">
        Turn Your GitHub Into Your{' '}
        <span className="bg-gradient-to-r from-github-accent via-github-purpleLight to-github-accent bg-clip-text text-transparent">
          Developer Profile
        </span>
      </h1>

      {/* Subtitle */}
      <p className="mt-5 text-base sm:text-lg text-github-textMuted max-w-2xl leading-relaxed">
        Analyze your public repositories, tech stack, activity and engineering patterns with AI. Get a transparent developer score, archetype, and tailored growth roadmap.
      </p>

      {/* Search Input Box */}
      <div className="w-full max-w-xl mt-8">
        <form onSubmit={handleSubmit} className="relative flex flex-col sm:flex-row items-stretch gap-2.5">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-github-textMuted font-mono text-sm">
              github.com/
            </div>
            <input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (error) setError('');
              }}
              disabled={loading}
              className="w-full pl-[106px] pr-4 py-3.5 bg-github-dark border border-github-border rounded-xl text-white placeholder-github-textMuted focus:outline-none focus:border-github-accent focus:ring-2 focus:ring-github-accent/20 transition-all font-mono text-base shadow-inner disabled:opacity-50"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-github-accent hover:bg-github-accentHover text-github-darkest font-semibold rounded-xl transition-all shadow-glow-accent hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none text-sm"
          >
            <span>Analyze Profile</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {error && (
          <p className="text-xs text-github-red mt-2 text-left pl-1 font-mono">
            {error}
          </p>
        )}

        {/* Suggested Profiles */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-github-textMuted">
          <span className="mr-1">Try popular developers:</span>
          {SUGGESTED_PROFILES.map((prof) => (
            <button
              key={prof.name}
              onClick={() => handleChipClick(prof.name)}
              disabled={loading}
              className="px-2.5 py-1 rounded-md bg-github-dark hover:bg-github-card border border-github-border hover:border-github-borderLight text-github-textPrimary font-mono transition-all hover:text-github-accent disabled:opacity-50"
            >
              @{prof.name}
            </button>
          ))}
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-16 text-left w-full max-w-4xl">
        <div className="p-5 rounded-xl bg-github-dark/60 border border-github-border hover:border-github-borderLight transition-all">
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-github-accent mb-3">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-white">Evidence-Based Tech Detection</h3>
          <p className="text-xs text-github-textMuted mt-1.5 leading-relaxed">
            Detects frameworks & dependencies directly from `package.json`, `requirements.txt`, Dockerfiles and repository topics without assumptions.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-github-dark/60 border border-github-border hover:border-github-borderLight transition-all">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
            <BarChart3 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-white">Transparent Developer Score</h3>
          <p className="text-xs text-github-textMuted mt-1.5 leading-relaxed">
            Deterministic /100 score broken down across 6 engineering pillars: Technical Breadth, Quality, Activity, Docs, CI/CD, and Community.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-github-dark/60 border border-github-border hover:border-github-borderLight transition-all">
          <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-github-purpleLight mb-3">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-white">Archetype & Project Roadmap</h3>
          <p className="text-xs text-github-textMuted mt-1.5 leading-relaxed">
            Synthesizes developer personas, clear strengths, growth areas, and 3 high-impact project suggestions to elevate your skill profile.
          </p>
        </div>
      </div>
    </div>
  );
}
