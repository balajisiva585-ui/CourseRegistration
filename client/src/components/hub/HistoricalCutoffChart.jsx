import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';

export const HistoricalCutoffChart = ({
  history = [],
  studentCutoff = 185.0,
  average = 184.2,
  trend = 'Stable',
  highest = 188.0,
  lowest = 181.0,
  community = 'BC',
}) => {
  // Format data points for Recharts
  const chartData = (history || []).map((h) => ({
    year: String(h.year),
    cutoff: Number(h.cutoff),
    student: Number(studentCutoff),
    dataType: h.dataType,
  }));

  const getTrendIcon = () => {
    if (trend === 'Increasing') return <TrendingUp size={16} color="#dc2626" title="Cutoff competition increasing" />;
    if (trend === 'Decreasing') return <TrendingDown size={16} color="#059669" title="Cutoff trending favorably" />;
    return <Minus size={16} color="#64748b" title="Cutoff trend stable" />;
  };

  return (
    <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem', marginTop: '1rem' }}>
      {/* Chart Header & Trend Metrics */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            5-Year Admission Cutoff Trend ({community} Quota)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
              5-Yr Avg: {average ? Number(average).toFixed(2) : 'N/A'}
            </span>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', backgroundColor: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
              {getTrendIcon()}
              <span>Trend: {trend}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.78rem' }}>
          <div style={{ backgroundColor: '#f8fafc', padding: '0.35rem 0.65rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <span style={{ color: '#64748b' }}>Highest: </span>
            <strong style={{ color: '#dc2626' }}>{highest ? Number(highest).toFixed(2) : 'N/A'}</strong>
          </div>
          <div style={{ backgroundColor: '#f8fafc', padding: '0.35rem 0.65rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <span style={{ color: '#64748b' }}>Lowest: </span>
            <strong style={{ color: '#059669' }}>{lowest ? Number(lowest).toFixed(2) : 'N/A'}</strong>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      {chartData.length > 0 ? (
        <div style={{ width: '100%', height: '190px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis domain={['dataMin - 3', 'dataMax + 3']} stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', color: '#ffffff', borderRadius: '8px', border: 'none', fontSize: '0.8rem' }}
                formatter={(value, name) => [Number(value).toFixed(2), name === 'cutoff' ? 'Historical Cutoff' : 'Your Score']}
              />
              <ReferenceLine y={studentCutoff} stroke="#2563eb" strokeDasharray="4 4" label={{ value: `Your Cutoff: ${studentCutoff}`, fill: '#2563eb', fontSize: 10, position: 'top' }} />
              <Line type="monotone" dataKey="cutoff" stroke="#7c3aed" strokeWidth={2.5} dot={{ r: 4, fill: '#7c3aed' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
          Historical cutoff points being indexed for this branch.
        </div>
      )}

      {/* Provenance note */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.65rem', fontSize: '0.72rem', color: '#94a3b8' }}>
        <Info size={13} />
        <span>Historical data compiled from official TNEA single-window merit closing ranks & institutional archives.</span>
      </div>
    </div>
  );
};

export default HistoricalCutoffChart;
