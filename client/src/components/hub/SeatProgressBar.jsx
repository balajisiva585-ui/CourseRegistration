import React from 'react';

export const SeatProgressBar = ({ total, intake, filled = 0, available, label, showNumbers = true, height = 8 }) => {
  const totalSeats = total ?? intake ?? 0;
  const filledSeats = filled ?? 0;
  const availableSeats = available ?? Math.max(0, totalSeats - filledSeats);
  const percentage = totalSeats > 0 ? Math.min(100, Math.round((filledSeats / totalSeats) * 100)) : 0;

  // Determine color based on saturation
  let barColor = '#10b981'; // green if plenty available (< 60%)
  if (percentage >= 90) {
    barColor = '#ef4444'; // red if almost full
  } else if (percentage >= 70) {
    barColor = '#f59e0b'; // amber if filling fast
  }

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', fontSize: '0.8rem' }}>
          <span style={{ fontWeight: 600, color: '#334155' }}>{label}</span>
          {showNumbers && (
            <span style={{ color: '#64748b', fontSize: '0.75rem' }}>
              <strong style={{ color: '#0f172a' }}>{available}</strong> left / {total} total ({percentage}% filled)
            </span>
          )}
        </div>
      )}

      {/* Progress Track */}
      <div
        style={{
          width: '100%',
          height: `${height}px`,
          backgroundColor: '#e2e8f0',
          borderRadius: '999px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${percentage}%`,
            backgroundColor: barColor,
            borderRadius: '999px',
            transition: 'width 0.5s ease-in-out',
          }}
        />
      </div>
    </div>
  );
};

export default SeatProgressBar;
