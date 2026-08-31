import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Target,
  Rocket,
  Plus,
  Check,
  X,
  Building,
  MapPin,
} from 'lucide-react';

export const SmartSuggestionsModal = ({
  isOpen,
  onClose,
  suggestions = { safeChoices: [], targetChoices: [], dreamChoices: [] },
  onAddChoice,
  existingPreferences = [],
}) => {
  const [activeTab, setActiveTab] = useState('target'); // 'safe', 'target', 'dream'

  if (!isOpen) return null;

  const isAlreadyAdded = (collegeCode, departmentCode) => {
    return existingPreferences.some(
      (p) => p.collegeCode === collegeCode && p.departmentCode === departmentCode
    );
  };

  const getList = () => {
    if (activeTab === 'safe') return suggestions.safeChoices || [];
    if (activeTab === 'target') return suggestions.targetChoices || [];
    return suggestions.dreamChoices || [];
  };

  const list = getList();

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '750px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 25px rgba(0,0,0,0.2)',
          overflow: 'hidden',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#f8fafc',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={20} color="#2563eb" />
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Smart College Preference Recommendations
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>
                Add high-probability colleges directly into your TNEA choice list.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', padding: '0.25rem' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Category Switcher Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: '1px solid #e2e8f0' }}>
          <button
            onClick={() => setActiveTab('target')}
            style={{
              padding: '0.85rem',
              border: 'none',
              backgroundColor: activeTab === 'target' ? '#eff6ff' : '#ffffff',
              color: activeTab === 'target' ? '#1d4ed8' : '#64748b',
              fontWeight: activeTab === 'target' ? 800 : 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              borderBottom: activeTab === 'target' ? '3px solid #2563eb' : 'none',
            }}
          >
            <Target size={16} />
            <span>Target Choices ({suggestions.targetChoices?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('safe')}
            style={{
              padding: '0.85rem',
              border: 'none',
              backgroundColor: activeTab === 'safe' ? '#ecfdf5' : '#ffffff',
              color: activeTab === 'safe' ? '#065f46' : '#64748b',
              fontWeight: activeTab === 'safe' ? 800 : 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              borderBottom: activeTab === 'safe' ? '3px solid #059669' : 'none',
            }}
          >
            <ShieldCheck size={16} />
            <span>Safe Choices ({suggestions.safeChoices?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('dream')}
            style={{
              padding: '0.85rem',
              border: 'none',
              backgroundColor: activeTab === 'dream' ? '#fffbeb' : '#ffffff',
              color: activeTab === 'dream' ? '#92400e' : '#64748b',
              fontWeight: activeTab === 'dream' ? 800 : 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              borderBottom: activeTab === 'dream' ? '3px solid #d97706' : 'none',
            }}
          >
            <Rocket size={16} />
            <span>Dream Choices ({suggestions.dreamChoices?.length || 0})</span>
          </button>
        </div>

        {/* Suggestions List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {list.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              No recommendations available in this category for your current cutoff criteria.
            </div>
          ) : (
            list.map((item, idx) => {
              const added = isAlreadyAdded(item.collegeCode, item.departmentCode);
              return (
                <div
                  key={`${item.collegeCode}-${item.departmentCode}-${idx}`}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                        {item.shortName || item.collegeName}
                      </span>
                      <span style={{ backgroundColor: '#1e293b', color: '#ffffff', fontSize: '0.72rem', fontWeight: 800, padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                        Code: {item.collegeCode}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.82rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, color: '#2563eb' }}>{item.departmentName} ({item.departmentCode})</span>
                      <span>• {item.district}</span>
                      <span>• Historical Cutoff: <strong>{item.historicalCutoff !== null && item.historicalCutoff !== undefined && !isNaN(Number(item.historicalCutoff)) ? Number(item.historicalCutoff).toFixed(2) : 'Unavailable'}</strong></span>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={added}
                    onClick={() => onAddChoice(item)}
                    style={{
                      backgroundColor: added ? '#ecfdf5' : '#0f172a',
                      color: added ? '#065f46' : '#ffffff',
                      border: added ? '1px solid #a7f3d0' : 'none',
                      borderRadius: '8px',
                      padding: '0.5rem 0.9rem',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: added ? 'default' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {added ? (
                      <>
                        <Check size={14} />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus size={14} />
                        <span>Add Choice</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '0.55rem 1.25rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Done Adding
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartSuggestionsModal;
