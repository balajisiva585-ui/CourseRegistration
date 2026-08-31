import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  BarChart3,
  Layers,
  Scale,
  FileText,
  DollarSign,
  Sparkles,
  Award,
  Compass,
  MapPin,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  Users,
  Building,
  GraduationCap,
  Calendar,
} from 'lucide-react';
import tneaService from '../../services/tneaService';
import CollegeCard from '../../components/hub/CollegeCard';
import DisclaimerBanner from '../../components/hub/DisclaimerBanner';

export const HubHome = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredColleges, setFeaturedColleges] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Quick Cutoff Predictor widget state
  const [quickScore, setQuickScore] = useState('');
  const [quickCommunity, setQuickCommunity] = useState('OC');

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [collegesRes, analyticsRes, districtsRes] = await Promise.all([
          tneaService.getColleges({ limit: 6, sortBy: 'nirf' }),
          tneaService.getHubAnalytics(),
          tneaService.getDistrictDirectory(),
        ]);

        if (collegesRes?.success) setFeaturedColleges(collegesRes.data);
        if (analyticsRes?.success) setAnalytics(analyticsRes.data);
        if (districtsRes?.success) setDistricts(districtsRes.data);
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const handleGlobalSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/colleges?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleQuickPredict = (e) => {
    e.preventDefault();
    if (quickScore) {
      navigate(`/predictor?score=${quickScore}&community=${quickCommunity}`);
    }
  };

  const quickActionCards = [
    {
      title: 'Allotment Simulator',
      description: 'Simulate your engineering admissions probability across ordered preferences using 5-year trends.',
      icon: Sparkles,
      path: '/simulator',
      color: '#059669',
      bgColor: '#ecfdf5',
      badge: 'AI Powered',
    },
    {
      title: 'Find Colleges',
      description: 'Search & filter TN engineering colleges by district, type, autonomous status & courses.',
      icon: Search,
      path: '/colleges',
      color: '#2563eb',
      bgColor: '#eff6ff',
    },
    {
      title: 'TNEA Cutoffs',
      description: 'Explore historical multi-year cutoffs (2021 - 2026) across OC, BC, MBC, SC & ST categories.',
      icon: BarChart3,
      path: '/cutoffs',
      color: '#7c3aed',
      bgColor: '#f5f3ff',
    },
    {
      title: 'Seat Availability',
      description: 'Real-time category-wise seat matrix dashboard for Government and Management quotas.',
      icon: Layers,
      path: '/seats',
      color: '#d97706',
      bgColor: '#fffbeb',
    },
    {
      title: 'Compare Colleges',
      description: 'Side-by-side comparison of up to 4 colleges across cutoffs, placements, and facilities.',
      icon: Scale,
      path: '/compare',
      color: '#0284c7',
      bgColor: '#f0f9ff',
    },
    {
      title: 'Applications',
      description: 'Track open counselling schedules, management quota links, eligibility & deadlines.',
      icon: FileText,
      path: '/applications',
      color: '#dc2626',
      bgColor: '#fef2f2',
    },
  ];

  const popularBranches = [
    { code: 'AD', name: 'AI & Data Science', degree: 'B.Tech.', count: '12+ Colleges', icon: Sparkles },
    { code: 'CS', name: 'Computer Science Engineering', degree: 'B.E.', count: '14+ Colleges', icon: Building },
    { code: 'IT', name: 'Information Technology', degree: 'B.Tech.', count: '12+ Colleges', icon: Compass },
    { code: 'EC', name: 'Electronics & Communication', degree: 'B.E.', count: '14+ Colleges', icon: TrendingUp },
    { code: 'EE', name: 'Electrical & Electronics', degree: 'B.E.', count: '13+ Colleges', icon: Award },
    { code: 'ME', name: 'Mechanical Engineering', degree: 'B.E.', count: '14+ Colleges', icon: BookOpen },
    { code: 'CE', name: 'Civil Engineering', degree: 'B.E.', count: '12+ Colleges', icon: MapPin },
  ];

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '3rem' }}>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          color: '#ffffff',
          padding: '4rem 1.5rem 5rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle decorative glow */}
        <div style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '300px', background: 'radial-gradient(circle, rgba(37,99,235,0.25) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(37,99,235,0.2)', border: '1px solid rgba(59,130,246,0.3)', padding: '0.35rem 0.85rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600, color: '#93c5fd', marginBottom: '1.25rem' }}>
            <GraduationCap size={16} />
            <span>Tamil Nadu Engineering Admissions (TNEA) Counselling & Decision Hub</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '1.25rem', color: '#ffffff' }}>
            Smart Course Registration & Academic Planning
          </h1>

          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: '#cbd5e1', maxWidth: '780px', margin: '0 auto 2.25rem', lineHeight: 1.6 }}>
            Explore colleges, compare TNEA cutoffs, check seat availability and discover the right engineering college for your future.
          </p>

          {/* Large Global Search Box */}
          <form
            onSubmit={handleGlobalSearch}
            style={{
              maxWidth: '720px',
              margin: '0 auto 1.5rem',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '0.4rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ padding: '0 0.85rem', color: '#94a3b8', display: 'flex', alignItems: 'center' }}>
              <Search size={22} />
            </div>
            <input
              type="text"
              placeholder="Search college, department, district or college code (e.g. 0001, CEG, CSE, Coimbatore)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '1rem',
                color: '#0f172a',
                padding: '0.65rem 0.5rem',
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.75rem 1.5rem',
                fontSize: '0.95rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
              }}
            >
              Search Hub
            </button>
          </form>

          {/* Quick tags */}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>
            <span>Popular searches:</span>
            {['CEG Guindy (0001)', 'PSG Tech (2006)', 'SSN (1315)', 'AI & Data Science', 'Coimbatore Colleges', 'Govt Colleges'].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  const cleaned = tag.split(' (')[0];
                  navigate(`/colleges?search=${encodeURIComponent(cleaned)}`);
                }}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#e2e8f0',
                  borderRadius: '6px',
                  padding: '0.2rem 0.6rem',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div style={{ maxWidth: '1440px', margin: '-2.5rem auto 0', padding: '0 1.5rem', position: 'relative', zIndex: 10 }}>
        {/* Quick Action Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
          {quickActionCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                to={card.path}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  padding: '1.25rem',
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  position: 'relative',
                }}
                className="hub-action-card"
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: card.bgColor, color: card.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={22} />
                    </div>
                    {card.badge && (
                      <span style={{ backgroundColor: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', fontSize: '0.68rem', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                        {card.badge}
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>{card.title}</h3>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.45, margin: 0 }}>{card.description}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: card.color, fontSize: '0.8rem', fontWeight: 700, marginTop: '1rem' }}>
                  <span>Explore</span>
                  <ArrowRight size={14} />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Mandatory Disclaimer */}
        <DisclaimerBanner />

        {/* Cutoff Predictor Teaser Card Banner */}
        <section style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.75rem', marginBottom: '2.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', backgroundColor: '#e0f2fe', color: '#0284c7', padding: '0.2rem 0.65rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                <Sparkles size={14} />
                <span>Smart Decision Tool</span>
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.25, marginBottom: '0.5rem' }}>
                Find Colleges Matching Your Cutoff Mark
              </h2>
              <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1rem' }}>
                Enter your +2 Engineering Cutoff (out of 200) and community category to instantly view <strong>Good Chance</strong>, <strong>Moderate Chance</strong>, and <strong>Dream Reach</strong> colleges based on multi-year TNEA admission data.
              </p>
              <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.82rem', color: '#475569' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><CheckCircle2 size={15} color="#10b981" /> No registration required</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><CheckCircle2 size={15} color="#10b981" /> Multi-round trends</span>
              </div>
            </div>

            {/* Quick Predictor Form Box */}
            <form onSubmit={handleQuickPredict} style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>Your Cutoff (Max 200)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="50"
                    max="200"
                    placeholder="e.g. 192.50"
                    value={quickScore}
                    onChange={(e) => setQuickScore(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', fontWeight: 700 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>Community Category</label>
                  <select
                    value={quickCommunity}
                    onChange={(e) => setQuickCommunity(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', backgroundColor: '#ffffff' }}
                  >
                    <option value="OC">OC (Open Competition)</option>
                    <option value="BC">BC (Backward Class)</option>
                    <option value="BCM">BCM (BC Muslim)</option>
                    <option value="MBC/DNC">MBC / DNC</option>
                    <option value="SC">SC (Scheduled Caste)</option>
                    <option value="SCA">SCA (SC Arunthathiyar)</option>
                    <option value="ST">ST (Scheduled Tribe)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                <Sparkles size={16} color="#38bdf8" />
                <span>Estimate My College Chances</span>
              </button>
            </form>
          </div>
        </section>

        {/* Key Metrics / Platform Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            marginBottom: '3rem',
          }}
        >
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#2563eb' }}>{analytics?.summary?.totalColleges || '14+'}</div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Institutions Catalogued</div>
          </div>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#059669' }}>{analytics?.summary?.totalCutoffs || '550+'}</div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Cutoff Data Points (2024-26)</div>
          </div>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#7c3aed' }}>{analytics?.summary?.totalSeatRecords || '180+'}</div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Seat Matrix Breakdowns</div>
          </div>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#d97706' }}>7 Categories</div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>OC, BC, BCM, MBC, SC, SCA, ST</div>
          </div>
        </div>

        {/* Featured Engineering Colleges Grid */}
        <section style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
                Featured Engineering Colleges
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                Top government, aided, and autonomous engineering colleges in Tamil Nadu.
              </p>
            </div>
            <Link
              to="/colleges"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                color: '#2563eb',
                fontSize: '0.85rem',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <span>View All Colleges</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {featuredColleges.map((college) => (
              <CollegeCard key={college.code} college={college} />
            ))}
          </div>
        </section>

        {/* Popular Engineering Branches */}
        <section style={{ marginBottom: '3.5rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
              Explore by Engineering Branch
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
              Discover cutoff trends and college options for top engineering specializations.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {popularBranches.map((branch) => {
              const Icon = branch.icon;
              return (
                <Link
                  key={branch.code}
                  to={`/cutoffs?departmentCode=${branch.code}`}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '1.15rem',
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease',
                  }}
                  className="hub-branch-card"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, backgroundColor: '#f1f5f9', color: '#475569', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                        {branch.degree} ({branch.code})
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>{branch.name}</h3>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{branch.count} offering branch</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Explore Colleges by District */}
        <section style={{ marginBottom: '3.5rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
              Explore Colleges by District
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
              Find premier engineering colleges located across Tamil Nadu districts.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '0.85rem' }}>
            {districts.map((dist, idx) => {
              const districtName = dist.district || dist.name || dist;
              const count = dist.collegeCount !== undefined ? dist.collegeCount : '';
              return (
                <Link
                  key={idx}
                  to={`/colleges?district=${encodeURIComponent(districtName)}`}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '0.85rem 1rem',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <MapPin size={15} color="#2563eb" />
                    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1e293b' }}>{districtName}</span>
                  </div>
                  {count !== '' && (
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, backgroundColor: '#f1f5f9', color: '#64748b', padding: '0.15rem 0.45rem', borderRadius: '999px' }}>
                      {count}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </section>

        {/* TNEA Counselling Roadmap & Guide */}
        <section style={{ backgroundColor: '#0f172a', borderRadius: '16px', color: '#ffffff', padding: '2.5rem 2rem', marginBottom: '2.5rem' }}>
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 2rem' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem', color: '#ffffff' }}>
              How TNEA Engineering Admission Works
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', margin: 0 }}>
              A 4-step streamlined journey from Board Exam Results to Engineering College Allotment.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            <div style={{ backgroundColor: '#1e293b', padding: '1.25rem', borderRadius: '10px', border: '1px solid #334155' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '0.75rem' }}>1</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem', color: '#ffffff' }}>Cutoff Calculation</h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                Cutoff mark is computed out of 200: Maths (100) + Physics (50) + Chemistry (50).
              </p>
            </div>

            <div style={{ backgroundColor: '#1e293b', padding: '1.25rem', borderRadius: '10px', border: '1px solid #334155' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#059669', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '0.75rem' }}>2</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem', color: '#ffffff' }}>Rank List Publication</h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                Directorate of Technical Education (DOTE) releases overall state ranks and community-wise rank lists.
              </p>
            </div>

            <div style={{ backgroundColor: '#1e293b', padding: '1.25rem', borderRadius: '10px', border: '1px solid #334155' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#7c3aed', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '0.75rem' }}>3</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem', color: '#ffffff' }}>Online Choice Filling</h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                Students fill preferential choices of college & branch in assigned rounds based on cutoff ranges.
              </p>
            </div>

            <div style={{ backgroundColor: '#1e293b', padding: '1.25rem', borderRadius: '10px', border: '1px solid #334155' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#d97706', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '0.75rem' }}>4</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem', color: '#ffffff' }}>Seat Allotment & Joining</h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                Provisional allotment order generated. Student confirms seat and completes admission at college.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HubHome;
