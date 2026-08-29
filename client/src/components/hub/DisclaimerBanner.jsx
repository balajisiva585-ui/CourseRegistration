import React from 'react';
import { AlertTriangle, Clock, Info } from 'lucide-react';

export const DisclaimerBanner = ({ lastUpdated, customText }) => {
  return (
    <div
      style={{
        backgroundColor: '#fffbeb',
        border: '1px solid #fef3c7',
        borderLeft: '4px solid #f59e0b',
        borderRadius: '8px',
        padding: '0.85rem 1.15rem',
        margin: '1rem 0',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', flex: 1, minWidth: '280px' }}>
        <AlertTriangle size={18} color="#d97706" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
        <div style={{ fontSize: '0.82rem', color: '#92400e', lineHeight: 1.5 }}>
          <strong>Notice: </strong>
          {customText ||
            'Information provided on this platform is for reference and guidance. Always verify admission, cutoff, seat availability and application information with the official TNEA/college sources before making admission decisions.'}
        </div>
      </div>

      {lastUpdated && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            backgroundColor: '#ffffff',
            border: '1px solid #fde68a',
            padding: '0.25rem 0.6rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#78350f',
            alignSelf: 'center',
          }}
        >
          <Clock size={13} />
          <span>Last Updated: {new Date(lastUpdated).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      )}
    </div>
  );
};

export default DisclaimerBanner;
