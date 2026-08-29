import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  X,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';

export const ShareSimulationModal = ({ isOpen, onClose, simulationData }) => {
  const [copied, setCopied] = useState(false);
  const [textCopied, setTextCopied] = useState(false);

  if (!isOpen || !simulationData) return null;

  const shareUrl = `${window.location.origin}/simulator?shareId=${simulationData.shareId || 'plan'}`;

  const generateTextSummary = () => {
    const cutoff = simulationData.academicDetails?.effectiveCutoff || 'N/A';
    const community = simulationData.community || 'BC';
    const likely = (simulationData.results || []).filter((r) => r.predictionTier === 'Likely').map((r) => `• ${r.collegeName} (${r.departmentCode})`).slice(0, 5).join('\n');
    const possible = (simulationData.results || []).filter((r) => r.predictionTier === 'Possible').map((r) => `• ${r.collegeName} (${r.departmentCode})`).slice(0, 5).join('\n');

    return `🎯 My TNEA Engineering Admission Simulation Plan\n\nCutoff: ${cutoff}/200 | Community: ${community}\nPreferences Evaluated: ${simulationData.results?.length || 0}\n\n🟢 Likely Allotments:\n${likely || '• None'}\n\n🟡 Possible Target Choices:\n${possible || '• None'}\n\nSimulate your TNEA cutoff and check historical seat trends at:\n${shareUrl}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(generateTextSummary());
    setTextCopied(true);
    setTimeout(() => setTextCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(generateTextSummary());
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

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
          maxWidth: '520px',
          padding: '1.75rem',
          boxShadow: '0 20px 25px rgba(0,0,0,0.2)',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Share2 size={20} color="#2563eb" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Share My TNEA Simulation Plan
            </h3>
          </div>

          <button
            onClick={onClose}
            style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
          >
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1.25rem' }}>
          Share your simulated college allotment breakdown with parents, teachers, or friends for counselling discussions.
        </p>

        {/* Link Share Box */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem' }}>
            Direct Simulation Link:
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              readOnly
              value={shareUrl}
              style={{
                flex: 1,
                padding: '0.55rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.82rem',
                backgroundColor: '#f8fafc',
                color: '#334155',
              }}
            />
            <button
              onClick={handleCopyLink}
              style={{
                backgroundColor: copied ? '#059669' : '#0f172a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.55rem 1rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                whiteSpace: 'nowrap',
              }}
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* WhatsApp & Text Share Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <button
            onClick={handleWhatsAppShare}
            style={{
              backgroundColor: '#25D366',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '0.65rem 1rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
            }}
          >
            <MessageCircle size={17} />
            <span>Share to WhatsApp</span>
          </button>

          <button
            onClick={handleCopyText}
            style={{
              backgroundColor: textCopied ? '#059669' : '#eff6ff',
              color: textCopied ? '#ffffff' : '#1d4ed8',
              border: '1px solid #bfdbfe',
              borderRadius: '8px',
              padding: '0.65rem 1rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
            }}
          >
            {textCopied ? <Check size={16} /> : <Copy size={16} />}
            <span>{textCopied ? 'Summary Copied!' : 'Copy Summary'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareSimulationModal;
