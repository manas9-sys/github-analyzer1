import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { ShieldCheck, Crosshair } from 'lucide-react';

export function RepoQualityRadarChart({ radarMetrics }) {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-github-darkest border border-github-border rounded-lg p-2.5 shadow-xl text-xs font-mono">
          <p className="font-bold text-white mb-0.5">{data.subject}</p>
          <p className="text-github-accent">
            Proficiency: <strong className="text-white">{data.value}%</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-github-dark border border-github-border rounded-2xl p-6 shadow-card flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-github-border/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Crosshair className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Engineering Health Radar
          </h2>
        </div>
        <span className="text-xs font-mono text-github-textMuted">
          6 Dimensions
        </span>
      </div>

      {/* Radar Chart */}
      <div className="my-2 h-56 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarMetrics}>
            <PolarGrid stroke="#30363d" />
            <PolarAngleAxis
              dataKey="subject"
              stroke="#8b949e"
              tick={{ fill: '#c9d1d9', fontSize: 11, fontFamily: 'monospace' }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              stroke="#21262d"
              tick={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Radar
              name="Proficiency"
              dataKey="value"
              stroke="#58a6ff"
              fill="#58a6ff"
              fillOpacity={0.35}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-github-border/60 text-[11px] text-github-textMuted font-mono flex items-center justify-between">
        <span>Balanced engineering index</span>
        <span className="text-github-accent font-semibold">100% Max Scale</span>
      </div>
    </div>
  );
}
