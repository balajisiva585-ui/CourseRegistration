import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Award, CheckCircle2, Bookmark, Scale, ArrowRight, ShieldCheck, Briefcase } from 'lucide-react';
import { useCompare } from '../../context/CompareContext';
import { useAuth } from '../../context/AuthContext';
import tneaService from '../../services/tneaService';

export const CollegeCard = ({ college, onFavoriteToggle, isFavorited = false }) => {
  const { addCollegeToCompare, removeCollegeFromCompare, isCollegeCompared } = useCompare();
  const { isAuthenticated } = useAuth();
  const [favorite, setFavorite] = useState(isFavorited);
  const [savingFav, setSavingFav] = useState(false);

  if (!college) return null;

  const compared = isCollegeCompared(college.code);

  const handleCompareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (compared) {
      removeCollegeFromCompare(college.code);
    } else {
      addCollegeToCompare(college);
    }
  };

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      alert('Please log in or register to save colleges to your favorites.');
      return;
    }
    setSavingFav(true);
    try {
      const res = await tneaService.toggleFavorite(college._id);
      if (res.success) {
        setFavorite(res.action === 'added');
        if (onFavoriteToggle) onFavoriteToggle(college._id, res.action === 'added');
      }
    } catch (err) {
      console.error('Failed to toggle favorite', err);
    } finally {
      setSavingFav(false);
    }
  };

  // Badge styles based on college type
  const getTypeColor = (type) => {
    if (type === 'Government' || type === 'University') return { bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0' };
    if (type === 'Government Aided') return { bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe' };
    return { bg: '#f8fafc', text: '#334155', border: '#e2e8f0' };
  };

  const typeStyle = getTypeColor(college.collegeType);

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
        position: 'relative',
      }}
      className="hub-college-card"
    >
      {/* Top Header with Code & Tags */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', alignItems: 'center' }}>
            <span
              style={{
                backgroundColor: '#1e293b',
                color: '#ffffff',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '0.2rem 0.5rem',
                borderRadius: '6px',
                letterSpacing: '0.03em',
              }}
            >
              Code: {college.code}
            </span>

            <span
              style={{
                backgroundColor: typeStyle.bg,
                color: typeStyle.text,
                border: `1px solid ${typeStyle.border}`,
                fontSize: '0.72rem',
                fontWeight: 600,
                padding: '0.18rem 0.5rem',
                borderRadius: '6px',
              }}
            >
              {college.collegeType}
            </span>

            {college.isAutonomous && (
              <span
                style={{
                  backgroundColor: '#fef3c7',
                  color: '#92400e',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  padding: '0.18rem 0.5rem',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                }}
              >
                <ShieldCheck size={12} /> Autonomous
              </span>
            )}
          </div>

          {/* Action Icons */}
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <button
              onClick={handleFavoriteClick}
              disabled={savingFav}
              title={favorite ? 'Remove from favorites' : 'Save to favorites'}
              style={{
                backgroundColor: favorite ? '#fef2f2' : '#f8fafc',
                border: '1px solid',
                borderColor: favorite ? '#fca5a5' : '#e2e8f0',
                color: favorite ? '#ef4444' : '#64748b',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Bookmark size={15} fill={favorite ? '#ef4444' : 'none'} />
            </button>

            <button
              onClick={handleCompareClick}
              title={compared ? 'Remove from comparison' : 'Add to comparison'}
              style={{
                backgroundColor: compared ? '#eff6ff' : '#f8fafc',
                border: '1px solid',
                borderColor: compared ? '#93c5fd' : '#e2e8f0',
                color: compared ? '#2563eb' : '#64748b',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Scale size={15} />
            </button>
          </div>
        </div>

        {/* College Name & Location */}
        <Link to={`/colleges/${college.code}`} style={{ textDecoration: 'none' }}>
          <h3
            style={{
              fontSize: '1.05rem',
              fontWeight: 700,
              color: '#0f172a',
              lineHeight: 1.35,
              marginBottom: '0.35rem',
            }}
          >
            {college.name}
          </h3>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#64748b', fontSize: '0.82rem', marginBottom: '0.75rem' }}>
          <MapPin size={14} color="#94a3b8" />
          <span>{college.area ? `${college.area}, ` : ''}{college.district}, Tamil Nadu</span>
        </div>

        {/* Key Metrics / Highlights */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.5rem',
            backgroundColor: '#f8fafc',
            border: '1px solid #f1f5f9',
            borderRadius: '8px',
            padding: '0.6rem 0.75rem',
            marginBottom: '0.85rem',
            textAlign: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>NAAC / NBA</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
              {college.accreditation?.naacGrade ? `Grade ${college.accreditation.naacGrade}` : 'Accredited'}
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem', fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>
              <Briefcase size={11} /> Placement
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#059669' }}>
              {college.placements?.placementPercentage ? `${college.placements.placementPercentage}%` : '85%+'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>Est. Year</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
              {college.establishedYear || '1995'}
            </div>
          </div>
        </div>

        {/* Departments Offered Pills */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>Offered Branches:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
            {college.departments && college.departments.slice(0, 5).map((d) => (
              <span
                key={d.departmentCode}
                style={{
                  backgroundColor: '#eff6ff',
                  color: '#1d4ed8',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  padding: '0.15rem 0.45rem',
                  borderRadius: '4px',
                }}
              >
                {d.departmentCode}
              </span>
            ))}
            {college.departments && college.departments.length > 5 && (
              <span
                style={{
                  backgroundColor: '#f1f5f9',
                  color: '#64748b',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  padding: '0.15rem 0.45rem',
                  borderRadius: '4px',
                }}
              >
                +{college.departments.length - 5} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div
        style={{
          borderTop: '1px solid #f1f5f9',
          paddingTop: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
        }}
      >
        <button
          onClick={handleCompareClick}
          style={{
            backgroundColor: compared ? '#2563eb' : '#ffffff',
            color: compared ? '#ffffff' : '#334155',
            border: '1px solid',
            borderColor: compared ? '#2563eb' : '#cbd5e1',
            padding: '0.45rem 0.75rem',
            borderRadius: '6px',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
        >
          <Scale size={13} />
          <span>{compared ? 'In Compare' : 'Compare'}</span>
        </button>

        <Link
          to={`/colleges/${college.code}`}
          style={{
            backgroundColor: '#1e293b',
            color: '#ffffff',
            padding: '0.45rem 0.95rem',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontWeight: 600,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
        >
          <span>View Profile</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
};

export default CollegeCard;
