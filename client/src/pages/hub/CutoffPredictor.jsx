import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Sparkles,
  Search,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Building,
  MapPin,
  Briefcase,
  Scale,
  ArrowRight,
  ShieldAlert,
  RotateCcw,
  SlidersHorizontal,
  GraduationCap,
} from 'lucide-react';
import tneaService from '../../services/tneaService';
import { useCompare } from '../../context/CompareContext';
import DisclaimerBanner from '../../components/hub/DisclaimerBanner';

export const CutoffPredictor = () => {
  const [searchParams] = useSearchParams();
  const { addCollegeToCompare, isCollegeCompared } = useCompare();

  const [cutoffScore, setCutoffScore] = useState(searchParams.get('score') || '190.00');
  const [community, setCommunity] = useState(searchParams.get('community') || 'OC');
  const [selectedDepts, setSelectedDepts] = useState(['All']);
  const [selectedDistricts, setSelectedDistricts] = useState(['All']);
  const [academicYear, setAcademicYear] = useState(2025);

  const [departmentsList, setDepartmentsList] = useState([]);
  const [districtsList, setDistrictsList] = useState([]);
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeChanceTab, setActiveChanceTab] = useState('good'); // 'good', 'moderate', 'low'

  // Load Metadata
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

  // Run prediction on submit or load if query params present
  const runPrediction = async (e) => {
    if (e) e.preventDefault();
    if (!cutoffScore || Number(cutoffScore) < 50 || Number(cutoffScore) > 200) {
      alert('Please enter a valid cutoff score between 50.00 and 200.00');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        cutoffMark: Number(cutoffScore),
        community,
        preferredDepartments: selectedDepts,
        preferredDistricts: selectedDistricts,
        academicYear: Number(academicYear),
      };

      const res = await tneaService.predictCutoff(payload);
      if (res?.success) {
        setPredictions(res);
      }
    } catch (err) {
      console.error('Failed to run predictor', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams.get('score')) {
      runPrediction();
    }
  }, []);

  const toggleDept = (code) => {
    if (code === 'All') {
      setSelectedDepts(['All']);
      return;
    }
    const current = selectedDepts.filter((c) => c !== 'All');
    if (current.includes(code)) {
      const filtered = current.filter((c) => c !== code);
      setSelectedDepts(filtered.length === 0 ? ['All'] : filtered);
    } else {
      setSelectedDepts([...current, code]);
    }
  };

  const toggleDistrict = (dist) => {
    if (dist === 'All') {
      setSelectedDistricts(['All']);
      return;
    }
    const current = selectedDistricts.filter((d) => d !== 'All');
    if (current.includes(dist)) {
      const filtered = current.filter((d) => d !== dist);
      setSelectedDistricts(filtered.length === 0 ? ['All'] : filtered);
    } else {
      setSelectedDistricts([...current, dist]);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '1.5rem 0 4rem' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2563eb', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
            <Sparkles size={18} />
            <span>AI-Assisted Admission Probability Engine</span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
            TNEA Cutoff Chance Predictor
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '0.25rem' }}>
            Evaluate historical cutoff boundaries for your exact +2 PCM score and community to discover realistic engineering options.
          </p>
        </div>

        {/* Mandatory Prominent Disclaimer Banner */}
        <div
          style={{
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderLeft: '5px solid #2563eb',
            borderRadius: '8px',
            padding: '1rem 1.25rem',
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <ShieldAlert size={22} color="#1d4ed8" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '0.88rem', color: '#1e3a8a', fontWeight: 600 }}>
            "This is an estimate based on historical cutoff data and does not guarantee admission." Always refer to official TNEA counseling rank lists.
          </div>
        </div>

        {/* Input Parameters Form Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '1.75rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
          }}
        >
          <form onSubmit={runPrediction}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
              {/* Engineering Cutoff Input */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
                  Engineering Cutoff Mark (Out of 200) <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="50"
                  max="200"
                  placeholder="e.g. 192.50"
                  value={cutoffScore}
                  onChange={(e) => setCutoffScore(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    border: '2px solid #2563eb',
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    color: '#0f172a',
                    backgroundColor: '#eff6ff',
                  }}
                />
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.25rem' }}>
                  Maths (100) + Physics (50) + Chemistry (50)
                </div>
              </div>

              {/* Community Category */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
                  Reservation Community <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <select
                  value={community}
                  onChange={(e) => setCommunity(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    backgroundColor: '#ffffff',
                  }}
                >
                  <option value="OC">OC - Open Competition (31%)</option>
                  <option value="BC">BC - Backward Class (26.5%)</option>
                  <option value="BCM">BCM - Backward Class Muslim (3.5%)</option>
                  <option value="MBC/DNC">MBC / DNC (20%)</option>
                  <option value="SC">SC - Scheduled Caste (15%)</option>
                  <option value="SCA">SCA - SC Arunthathiyar (3%)</option>
                  <option value="ST">ST - Scheduled Tribe (1%)</option>
                </select>
              </div>

              {/* Reference Year */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
                  Reference Academic Year
                </label>
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.95rem',
                    backgroundColor: '#ffffff',
                    fontWeight: 700,
                  }}
                >
                  <option value={2025}>2025 (Latest Admission Cycle)</option>
                  <option value={2024}>2024 (Previous Benchmark)</option>
                </select>
              </div>
            </div>

            {/* Department Preference Pills */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
                Preferred Engineering Branches:
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                <button
                  type="button"
                  onClick={() => toggleDept('All')}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '20px',
                    border: '1px solid',
                    borderColor: selectedDepts.includes('All') ? '#2563eb' : '#cbd5e1',
                    backgroundColor: selectedDepts.includes('All') ? '#2563eb' : '#ffffff',
                    color: selectedDepts.includes('All') ? '#ffffff' : '#475569',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  All Branches
                </button>
                {departmentsList.map((dept) => {
                  const active = selectedDepts.includes(dept.code);
                  return (
                    <button
                      key={dept.code}
                      type="button"
                      onClick={() => toggleDept(dept.code)}
                      style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: '20px',
                        border: '1px solid',
                        borderColor: active ? '#2563eb' : '#cbd5e1',
                        backgroundColor: active ? '#eff6ff' : '#ffffff',
                        color: active ? '#1d4ed8' : '#475569',
                        fontSize: '0.8rem',
                        fontWeight: active ? 700 : 500,
                        cursor: 'pointer',
                      }}
                    >
                      {dept.code} ({dept.name})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* District Preference Pills */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
                Preferred Districts:
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                <button
                  type="button"
                  onClick={() => toggleDistrict('All')}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '20px',
                    border: '1px solid',
                    borderColor: selectedDistricts.includes('All') ? '#2563eb' : '#cbd5e1',
                    backgroundColor: selectedDistricts.includes('All') ? '#2563eb' : '#ffffff',
                    color: selectedDistricts.includes('All') ? '#ffffff' : '#475569',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  All Tamil Nadu
                </button>
                {districtsList.map((d) => {
                  const active = selectedDistricts.includes(d.name);
                  return (
                    <button
                      key={d.name}
                      type="button"
                      onClick={() => toggleDistrict(d.name)}
                      style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: '20px',
                        border: '1px solid',
                        borderColor: active ? '#2563eb' : '#cbd5e1',
                        backgroundColor: active ? '#eff6ff' : '#ffffff',
                        color: active ? '#1d4ed8' : '#475569',
                        fontSize: '0.8rem',
                        fontWeight: active ? 700 : 500,
                        cursor: 'pointer',
                      }}
                    >
                      {d.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.85rem 2rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 12px rgba(15,23,42,0.2)',
                }}
              >
                <Sparkles size={18} color="#38bdf8" />
                <span>{loading ? 'Analyzing Historical Cutoffs...' : 'Calculate My College Chances'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Prediction Results Display */}
        {predictions && (
          <div>
            {/* Chance Summary Tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              {/* Good Chance Card / Tab */}
              <div
                onClick={() => setActiveChanceTab('good')}
                style={{
                  backgroundColor: activeChanceTab === 'good' ? '#ecfdf5' : '#ffffff',
                  border: '2px solid',
                  borderColor: activeChanceTab === 'good' ? '#10b981' : '#e2e8f0',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#059669', fontWeight: 800, fontSize: '1.05rem' }}>
                    <CheckCircle2 size={20} />
                    <span>Good Chance</span>
                  </div>
                  <span style={{ backgroundColor: '#10b981', color: '#ffffff', padding: '0.15rem 0.55rem', borderRadius: '999px', fontWeight: 800, fontSize: '0.85rem' }}>
                    {predictions.results?.goodChance?.length || 0}
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#047857', margin: 0, lineHeight: 1.4 }}>
                  Cutoff mark comfortably higher than historical closing score. High admission probability.
                </p>
              </div>

              {/* Moderate Chance Card / Tab */}
              <div
                onClick={() => setActiveChanceTab('moderate')}
                style={{
                  backgroundColor: activeChanceTab === 'moderate' ? '#fffbeb' : '#ffffff',
                  border: '2px solid',
                  borderColor: activeChanceTab === 'moderate' ? '#f59e0b' : '#e2e8f0',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#d97706', fontWeight: 800, fontSize: '1.05rem' }}>
                    <AlertCircle size={20} />
                    <span>Moderate Chance</span>
                  </div>
                  <span style={{ backgroundColor: '#f59e0b', color: '#ffffff', padding: '0.15rem 0.55rem', borderRadius: '999px', fontWeight: 800, fontSize: '0.85rem' }}>
                    {predictions.results?.moderateChance?.length || 0}
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#b45309', margin: 0, lineHeight: 1.4 }}>
                  Cutoff within close competitive proximity (+/- 1.5 marks). Target priority choice.
                </p>
              </div>

              {/* Low Chance / Reach Card / Tab */}
              <div
                onClick={() => setActiveChanceTab('low')}
                style={{
                  backgroundColor: activeChanceTab === 'low' ? '#fef2f2' : '#ffffff',
                  border: '2px solid',
                  borderColor: activeChanceTab === 'low' ? '#ef4444' : '#e2e8f0',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#dc2626', fontWeight: 800, fontSize: '1.05rem' }}>
                    <AlertTriangle size={20} />
                    <span>Dream / Reach</span>
                  </div>
                  <span style={{ backgroundColor: '#ef4444', color: '#ffffff', padding: '0.15rem 0.55rem', borderRadius: '999px', fontWeight: 800, fontSize: '0.85rem' }}>
                    {predictions.results?.lowChance?.length || 0}
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#b91c1c', margin: 0, lineHeight: 1.4 }}>
                  Cutoff slightly below historical benchmark. Keep as aspirational choices in choice list.
                </p>
              </div>
            </div>

            {/* Results Table for Selected Chance Tier */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
                  {activeChanceTab === 'good' && '🟢 Recommended Colleges (Good Chance)'}
                  {activeChanceTab === 'moderate' && '🟡 Target Colleges (Moderate Chance)'}
                  {activeChanceTab === 'low' && '🔴 Aspirational Colleges (Dream / Reach Chance)'}
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
                  Showing options evaluated for Cutoff <strong>{cutoffScore}</strong> and Category <strong>{community}</strong>.
                </p>
              </div>

              {(() => {
                const list =
                  activeChanceTab === 'good'
                    ? predictions.results?.goodChance || []
                    : activeChanceTab === 'moderate'
                    ? predictions.results?.moderateChance || []
                    : predictions.results?.lowChance || [];

                if (list.length === 0) {
                  return (
                    <div style={{ padding: '2.5rem', textAlign: 'center', color: '#64748b' }}>
                      No colleges found under this chance tier for the current filter criteria.
                    </div>
                  );
                }

                return (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.15rem' }}>
                    {list.map((item) => (
                      <div
                        key={item.cutoffId}
                        style={{
                          backgroundColor: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '1.25rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <span style={{ backgroundColor: '#1e293b', color: '#ffffff', fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                              Code: {item.collegeCode}
                            </span>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: item.difference >= 0 ? '#059669' : '#dc2626', backgroundColor: item.difference >= 0 ? '#ecfdf5' : '#fef2f2', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                              {item.difference >= 0 ? `+${item.difference}` : item.difference} marks diff
                            </span>
                          </div>

                          <Link to={`/colleges/${item.collegeCode}`} style={{ textDecoration: 'none' }}>
                            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.3, marginBottom: '0.35rem' }}>
                              {item.collegeName}
                            </h4>
                          </Link>

                          <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <MapPin size={13} />
                            <span>{item.district}</span>
                          </div>

                          <div style={{ backgroundColor: '#ffffff', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '0.75rem' }}>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Branch:</div>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#2563eb' }}>
                              {item.departmentCode} - {item.departmentName}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.35rem', fontSize: '0.78rem', color: '#475569' }}>
                              <span>Historical Cutoff: <strong>{item.historicalCutoff.toFixed(2)}</strong></span>
                              <span>Your Score: <strong>{item.studentCutoff.toFixed(2)}</strong></span>
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem' }}>
                          <button
                            onClick={() => addCollegeToCompare({ code: item.collegeCode, name: item.collegeName, district: item.district, collegeType: item.collegeType })}
                            style={{
                              backgroundColor: '#ffffff',
                              border: '1px solid #cbd5e1',
                              padding: '0.35rem 0.65rem',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                            }}
                          >
                            <Scale size={13} />
                            <span>Compare</span>
                          </button>

                          <Link
                            to={`/colleges/${item.collegeCode}`}
                            style={{
                              backgroundColor: '#2563eb',
                              color: '#ffffff',
                              padding: '0.35rem 0.85rem',
                              borderRadius: '6px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              textDecoration: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                            }}
                          >
                            <span>Profile & Seats</span>
                            <ArrowRight size={13} />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CutoffPredictor;
