import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  BarChart3,
  Search,
  Filter,
  Download,
  RotateCcw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Award,
} from 'lucide-react';
import tneaService, { getCutoffValue } from '../../services/tneaService';
import DisclaimerBanner from '../../components/hub/DisclaimerBanner';

export { getCutoffValue };

export const CutoffExplorer = () => {
  const [searchParams] = useSearchParams();

  const [year, setYear] = useState(searchParams.get('year') || '2025');
  const [collegeCode, setCollegeCode] = useState(searchParams.get('collegeCode') || '');
  const [collegeName, setCollegeName] = useState(searchParams.get('search') || '');
  const [departmentCode, setDepartmentCode] = useState(searchParams.get('departmentCode') || 'All');
  const [round, setRound] = useState(searchParams.get('round') || 'Round 1');
  const [district, setDistrict] = useState(searchParams.get('district') || 'All');
  const [community, setCommunity] = useState('ocCutoff');
  const [minCutoff, setMinCutoff] = useState('');
  const [maxCutoff, setMaxCutoff] = useState('');
  const [sortBy, setSortBy] = useState('ocCutoff');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);

  const [cutoffs, setCutoffs] = useState([]);
  const [departmentsList, setDepartmentsList] = useState([]);
  const [districtsList, setDistrictsList] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, page: 1, limit: 25 });
  const [loading, setLoading] = useState(true);

  // Load departments & districts metadata
  useEffect(() => {
    const loadMeta = async () => {
      try {
        const [deptRes, distRes] = await Promise.all([
          tneaService.getDepartments(),
          tneaService.getDistricts(),
        ]);
        if (deptRes?.success) setDepartmentsList(deptRes.data);
        if (distRes?.success) setDistrictsList(distRes.data);
      } catch (e) {
        console.error(e);
      }
    };
    loadMeta();
  }, []);

  // Fetch Cutoff Data
  useEffect(() => {
    const fetchCutoffsData = async () => {
      setLoading(true);
      try {
        const params = {
          sortBy,
          sortOrder,
          page,
          limit: 25,
        };

        if (year && year !== 'All') {
          params.academicYear = year;
          params.year = year;
        }
        if (round && round !== 'All') {
          params.round = round;
          params.counsellingRound = round === 'Round 1' ? 1 : round === 'Round 2' ? 2 : round === 'Round 3' ? 3 : round;
        }
        if (community) params.community = community;
        if (collegeCode) params.collegeCode = collegeCode;
        if (collegeName) params.collegeName = collegeName;
        if (departmentCode !== 'All') params.departmentCode = departmentCode;
        if (district !== 'All') params.district = district;
        if (minCutoff) params.minCutoff = minCutoff;
        if (maxCutoff) params.maxCutoff = maxCutoff;

        const res = await tneaService.getCutoffs(params);
        if (res?.success) {
          setCutoffs(res.data);
          if (res.pagination) setPagination(res.pagination);
        }
      } catch (err) {
        console.error('Failed to load cutoffs', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCutoffsData();
  }, [year, collegeCode, collegeName, departmentCode, round, district, community, minCutoff, maxCutoff, sortBy, sortOrder, page]);

  const formatCutoff = (row, communityKey) => {
    const val = getCutoffValue(row, communityKey);
    if (val === null) {
      return <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.8rem' }}>Unavailable</span>;
    }
    return Number(val).toFixed(2);
  };

  const formatRank = (val) => {
    if (val === null || val === undefined || isNaN(Number(val))) return '—';
    return `#${val}`;
  };

  const handleReset = () => {
    setYear('2025');
    setCollegeCode('');
    setCollegeName('');
    setDepartmentCode('All');
    setRound('Round 1');
    setDistrict('All');
    setCommunity('ocCutoff');
    setMinCutoff('');
    setMaxCutoff('');
    setSortBy('ocCutoff');
    setSortOrder('desc');
    setPage(1);
  };

  const handleExportCSV = () => {
    if (cutoffs.length === 0) return;
    const headers = ['Academic Year', 'College Code', 'College Name', 'District', 'Department', 'Round', 'OC Cutoff', 'BC Cutoff', 'BCM Cutoff', 'MBC Cutoff', 'SC Cutoff', 'SCA Cutoff', 'ST Cutoff', 'Closing Rank', 'Data Status'];
    const rows = cutoffs.map((c) => [
      c.academicYear,
      c.collegeCode,
      `"${c.collegeName}"`,
      `"${c.district || ''}"`,
      c.departmentCode,
      c.round || `Round ${c.counsellingRound}`,
      getCutoffValue(c, 'OC') !== null ? Number(getCutoffValue(c, 'OC')).toFixed(2) : 'Unavailable',
      getCutoffValue(c, 'BC') !== null ? Number(getCutoffValue(c, 'BC')).toFixed(2) : 'Unavailable',
      getCutoffValue(c, 'BCM') !== null ? Number(getCutoffValue(c, 'BCM')).toFixed(2) : 'Unavailable',
      getCutoffValue(c, 'MBC') !== null ? Number(getCutoffValue(c, 'MBC')).toFixed(2) : 'Unavailable',
      getCutoffValue(c, 'SC') !== null ? Number(getCutoffValue(c, 'SC')).toFixed(2) : 'Unavailable',
      getCutoffValue(c, 'SCA') !== null ? Number(getCutoffValue(c, 'SCA')).toFixed(2) : 'Unavailable',
      getCutoffValue(c, 'ST') !== null ? Number(getCutoffValue(c, 'ST')).toFixed(2) : 'Unavailable',
      c.closingRank ?? '—',
      c.dataStatus || 'OFFICIAL',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TNEA_Cutoffs_${year}_Round_${round}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '1.5rem 0 4rem' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#059669', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
            <BarChart3 size={18} />
            <span>TNEA Official Multi-Year Admissions Dataset</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
                TNEA Cutoff Dataset Explorer
              </h1>
              <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '0.25rem' }}>
                Search and analyze official historical cutoff marks across academic years <strong>2021 to 2026</strong> across Round 1, Round 2, and Round 3 for all reservation categories.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={handleExportCSV}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#334155',
                  border: '1px solid #cbd5e1',
                  padding: '0.5rem 0.95rem',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <Download size={14} />
                <span>Export Dataset (CSV)</span>
              </button>

              <Link
                to="/predictor"
                style={{
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <Sparkles size={14} color="#38bdf8" />
                <span>Cutoff Chance Predictor</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <DisclaimerBanner customText="Official historical cutoff records reflect Directorate of Technical Education (DOTE) allotment archives. Seat availability figures reflect demo / simulated estimates for development." />

        {/* Filters Box */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '1.25rem',
            marginBottom: '1.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: '#0f172a', fontSize: '0.92rem' }}>
              <SlidersHorizontal size={15} />
              <span>Cutoff Search & Filter Parameters</span>
            </div>
            <button
              onClick={handleReset}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#dc2626',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem',
              }}
            >
              <RotateCcw size={12} />
              <span>Reset Filters</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem' }}>
            {/* Academic Year */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>Academic Year</label>
              <select
                value={year}
                onChange={(e) => {
                  setYear(e.target.value);
                  setPage(1);
                }}
                style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 700 }}
              >
                <option value="2026">2026 (Projected Trends)</option>
                <option value="2025">2025 (Current Cycle)</option>
                <option value="2024">2024 (Historical)</option>
                <option value="2023">2023 (Historical)</option>
                <option value="2022">2022 (Historical)</option>
                <option value="2021">2021 (Historical)</option>
                <option value="All">All Years</option>
              </select>
            </div>

            {/* Counselling Round */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>Counselling Round</label>
              <select
                value={round}
                onChange={(e) => {
                  setRound(e.target.value);
                  setPage(1);
                }}
                style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              >
                <option value="Round 1">Round 1 (High Cutoff)</option>
                <option value="Round 2">Round 2</option>
                <option value="Round 3">Round 3</option>
                <option value="All">All Rounds</option>
              </select>
            </div>

            {/* Department */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>Department / Branch</label>
              <select
                value={departmentCode}
                onChange={(e) => {
                  setDepartmentCode(e.target.value);
                  setPage(1);
                }}
                style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              >
                <option value="All">All Departments</option>
                {departmentsList.map((d) => {
                  const code = d.code || d.departmentCode || d.branchCode || (typeof d === 'string' ? d : '');
                  const name = d.name || d.departmentName || d.branchName || code;
                  return (
                    <option key={code} value={code}>
                      {code} - {name}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* District */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>District</label>
              <select
                value={district}
                onChange={(e) => {
                  setDistrict(e.target.value);
                  setPage(1);
                }}
                style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              >
                <option value="All">All Districts</option>
                {districtsList.map((d) => {
                  const name = typeof d === 'string' ? d : (d.name || d._id || String(d));
                  return (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Community Filter */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>Community Quota</label>
              <select
                value={community}
                onChange={(e) => {
                  setCommunity(e.target.value);
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              >
                <option value="ocCutoff">OC (Open Competition)</option>
                <option value="bcCutoff">BC (Backward Class)</option>
                <option value="bcmCutoff">BCM (Backward Class Muslim)</option>
                <option value="mbcCutoff">MBC/DNC (Most Backward Class)</option>
                <option value="scCutoff">SC (Scheduled Caste)</option>
                <option value="scaCutoff">SCA (SC Arunthathiyar)</option>
                <option value="stCutoff">ST (Scheduled Tribe)</option>
              </select>
            </div>

            {/* College Search / Code */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>College Name or Code</label>
              <input
                type="text"
                placeholder="e.g. 0001 or PSG"
                value={collegeName}
                onChange={(e) => {
                  setCollegeName(e.target.value);
                  setPage(1);
                }}
                style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              />
            </div>

            {/* Cutoff Range */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>Min Cutoff (out of 200)</label>
              <input
                type="number"
                step="0.5"
                min="50"
                max="200"
                placeholder="Min e.g. 180"
                value={minCutoff}
                onChange={(e) => {
                  setMinCutoff(e.target.value);
                  setPage(1);
                }}
                style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              />
            </div>
          </div>
        </div>

        {/* Cutoff Table Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          {loading ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
              <h3>Loading cutoff dataset records...</h3>
            </div>
          ) : cutoffs.length === 0 ? (
            <div style={{ padding: '3.5rem', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                Official cutoff data is not available for this selection.
              </h3>
              <p style={{ color: '#64748b', marginBottom: '1rem', fontSize: '0.9rem' }}>
                Try another year, round, college, or branch.
              </p>
              <button
                onClick={handleReset}
                style={{
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#0f172a', color: '#f8fafc', textAlign: 'center' }}>
                    <th style={{ padding: '0.85rem 1rem', textAlign: 'left' }}>Year</th>
                    <th style={{ padding: '0.85rem 1rem', textAlign: 'left' }}>Code</th>
                    <th style={{ padding: '0.85rem 1rem', textAlign: 'left' }}>College Name</th>
                    <th style={{ padding: '0.85rem 1rem', textAlign: 'left' }}>Branch</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Round</th>
                    <th style={{ padding: '0.85rem 1rem', backgroundColor: community === 'ocCutoff' ? '#1e3a8a' : 'transparent', color: community === 'ocCutoff' ? '#93c5fd' : '#f8fafc' }}>OC Cutoff</th>
                    <th style={{ padding: '0.85rem 1rem', backgroundColor: community === 'bcCutoff' ? '#1e3a8a' : 'transparent', color: community === 'bcCutoff' ? '#93c5fd' : '#f8fafc' }}>BC Cutoff</th>
                    <th style={{ padding: '0.85rem 1rem', backgroundColor: community === 'bcmCutoff' ? '#1e3a8a' : 'transparent', color: community === 'bcmCutoff' ? '#93c5fd' : '#f8fafc' }}>BCM Cutoff</th>
                    <th style={{ padding: '0.85rem 1rem', backgroundColor: community === 'mbcCutoff' ? '#1e3a8a' : 'transparent', color: community === 'mbcCutoff' ? '#93c5fd' : '#f8fafc' }}>MBC/DNC</th>
                    <th style={{ padding: '0.85rem 1rem', backgroundColor: community === 'scCutoff' ? '#1e3a8a' : 'transparent', color: community === 'scCutoff' ? '#93c5fd' : '#f8fafc' }}>SC Cutoff</th>
                    <th style={{ padding: '0.85rem 1rem', backgroundColor: community === 'scaCutoff' ? '#1e3a8a' : 'transparent', color: community === 'scaCutoff' ? '#93c5fd' : '#f8fafc' }}>SCA Cutoff</th>
                    <th style={{ padding: '0.85rem 1rem', backgroundColor: community === 'stCutoff' ? '#1e3a8a' : 'transparent', color: community === 'stCutoff' ? '#93c5fd' : '#f8fafc' }}>ST Cutoff</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Rank</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {cutoffs.map((row, idx) => (
                    <tr
                      key={row._id}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        textAlign: 'center',
                        backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                      }}
                    >
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#64748b' }}>
                        {row.academicYear}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 700, color: '#2563eb' }}>
                        <Link to={`/colleges/${row.collegeCode}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
                          {row.collegeCode}
                        </Link>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#0f172a', maxWidth: '260px' }}>
                        <Link to={`/colleges/${row.collegeCode}`} style={{ color: '#0f172a', textDecoration: 'none' }}>
                          {row.collegeName}
                        </Link>
                        {row.district && (
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{row.district}</div>
                        )}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 700 }}>
                        <span style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '0.15rem 0.4rem', borderRadius: '4px', marginRight: '0.35rem' }}>
                          {row.departmentCode}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: '#475569' }}>{row.departmentName}</span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: '#64748b', fontSize: '0.78rem' }}>
                        {row.round || `Round ${row.counsellingRound}`}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: community === 'ocCutoff' ? 800 : 600, backgroundColor: community === 'ocCutoff' ? '#eff6ff' : 'transparent', color: community === 'ocCutoff' ? '#1d4ed8' : '#0f172a' }}>
                        {formatCutoff(row, 'OC')}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: community === 'bcCutoff' ? 800 : 600, backgroundColor: community === 'bcCutoff' ? '#eff6ff' : 'transparent', color: community === 'bcCutoff' ? '#1d4ed8' : '#0f172a' }}>
                        {formatCutoff(row, 'BC')}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: community === 'bcmCutoff' ? 800 : 600, backgroundColor: community === 'bcmCutoff' ? '#eff6ff' : 'transparent', color: community === 'bcmCutoff' ? '#1d4ed8' : '#0f172a' }}>
                        {formatCutoff(row, 'BCM')}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: community === 'mbcCutoff' ? 800 : 600, backgroundColor: community === 'mbcCutoff' ? '#eff6ff' : 'transparent', color: community === 'mbcCutoff' ? '#1d4ed8' : '#0f172a' }}>
                        {formatCutoff(row, 'MBC')}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: community === 'scCutoff' ? 800 : 600, backgroundColor: community === 'scCutoff' ? '#eff6ff' : 'transparent', color: community === 'scCutoff' ? '#1d4ed8' : '#0f172a' }}>
                        {formatCutoff(row, 'SC')}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: community === 'scaCutoff' ? 800 : 600, backgroundColor: community === 'scaCutoff' ? '#eff6ff' : 'transparent', color: community === 'scaCutoff' ? '#1d4ed8' : '#0f172a' }}>
                        {formatCutoff(row, 'SCA')}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: community === 'stCutoff' ? 800 : 600, backgroundColor: community === 'stCutoff' ? '#eff6ff' : 'transparent', color: community === 'stCutoff' ? '#1d4ed8' : '#0f172a' }}>
                        {formatCutoff(row, 'ST')}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: '#64748b', fontSize: '0.78rem' }}>
                        {formatRank(row.closingRank)}
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '0.2rem 0.45rem',
                            borderRadius: '4px',
                            backgroundColor:
                              Number(row.academicYear) === 2026 || row.dataStatus === 'PROJECTED'
                                ? '#eff6ff'
                                : row.dataStatus === 'OFFICIAL'
                                ? '#ecfdf5'
                                : '#f1f5f9',
                            color:
                              Number(row.academicYear) === 2026 || row.dataStatus === 'PROJECTED'
                                ? '#1d4ed8'
                                : row.dataStatus === 'OFFICIAL'
                                ? '#059669'
                                : '#64748b',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {Number(row.academicYear) === 2026 ? 'PROJECTED' : (row.dataStatus || 'OFFICIAL')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                Showing page <strong>{page}</strong> of <strong>{pagination.totalPages}</strong> ({pagination.total} total records)
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: page === 1 ? '#f1f5f9' : '#ffffff',
                    cursor: page === 1 ? 'not-allowed' : 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                  }}
                >
                  Previous
                </button>
                <button
                  disabled={page === pagination.totalPages}
                  onClick={() => setPage(page + 1)}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: page === pagination.totalPages ? '#f1f5f9' : '#ffffff',
                    cursor: page === pagination.totalPages ? 'not-allowed' : 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CutoffExplorer;
