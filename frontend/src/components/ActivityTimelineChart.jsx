import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { Activity, TrendingUp } from 'lucide-react';

export function ActivityTimelineChart({ activityTimeline }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-github-darkest border border-github-border rounded-lg p-2.5 shadow-xl text-xs font-mono">
          <p className="font-bold text-white mb-1">Year {label}</p>
          <p className="text-github-accent">
            Repositories Created: <strong className="text-white">{payload[0]?.value || 0}</strong>
          </p>
          {payload[1] && (
            <p className="text-github-purpleLight">
              Active Updates: <strong className="text-white">{payload[1]?.value || 0}</strong>
            </p>
          )}
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
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
            <Activity className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Repository Activity Timeline
          </h2>
        </div>
        <span className="text-xs font-mono text-github-textMuted flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5 text-github-greenText" />
          Cadence
        </span>
      </div>

      {activityTimeline && activityTimeline.length > 0 ? (
        <div className="my-4 h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={activityTimeline}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            >
              <defs>
                <linearGradient id="createdGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#58a6ff" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#58a6ff" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="updatedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#bc8cff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#bc8cff" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#21262d" vertical={false} />
              <XAxis
                dataKey="year"
                stroke="#8b949e"
                tick={{ fontSize: 11, fill: '#8b949e', fontFamily: 'monospace' }}
                tickLine={false}
                axisLine={{ stroke: '#30363d' }}
              />
              <YAxis
                stroke="#8b949e"
                tick={{ fontSize: 11, fill: '#8b949e', fontFamily: 'monospace' }}
                tickLine={false}
                axisLine={{ stroke: '#30363d' }}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="created"
                stroke="#58a6ff"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#createdGrad)"
                name="Created"
              />
              <Area
                type="monotone"
                dataKey="updated"
                stroke="#bc8cff"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#updatedGrad)"
                name="Updated"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="py-12 text-center text-xs text-github-textMuted font-mono">
          No activity timeline data available.
        </div>
      )}

      {/* Footer */}
      <div className="pt-3 border-t border-github-border/60 flex items-center justify-between text-[11px] text-github-textMuted font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-1 bg-github-accent rounded" /> Repos Created
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-1 bg-github-purpleLight rounded" /> Active Updates
          </span>
        </div>
      </div>
    </div>
  );
}
