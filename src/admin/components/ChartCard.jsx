import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-dark px-3 py-1.5 rounded-xl border border-white/14 text-white shadow-soft text-[12px] tabular-nums font-medium pointer-events-none">
        <span className="text-slate-300 mr-2">{label}:</span>
        <span className="font-bold text-white">{payload[0].value} units</span>
      </div>
    );
  }
  return null;
};

export default function ChartCard({ categoryData = [] }) {
  return (
    <div className="glass-light glass-hover rounded-[20px] p-6 flex flex-col justify-between h-full">
      {/* Card Header (Card title only, no extra tabs or legend) */}
      <div className="mb-6">
        <h3 className="font-display text-[18px] font-semibold text-navy leading-tight">
          Products by Category
        </h3>
        <p className="text-[14px] text-slate-500 mt-1 leading-normal">
          Inverter and hardware distribution across equipment categories
        </p>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={categoryData}
            margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
          >
            <defs>
              <linearGradient id="electricVerticalBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3fb1e8" stopOpacity={1} />
                <stop offset="100%" stopColor="#0278b8" stopOpacity={1} />
              </linearGradient>
              <linearGradient id="cantaloupeVerticalBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fd8a6a" stopOpacity={1} />
                <stop offset="100%" stopColor="#e85a34" stopOpacity={1} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(7,27,42,0.08)"
            />

            <XAxis
              dataKey="shortName"
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
              interval={0}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
            />

            <YAxis
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(2,151,222,0.04)' }}
            />

            <Bar
              dataKey="count"
              name="Products"
              fill="url(#electricVerticalBar)"
              radius={[6, 6, 0, 0]}
              maxBarSize={44}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
