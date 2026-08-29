import React from 'react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'blue',
  trend = null,
}) => {
  const variantClass = `stat-${variant}`;

  return (
    <div className="stat-card">
      {Icon && (
        <div className={`stat-icon-wrapper ${variantClass}`}>
          <Icon size={24} />
        </div>
      )}
      <div className="stat-content">
        <div className="stat-label">{title}</div>
        <div className="stat-value">{value}</div>
        {subtitle && <div className="stat-subtext">{subtitle}</div>}
        {trend && (
          <div
            style={{
              fontSize: '0.75rem',
              color: trend.isPositive ? '#059669' : '#e11d48',
              fontWeight: 600,
              marginTop: '0.25rem',
            }}
          >
            {trend.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
