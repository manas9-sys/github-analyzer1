import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Code2, PieChart as PieIcon } from 'lucide-react';
import { getLanguageColor } from '../utils/languageColors.js';

export function LanguageDistributionChart({ languageDistribution }) {
  const chartData = languageDistribution.slice(0, 7).map(item => ({
    name: item.name,
    value: item.count,
    percentage: item.percentage,
    color: getLanguageColor(item.name)
  }));

  const remaining = languageDistribution.slice(7);
  if (remaining.length > 0) {
    const remainingCount = remaining.reduce((acc, curr) => acc + curr.count, 0);
    const remainingPct = remaining.reduce((acc, curr) => acc + curr.percentage, 0);
    chartData.push({
      name: 'Other Languages',
      value: remainingCount,
      percentage: Number(remainingPct.toFixed(1)),
      color: '#8b949e'
    });
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-github-darkest border border-github-border rounded-lg p-2.5 shadow-xl text-xs font-mono">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
            <span className="font-bold text-white">{data.name}</span>
          </div>
          <p className="text-github-textMuted">
            {data.value} {data.value === 1 ? 'repo' : 'repos'} ({data.percentage}%)
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
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <PieIcon className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Language Distribution
          </h2>
        </div>
        <span className="text-xs font-mono text-github-textMuted">
          {languageDistribution.length} Total
        </span>
      </div>

      {chartData.length > 0 ? (
        <div className="my-4 grid grid-cols-1 sm:grid-cols-12 items-center gap-4">
          {/* Donut Chart */}
          <div className="sm:col-span-6 h-48 sm:h-52 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomTooltip />} />
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="#161b22"
                  strokeWidth={2}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center pointer-events-none">
              <span className="text-xs text-github-textMuted font-mono">Primary</span>
              <span className="text-sm font-bold text-white font-mono truncate max-w-[80px]">
                {languageDistribution[0]?.name || 'N/A'}
              </span>
            </div>
          </div>

          {/* Breakdown Legend */}
          <div className="sm:col-span-6 space-y-2 max-h-48 overflow-y-auto pr-1">
            {chartData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-github-textPrimary truncate">{item.name}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 text-github-textMuted">
                  <span>{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="py-12 text-center text-xs text-github-textMuted font-mono">
          No language data available.
        </div>
      )}

      {/* Footer */}
      <div className="pt-3 border-t border-github-border/60 text-[11px] text-github-textMuted font-mono">
        Aggregated from repository primary languages.
      </div>
    </div>
  );
}
