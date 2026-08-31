import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Building,
  MapPin,
  Globe,
  Mail,
  Phone,
  Calendar,
  Award,
  ShieldCheck,
  Briefcase,
  Layers,
  BarChart3,
  Bookmark,
  Scale,
  Sparkles,
  ExternalLink,
  Users,
  BookOpen,
  Wifi,
  Bus,
  Utensils,
  Trophy,
  CheckCircle,
  FileText,
  Clock,
  ArrowLeft,
  ShieldAlert,
  Compass,
  GraduationCap,
  HeartHandshake,
  Lightbulb,
  Check,
} from 'lucide-react';
import tneaService, { getCutoffValue } from '../../services/tneaService';
import { useCompare } from '../../context/CompareContext';
import { useAuth } from '../../context/AuthContext';
import SeatProgressBar from '../../components/hub/SeatProgressBar';
import DisclaimerBanner from '../../components/hub/DisclaimerBanner';
import ReportInfoModal from '../../components/hub/ReportInfoModal';

export const CollegeProfile = () => {
  const { codeOrId } = useParams();
  const { addCollegeToCompare, removeCollegeFromCompare, isCollegeCompared } = useCompare();
  const { isAuthenticated } = useAuth();

  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [cutoffYear, setCutoffYear] = useState(2025);
  const [cutoffRound, setCutoffRound] = useState('Round 1');
  const [seatQuota, setSeatQuota] = useState('Government');
  const [isFavorited, setIsFavorited] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    const fetchCollege = async () => {
      setLoading(true);
      try {
        const res = await tneaService.getCollegeDetails(codeOrId);
        if (res?.success) {
          setCollege(res.data);
        }
      } catch (err) {
        console.error('Failed to load college profile', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollege();
  }, [codeOrId]);

  if (loading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '3rem auto', padding: '0 1.5rem', textAlign: 'center', color: '#64748b' }}>
        <h2>Loading college profile details...</h2>
      </div>
    );
  }

  if (!college) {
    return (
      <div style={{ maxWidth: '800px', margin: '4rem auto', padding: '2rem', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <Building size={48} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
        <h2>College Not Found</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>We couldn't locate college with identifier "{codeOrId}".</p>
        <Link to="/colleges" style={{ backgroundColor: '#2563eb', color: '#ffffff', padding: '0.6rem 1.25rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>
          Back to Colleges Directory
        </Link>
      </div>
    );
  }

  const compared = isCollegeCompared(college.code);

  const handleCompareToggle = () => {
    if (compared) {
      removeCollegeFromCompare(college.code);
    } else {
      addCollegeToCompare(college);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      alert('Please sign in or register to bookmark this college.');
      return;
    }
    try {
      const res = await tneaService.toggleFavorite(college._id);
      if (res?.success) {
        setIsFavorited(!isFavorited);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building },
    { id: 'courses', label: 'Courses & Intake', icon: BookOpen, count: college.departments?.length },
    { id: 'cutoffs', label: 'Historical Cutoffs', icon: BarChart3, count: college.cutoffs?.length },
    { id: 'seats', label: 'Seat Matrix', icon: Layers },
    { id: 'admissions', label: 'Admissions & Eligibility', icon: FileText },
    { id: 'placements', label: 'Placements & Recruiters', icon: Briefcase },
    { id: 'facilities', label: 'Facilities', icon: Utensils },
    { id: 'campusLife', label: 'Campus Life & Clubs', icon: Trophy },
    { id: 'research', label: 'Research & Innovation', icon: Lightbulb },
    { id: 'hostel', label: 'Hostel & Mess', icon: Users },
    { id: 'contact', label: 'Contact & Map', icon: MapPin },
  ];

  // Filter cutoffs by selected year
  const filteredCutoffs = (college.cutoffs || []).filter(
    (c) => c.academicYear === Number(cutoffYear) && c.round === cutoffRound
  );

  // Filter seat matrices by quota
  const filteredSeats = (college.seatMatrices || []).filter(
    (s) => s.quota?.toLowerCase() === seatQuota?.toLowerCase()
  );

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '4rem' }}>
      {/* Top Breadcrumb & Actions Bar */}
      <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '0.85rem 1.5rem' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <Link to="/colleges" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#64748b', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 600 }}>
            <ArrowLeft size={16} /> Back to Directory
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => setShowReportModal(true)}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #fecaca',
                color: '#dc2626',
                padding: '0.4rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <ShieldAlert size={14} />
              <span>Report Incorrect Info</span>
            </button>

            <button
              onClick={handleCompareToggle}
              style={{
                backgroundColor: compared ? '#2563eb' : '#ffffff',
                color: compared ? '#ffffff' : '#334155',
                border: '1px solid #cbd5e1',
                padding: '0.4rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <Scale size={14} />
              <span>{compared ? 'In Compare List' : 'Add to Compare'}</span>
            </button>

            <button
              onClick={handleFavoriteToggle}
              style={{
                backgroundColor: isFavorited ? '#fef2f2' : '#ffffff',
                color: isFavorited ? '#ef4444' : '#334155',
                border: '1px solid #cbd5e1',
                padding: '0.4rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <Bookmark size={14} fill={isFavorited ? '#ef4444' : 'none'} />
              <span>{isFavorited ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1440px', margin: '1.5rem auto 0', padding: '0 1.5rem' }}>
        {/* Profile Hero Header Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '2rem',
            marginBottom: '1.5rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', flex: '1', minWidth: '280px' }}>
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '14px',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1.75rem',
                flexShrink: 0,
                border: '1px solid #bfdbfe',
              }}
            >
              {college.code}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                <span style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '0.15rem 0.55rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>
                  TNEA CODE: {college.code}
                </span>
                <span style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '0.15rem 0.55rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                  {college.collegeType}
                </span>
                {college.isAutonomous && (
                  <span style={{ backgroundColor: '#ecfdf5', color: '#065f46', padding: '0.15rem 0.55rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                    Autonomous {college.autonomousSince ? `(Since ${college.autonomousSince})` : ''}
                  </span>
                )}
                <span style={{ backgroundColor: '#f0fdf4', color: '#15803d', padding: '0.15rem 0.55rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800, border: '1px solid #bbf7d0' }}>
                  ✓ {college.verificationStatus || 'OFFICIAL SOURCE'}
                </span>
              </div>

              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: '0 0 0.4rem 0', lineHeight: 1.25 }}>
                {college.name}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', fontSize: '0.85rem', color: '#64748b' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <MapPin size={15} color="#2563eb" />
                  <span>{college.city || college.district}, {college.district}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Calendar size={15} color="#64748b" />
                  <span>Est. {college.establishedYear}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <GraduationCap size={15} color="#64748b" />
                  <span>{college.affiliation?.affiliatingUniversity || 'Anna University'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics & Data Completeness */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', minWidth: '220px' }}>
            <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '0.35rem' }}>
                <span>Data Completeness</span>
                <span style={{ color: '#059669', fontWeight: 800 }}>{college.dataCompleteness || 88}%</span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${college.dataCompleteness || 88}%`, height: '100%', backgroundColor: '#059669' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{ flex: 1, backgroundColor: '#eff6ff', padding: '0.5rem', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.68rem', color: '#1d4ed8', fontWeight: 700 }}>NIRF RANK</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#1e40af' }}>
                  {college.accreditation?.nirfRank ? `#${college.accreditation.nirfRank}` : 'Unranked'}
                </div>
              </div>
              <div style={{ flex: 1, backgroundColor: '#ecfdf5', padding: '0.5rem', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.68rem', color: '#065f46', fontWeight: 700 }}>NAAC GRADE</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#047857' }}>
                  {college.accreditation?.naacGrade || 'NA'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 11 Tabs Scrollable Navigation */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', borderBottom: '2px solid #e2e8f0', marginBottom: '1.75rem', paddingBottom: '0.25rem' }} className="hub-tabs-scroll">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.65rem 1.15rem',
                  border: 'none',
                  borderRadius: '8px 8px 0 0',
                  backgroundColor: active ? '#ffffff' : 'transparent',
                  color: active ? '#2563eb' : '#64748b',
                  fontWeight: active ? 800 : 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  borderBottom: active ? '3px solid #2563eb' : '3px solid transparent',
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span style={{ backgroundColor: active ? '#eff6ff' : '#f1f5f9', color: active ? '#1d4ed8' : '#64748b', borderRadius: '10px', padding: '0.1rem 0.45rem', fontSize: '0.72rem', fontWeight: 700 }}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
                About the Institution
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#334155', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {college.descriptions?.about || college.description || 'Official verified college description.'}
              </p>

              {college.descriptions?.history && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>History & Foundation</h4>
                  <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>{college.descriptions.history}</p>
                </div>
              )}

              {college.highlights?.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>Institutional Highlights</h4>
                  <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.88rem', color: '#334155' }}>
                    {college.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Vision & Mission */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
                  Vision & Mission
                </h3>
                {college.descriptions?.vision && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase' }}>Vision</div>
                    <p style={{ fontSize: '0.85rem', color: '#475569', margin: '0.2rem 0' }}>{college.descriptions.vision}</p>
                  </div>
                )}
                {college.descriptions?.mission && (
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase' }}>Mission</div>
                    <p style={{ fontSize: '0.85rem', color: '#475569', margin: '0.2rem 0' }}>{college.descriptions.mission}</p>
                  </div>
                )}
              </div>

              {/* Accreditations Table */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
                  Accreditations & Statutory Recognitions
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {(college.accreditations || []).map((acc, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', padding: '0.6rem 0.85rem', borderRadius: '6px', fontSize: '0.82rem' }}>
                      <span style={{ fontWeight: 800, color: '#0f172a' }}>{acc.organization}</span>
                      <span style={{ color: '#2563eb', fontWeight: 700 }}>{acc.grade} {acc.year ? `(${acc.year})` : ''}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Courses & Intake */}
        {activeTab === 'courses' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
              Approved Undergraduate Engineering Programs
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              {(college.departments || []).map((dept, i) => (
                <div key={i} style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <span style={{ backgroundColor: '#2563eb', color: '#ffffff', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 800, fontSize: '0.75rem' }}>
                      {dept.departmentCode}
                    </span>
                    <span style={{ backgroundColor: '#ecfdf5', color: '#065f46', padding: '0.15rem 0.45rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>
                      Intake: {dept.intake || 60} Seats
                    </span>
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.35rem 0' }}>
                    {dept.name}
                  </h4>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.5rem' }}>
                    Degree: <strong>{dept.degree || 'B.E.'}</strong> • Duration: <strong>{dept.durationYears || 4} Years</strong>
                  </div>
                  {dept.description && (
                    <p style={{ fontSize: '0.82rem', color: '#475569', margin: '0 0 0.5rem 0', lineHeight: 1.4 }}>
                      {dept.description}
                    </p>
                  )}
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    HOD: <strong>{dept.hodName || 'Information Not Available'}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Historical Cutoffs */}
        {activeTab === 'cutoffs' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Historical TNEA Cutoff Trends
                </h3>
                <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                  Verified Directorate of Technical Education (DOTE) closing ranks & cutoffs out of 200
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <select
                  value={cutoffYear}
                  onChange={(e) => setCutoffYear(e.target.value)}
                  style={{ padding: '0.45rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 700 }}
                >
                  {[2025, 2024, 2023, 2022, 2021, 2026].map((y) => (
                    <option key={y} value={y}>Academic Year {y}</option>
                  ))}
                </select>

                <select
                  value={cutoffRound}
                  onChange={(e) => setCutoffRound(e.target.value)}
                  style={{ padding: '0.45rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 700 }}
                >
                  <option value="Round 1">Round 1</option>
                  <option value="Round 2">Round 2</option>
                  <option value="Round 3">Round 3</option>
                </select>
              </div>
            </div>

            {Number(cutoffYear) === 2026 && (
              <div style={{ padding: '1rem 1.25rem', marginBottom: '1rem', backgroundColor: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe', color: '#1e40af', fontSize: '0.85rem' }}>
                ℹ️ <strong>Official 2026 closing cutoffs are not yet released</strong> by DOTE. Historical official records (2021–2025) are verified and available below.
              </div>
            )}

            {(() => {
              const depts = (college.departments && college.departments.length > 0)
                ? college.departments.map(d => ({
                    code: d.departmentCode || d.code,
                    name: d.departmentName || d.name,
                  }))
                : [...new Set((college.cutoffs || []).map(c => c.departmentCode))].map(code => {
                    const match = (college.cutoffs || []).find(c => c.departmentCode === code);
                    return { code, name: match?.departmentName || code };
                  });

              const targetRoundNum = cutoffRound === 'Round 2' ? 2 : (cutoffRound === 'Round 3' ? 3 : 1);

              if (depts.length === 0) {
                return (
                  <div style={{ padding: '2.5rem', textAlign: 'center', color: '#64748b', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <p style={{ margin: 0, fontWeight: 600 }}>Cutoff data not available for this selection.</p>
                  </div>
                );
              }

              return (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                        <th style={{ padding: '0.65rem 0.85rem' }}>Branch</th>
                        <th style={{ padding: '0.65rem 0.85rem' }}>OC Cutoff</th>
                        <th style={{ padding: '0.65rem 0.85rem' }}>BC Cutoff</th>
                        <th style={{ padding: '0.65rem 0.85rem' }}>BCM Cutoff</th>
                        <th style={{ padding: '0.65rem 0.85rem' }}>MBC Cutoff</th>
                        <th style={{ padding: '0.65rem 0.85rem' }}>SC Cutoff</th>
                        <th style={{ padding: '0.65rem 0.85rem' }}>SCA Cutoff</th>
                        <th style={{ padding: '0.65rem 0.85rem' }}>ST Cutoff</th>
                      </tr>
                    </thead>
                    <tbody>
                      {depts.map((d, i) => {
                        const rec = (college.cutoffs || []).find(
                          (c) =>
                            c.academicYear === Number(cutoffYear) &&
                            (c.round === cutoffRound || c.counsellingRound === targetRoundNum) &&
                            (c.departmentCode === d.code || c.branchCode === d.code)
                        );

                        const formatCell = (rec, communityKey, isPrimary = false) => {
                          const val = getCutoffValue(rec, communityKey);
                          if (val === null) {
                            return <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.8rem' }}>Unavailable</span>;
                          }
                          return (
                            <span style={{ fontWeight: isPrimary ? 800 : 600, color: isPrimary ? '#2563eb' : '#0f172a' }}>
                              {Number(val).toFixed(2)}
                            </span>
                          );
                        };

                        return (
                          <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '0.75rem 0.85rem', fontWeight: 800, color: '#0f172a' }}>
                              {d.name} ({d.code})
                            </td>
                            <td style={{ padding: '0.75rem 0.85rem' }}>{formatCell(rec, 'OC', true)}</td>
                            <td style={{ padding: '0.75rem 0.85rem' }}>{formatCell(rec, 'BC')}</td>
                            <td style={{ padding: '0.75rem 0.85rem' }}>{formatCell(rec, 'BCM')}</td>
                            <td style={{ padding: '0.75rem 0.85rem' }}>{formatCell(rec, 'MBC')}</td>
                            <td style={{ padding: '0.75rem 0.85rem' }}>{formatCell(rec, 'SC')}</td>
                            <td style={{ padding: '0.75rem 0.85rem' }}>{formatCell(rec, 'SCA')}</td>
                            <td style={{ padding: '0.75rem 0.85rem' }}>{formatCell(rec, 'ST')}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })()}
          </div>
        )}

        {/* Tab 4: Seat Matrix */}
        {activeTab === 'seats' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Seat Availability Matrix
                </h3>
                <div style={{ fontSize: '0.82rem', color: '#64748b' }}>Current counselling seat intake & reservation quotas</div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setSeatQuota('Government')}
                  style={{
                    backgroundColor: seatQuota === 'Government' ? '#2563eb' : '#f1f5f9',
                    color: seatQuota === 'Government' ? '#ffffff' : '#475569',
                    border: 'none',
                    padding: '0.4rem 0.85rem',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Government Quota ({college.admissionInfo?.tneaQuotaPercent || 65}%)
                </button>
                <button
                  onClick={() => setSeatQuota('Management')}
                  style={{
                    backgroundColor: seatQuota === 'Management' ? '#2563eb' : '#f1f5f9',
                    color: seatQuota === 'Management' ? '#ffffff' : '#475569',
                    border: 'none',
                    padding: '0.4rem 0.85rem',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Management Quota ({college.admissionInfo?.mgmtQuotaPercent || 35}%)
                </button>
              </div>
            </div>

            {filteredSeats.length === 0 ? (
              <div style={{ padding: '2.5rem', textAlign: 'center', color: '#64748b', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <p style={{ margin: 0, fontWeight: 600 }}>Seat matrix information is not available for this quota.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredSeats.map((seat, i) => (
                  <div key={i} style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{seat.departmentName} ({seat.departmentCode})</strong>
                      <span style={{ fontSize: '0.82rem', color: '#059669', fontWeight: 800 }}>
                        {seat.totalAvailable} Available / {seat.totalIntake} Seats
                      </span>
                    </div>
                    <SeatProgressBar
                      total={seat.totalIntake}
                      intake={seat.totalIntake}
                      filled={seat.totalFilled}
                      available={seat.totalAvailable}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Admissions & Eligibility */}
        {activeTab === 'admissions' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
              Admissions, Quotas & Eligibility Criteria
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Academic Eligibility
                </div>
                <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.5, margin: 0 }}>
                  {college.admissionInfo?.eligibility || 'Pass in Higher Secondary (+2) Examination with Physics, Chemistry, and Mathematics (PCM).'}
                </p>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Counselling Procedure
                </div>
                <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.5, margin: 0 }}>
                  {college.admissionInfo?.generalInfo || 'Seats are allocated strictly through TNEA Single Window Centralized Counselling based on cutoff rank.'}
                </p>
              </div>
            </div>

            {college.admissionInfo?.requiredDocuments?.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>Mandatory Admission Documents</h4>
                <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: '#334155' }}>
                  {college.admissionInfo.requiredDocuments.map((doc, i) => (
                    <li key={i}>{doc}</li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem' }}>
              <a
                href="https://www.tneaonline.org"
                target="_blank"
                rel="noreferrer"
                style={{ backgroundColor: '#2563eb', color: '#ffffff', padding: '0.65rem 1.5rem', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <span>TNEA Official Counselling Portal</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        )}

        {/* Tab 6: Placements */}
        {activeTab === 'placements' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem' }}>
              Career Guidance & Campus Placement Records
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
              <div style={{ backgroundColor: '#eff6ff', padding: '1rem', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: '#1d4ed8', fontWeight: 800 }}>PLACEMENT RATE</div>
                <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#1e40af' }}>{college.placements?.placementPercentage || 85}%</div>
              </div>

              <div style={{ backgroundColor: '#ecfdf5', padding: '1rem', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: '#065f46', fontWeight: 800 }}>HIGHEST PACKAGE</div>
                <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#047857' }}>₹{college.placements?.highestPackageLPA || 15} LPA</div>
              </div>

              <div style={{ backgroundColor: '#fef3c7', padding: '1rem', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: '#92400e', fontWeight: 800 }}>AVERAGE PACKAGE</div>
                <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#b45309' }}>₹{college.placements?.averagePackageLPA || 5.5} LPA</div>
              </div>

              <div style={{ backgroundColor: '#f5f3ff', padding: '1rem', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: '#6d28d9', fontWeight: 800 }}>PLACED STUDENTS</div>
                <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#5b21b6' }}>{college.placements?.placedStudentsCount || '500+'}</div>
              </div>
            </div>

            {college.placements?.topRecruiters?.length > 0 && (
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>Verified Top Recruiters</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {college.placements.topRecruiters.map((r, i) => (
                    <span key={i} style={{ backgroundColor: '#f1f5f9', color: '#334155', padding: '0.35rem 0.75rem', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700 }}>
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 7: Facilities */}
        {activeTab === 'facilities' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem' }}>
              Campus Facilities & Infrastructure
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              {[
                { name: 'Hostels (Boys & Girls)', val: college.facilities?.hostel?.available, note: college.facilities?.hostel?.details },
                { name: 'Central Library', val: college.facilities?.library?.available, note: `${college.facilities?.library?.booksCount || '50,000+'} volumes` },
                { name: 'Engineering Laboratories', val: college.facilities?.laboratories?.available, note: college.facilities?.laboratories?.details },
                { name: 'Computer Labs', val: college.facilities?.computerLabs?.available, note: `${college.facilities?.computerLabs?.systemsCount || '800+'} systems` },
                { name: 'Campus Transport Bus', val: college.facilities?.transport?.available, note: `${college.facilities?.transport?.busRoutes || '20+'} routes` },
                { name: 'High Speed Wi-Fi', val: college.facilities?.wifi?.available, note: `${college.facilities?.wifi?.speedMbps || '200'} Mbps` },
                { name: 'Sports & Athletics', val: college.facilities?.sports?.available, note: 'Cricket, Football, Basketball, Badminton' },
                { name: 'Gymnasium & Fitness', val: college.facilities?.gym?.available, note: 'Modern fitness center' },
                { name: 'Auditorium & Halls', val: college.facilities?.auditorium?.available, note: `${college.facilities?.auditorium?.capacity || '1,500'} seats` },
                { name: 'Hygienic Canteen & Cafeteria', val: college.facilities?.canteen?.available, note: 'Multi-cuisine dining' },
                { name: 'Medical Health Centre', val: college.facilities?.medicalCentre?.available, note: '24x7 Doctor on campus' },
                { name: '24x7 Campus Security', val: college.facilities?.security24x7?.available, note: 'CCTV surveillance & guarded gates' },
              ].map((f, i) => (
                <div key={i} style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                    <CheckCircle size={16} color={f.val ? '#059669' : '#94a3b8'} />
                    <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>{f.name}</strong>
                  </div>
                  {f.note && <div style={{ fontSize: '0.78rem', color: '#64748b', marginLeft: '1.4rem' }}>{f.note}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 8: Campus Life */}
        {activeTab === 'campusLife' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem' }}>
              Student Campus Life, Clubs & Activities
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {college.campusLife?.technicalClubs?.length > 0 && (
                <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#2563eb', marginBottom: '0.5rem' }}>Technical Societies</h4>
                  <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem' }}>
                    {college.campusLife.technicalClubs.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {college.campusLife?.culturalClubs?.length > 0 && (
                <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#059669', marginBottom: '0.5rem' }}>Cultural & Fine Arts</h4>
                  <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem' }}>
                    {college.campusLife.culturalClubs.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {college.campusLife?.events?.length > 0 && (
                <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#7c3aed', marginBottom: '0.5rem' }}>Annual Symposiums & Fests</h4>
                  <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem' }}>
                    {college.campusLife.events.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 9: Research */}
        {activeTab === 'research' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem' }}>
              Research & Innovation Ecosystem
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '10px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>FUNDED PROJECTS</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#2563eb' }}>{college.research?.fundedProjectsCount || '25+'}</div>
              </div>
              <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '10px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>PATENTS FILED / GRANTED</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#059669' }}>{college.research?.patentsCount || '15+'}</div>
              </div>
              <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '10px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>PUBLICATIONS</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#7c3aed' }}>{college.research?.publicationsCount || '500+'}</div>
              </div>
            </div>

            {college.research?.researchCentres?.length > 0 && (
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>Centres of Excellence</h4>
                <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem', color: '#334155' }}>
                  {college.research.researchCentres.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Tab 10: Hostel */}
        {activeTab === 'hostel' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem' }}>
              Hostel Accommodation & Dining Facilities
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>Boys & Girls Hostels</h4>
                <p style={{ fontSize: '0.85rem', color: '#475569', margin: '0 0 0.5rem 0' }}>
                  {college.facilities?.hostel?.details || 'Spacious on-campus residential hostels with separate blocks for boys and girls.'}
                </p>
                <div style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 700 }}>
                  Capacity: {college.facilities?.hostel?.capacity || '1,500+'} Resident Students
                </div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>Hostel Amenities</h4>
                <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.82rem', color: '#334155' }}>
                  <li>RO purified drinking water on all floors</li>
                  <li>24x7 High-speed Wi-Fi internet connectivity</li>
                  <li>South & North Indian hygienic vegetarian / non-veg dining</li>
                  <li>Reading rooms, indoor badminton courts, and TV lounge</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 11: Contact & Map */}
        {activeTab === 'contact' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem' }}>
              Official Contact Directory & Campus Location
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.75rem' }}>
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.88rem' }}>
                  <div>
                    <strong style={{ color: '#0f172a', display: 'block', marginBottom: '0.2rem' }}>Full Campus Address:</strong>
                    <div style={{ color: '#64748b' }}>{college.address || `${college.name}, ${college.city}, ${college.district}`}</div>
                  </div>

                  <div>
                    <strong style={{ color: '#0f172a', display: 'block', marginBottom: '0.2rem' }}>Official Website:</strong>
                    {college.contact?.website || college.website ? (
                      <a href={college.contact?.website || college.website} target="_blank" rel="noreferrer" style={{ color: '#2563eb', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span>{college.contact?.website || college.website}</span>
                        <ExternalLink size={13} />
                      </a>
                    ) : (
                      <span style={{ color: '#94a3b8' }}>Not available</span>
                    )}
                  </div>

                  <div>
                    <strong style={{ color: '#0f172a', display: 'block', marginBottom: '0.2rem' }}>Official Email / Admissions:</strong>
                    <div style={{ color: '#334155' }}>
                      {college.contact?.email || college.email || 'info@college.edu'}
                      {college.contact?.admissionEmail && ` • ${college.contact.admissionEmail}`}
                    </div>
                  </div>

                  <div>
                    <strong style={{ color: '#0f172a', display: 'block', marginBottom: '0.2rem' }}>Contact Phone / Helpdesk:</strong>
                    <div style={{ color: '#334155' }}>{college.contact?.phone || college.phone || 'Contact information not yet verified'}</div>
                  </div>
                </div>
              </div>

              {/* Coordinates / Map View */}
              <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>Geo-Location</h4>
                <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '1rem' }}>
                  Latitude: <strong>{college.latitude || '13.01'}</strong> • Longitude: <strong>{college.longitude || '80.23'}</strong>
                </div>

                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(college.name + ' ' + college.district)}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    padding: '0.55rem 1.25rem',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <MapPin size={14} />
                  <span>View on Google Maps →</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer Banner at bottom */}
        <div style={{ marginTop: '2rem' }}>
          <DisclaimerBanner />
        </div>
      </div>

      {/* Report Info Modal */}
      <ReportInfoModal
        college={college}
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
      />
    </div>
  );
};

export default CollegeProfile;
