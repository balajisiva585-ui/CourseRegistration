import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  Calculator,
  ShieldCheck,
  Award,
  Layers,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Bookmark,
  Share2,
  Building,
  MapPin,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  Info,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCompare } from '../../context/CompareContext';
import tneaService from '../../services/tneaService';
import HistoricalCutoffChart from '../../components/hub/HistoricalCutoffChart';
import ChoiceListBuilder from '../../components/hub/ChoiceListBuilder';
import SmartSuggestionsModal from '../../components/hub/SmartSuggestionsModal';
import ShareSimulationModal from '../../components/hub/ShareSimulationModal';
import DisclaimerBanner from '../../components/hub/DisclaimerBanner';

export const TneaSimulator = () => {
  const { isAuthenticated } = useAuth();
  const { addCollegeToCompare } = useCompare();
  const [searchParams] = useSearchParams();

  // Wizard Step (1: Academic, 2: Community & Ranks, 3: Preferences, 4: Results)
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Academic Inputs
  const [inputMode, setInputMode] = useState('subjects'); // 'subjects' or 'direct'
  const [mathsMarks, setMathsMarks] = useState(95);
  const [physicsMarks, setPhysicsMarks] = useState(92);
  const [chemistryMarks, setChemistryMarks] = useState(90);
  const [directCutoff, setDirectCutoff] = useState(186.0);
  const [effectiveCutoff, setEffectiveCutoff] = useState(186.0);

  // Step 2: Community & Rank Inputs
  const [community, setCommunity] = useState('BC');
  const [specialReservation, setSpecialReservation] = useState('None');
  const [overallRank, setOverallRank] = useState('');
  const [communityRank, setCommunityRank] = useState('');
  const [specialRank, setSpecialRank] = useState('');

  // Step 3: Preferences & Choice List
  const [selectedBranches, setSelectedBranches] = useState(['CS', 'AD', 'IT', 'EC']);
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [counsellingRound, setCounsellingRound] = useState('Round 1');
  const [academicYear, setAcademicYear] = useState(2025);
  const [quota, setQuota] = useState('Government');
  const [preferenceList, setPreferenceList] = useState([]);

  // Data Collections for Choice Builder & Suggestions
  const [allColleges, setAllColleges] = useState([]);
  const [allDepartments, setAllDepartments] = useState([]);
  const [smartSuggestions, setSmartSuggestions] = useState({ safeChoices: [], targetChoices: [], dreamChoices: [] });
  const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);

  // Step 4: Simulation Execution & Results
  const [simulating, setSimulating] = useState(false);
  const [simulationResults, setSimulationResults] = useState(null);
  const [expandedCharts, setExpandedCharts] = useState({});

  // Save & Share State
  const [savingPlan, setSavingPlan] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Load Colleges & Departments on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [collegesRes, deptsRes] = await Promise.all([
          tneaService.getColleges({ limit: 100 }),
          tneaService.getDepartments(),
        ]);
        if (collegesRes?.success) setAllColleges(collegesRes.data);
        if (deptsRes?.success) setAllDepartments(deptsRes.data);
      } catch (err) {
        console.error('Failed to load initial simulation data', err);
      }
    };
    loadInitialData();
  }, []);

  // Update Effective Cutoff when marks change
  useEffect(() => {
    if (inputMode === 'subjects') {
      const m = Number(mathsMarks) || 0;
      const p = Number(physicsMarks) || 0;
      const c = Number(chemistryMarks) || 0;
      const calculated = +(m + p / 2 + c / 2).toFixed(2);
      setEffectiveCutoff(calculated);
    } else {
      setEffectiveCutoff(Number(directCutoff) || 180.0);
    }
  }, [inputMode, mathsMarks, physicsMarks, chemistryMarks, directCutoff]);

  // Fetch Smart Suggestions whenever cutoff, community, or branch changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (effectiveCutoff < 50) return;
      try {
        const res = await tneaService.getSmartSuggestions({
          cutoff: effectiveCutoff,
          community,
          preferredBranches: selectedBranches,
          preferredDistricts: selectedDistricts,
          quota,
          academicYear,
        });
        if (res?.success) {
          setSmartSuggestions(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch smart suggestions', err);
      }
    };

    fetchSuggestions();
  }, [effectiveCutoff, community, selectedBranches, selectedDistricts, quota, academicYear]);

  // Check for shared plan via URL params
  useEffect(() => {
    const shareId = searchParams.get('shareId');
    if (shareId) {
      const loadSharedPlan = async () => {
        try {
          const res = await tneaService.getSimulationByShareId(shareId);
          if (res?.success) {
            setSimulationResults(res.data);
            setEffectiveCutoff(res.data.academicDetails?.effectiveCutoff || 180);
            setCommunity(res.data.community || 'BC');
            setCurrentStep(4);
          }
        } catch (err) {
          console.error('Failed to load shared simulation plan', err);
        }
      };
      loadSharedPlan();
    }
  }, [searchParams]);

  // Add Choice from Smart Suggestions
  const handleAddSuggestedChoice = (suggestedItem) => {
    const newChoice = {
      priority: preferenceList.length + 1,
      collegeCode: suggestedItem.collegeCode,
      collegeName: suggestedItem.collegeName,
      district: suggestedItem.district,
      collegeType: suggestedItem.collegeType,
      departmentCode: suggestedItem.departmentCode,
      departmentName: suggestedItem.departmentName,
      quota: 'Government',
    };

    setPreferenceList((prev) => [...prev, newChoice]);
  };

  // Run Simulation Handler
  const handleRunSimulation = async () => {
    if (preferenceList.length === 0) {
      alert('Please add at least 1 college preference choice to run the simulation.');
      return;
    }

    setSimulating(true);
    try {
      const payload = {
        cutoff: effectiveCutoff,
        community,
        specialReservation,
        ranks: {
          overallRank: overallRank ? Number(overallRank) : null,
          communityRank: communityRank ? Number(communityRank) : null,
          specialRank: specialRank ? Number(specialRank) : null,
        },
        preferences: preferenceList,
        academicYear,
        counsellingRound,
        quota,
      };

      const res = await tneaService.runSimulation(payload);
      if (res?.success) {
        setSimulationResults(res.data);
        setCurrentStep(4);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      alert(err.userMessage || 'Simulation execution failed. Please check inputs.');
    } finally {
      setSimulating(false);
    }
  };

  // Save Simulation Plan
  const handleSavePlan = async () => {
    if (!simulationResults) return;
    setSavingPlan(true);
    try {
      const res = await tneaService.saveSimulation(simulationResults);
      if (res?.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save simulation', err);
    } finally {
      setSavingPlan(false);
    }
  };

  const toggleChartExpansion = (priority) => {
    setExpandedCharts((prev) => ({ ...prev, [priority]: !prev[priority] }));
  };

  const getTierBadge = (tier) => {
    switch (tier) {
      case 'Likely':
        return { bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0', label: '🟢 LIKELY' };
      case 'Possible':
        return { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe', label: '🟡 POSSIBLE' };
      case 'Reach':
        return { bg: '#fffbeb', text: '#92400e', border: '#fde68a', label: '🟠 REACH' };
      default:
        return { bg: '#fef2f2', text: '#991b1b', border: '#fecaca', label: '🔴 UNLIKELY' };
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '1.5rem 0 4rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Header Banner */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#2563eb', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
            <Sparkles size={16} />
            <span>Estimated TNEA Allotment Simulation</span>
          </div>
          <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
            TNEA College & Seat Allocation Simulator
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.25rem' }}>
            Simulate your engineering admissions probability across your ordered preference list using 5-year historical cutoff trends and real-time seat matrices.
          </p>
        </div>

        {/* Mandatory Official Disclaimer */}
        <DisclaimerBanner customText="This simulation is based on historical TNEA cutoff data, candidate rank/category and available seat information. It does not guarantee admission or reproduce the official TNEA allotment process. Students must verify final allotment through the official TNEA portal." />

        {/* Stepper Navigation */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '1rem',
            marginBottom: '2rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.5rem',
          }}
        >
          {[
            { step: 1, title: 'Step 1', subtitle: 'Academic Marks' },
            { step: 2, title: 'Step 2', subtitle: 'Community & Ranks' },
            { step: 3, title: 'Step 3', subtitle: 'Choice Builder' },
            { step: 4, title: 'Step 4', subtitle: 'Simulation Results' },
          ].map((s) => {
            const isActive = currentStep === s.step;
            const isCompleted = currentStep > s.step;

            return (
              <button
                key={s.step}
                type="button"
                onClick={() => {
                  if (s.step < currentStep || simulationResults) setCurrentStep(s.step);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: isActive ? '#eff6ff' : isCompleted ? '#ecfdf5' : 'transparent',
                  cursor: s.step <= currentStep || simulationResults ? 'pointer' : 'default',
                  textAlign: 'left',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: isActive ? '#2563eb' : isCompleted ? '#059669' : '#e2e8f0',
                    color: isActive || isCompleted ? '#ffffff' : '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    flexShrink: 0,
                  }}
                >
                  {isCompleted ? '✓' : s.step}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: isActive ? '#2563eb' : '#64748b', textTransform: 'uppercase' }}>
                    {s.title}
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: isActive ? '#1e40af' : '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {s.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* STEP 1: Academic Marks */}
        {currentStep === 1 && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem', maxWidth: '780px', margin: '0 auto', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Step 1: Enter Your Academic Marks</h2>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>Compute your normalized TNEA cutoff out of 200 marks.</p>
              </div>

              {/* Mode Toggle */}
              <div style={{ display: 'flex', backgroundColor: '#f1f5f9', borderRadius: '8px', padding: '0.2rem' }}>
                <button
                  type="button"
                  onClick={() => setInputMode('subjects')}
                  style={{
                    border: 'none',
                    padding: '0.4rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    backgroundColor: inputMode === 'subjects' ? '#ffffff' : 'transparent',
                    color: inputMode === 'subjects' ? '#0f172a' : '#64748b',
                    cursor: 'pointer',
                  }}
                >
                  By Subject Marks
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('direct')}
                  style={{
                    border: 'none',
                    padding: '0.4rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    backgroundColor: inputMode === 'direct' ? '#ffffff' : 'transparent',
                    color: inputMode === 'direct' ? '#0f172a' : '#64748b',
                    cursor: 'pointer',
                  }}
                >
                  Direct Cutoff
                </button>
              </div>
            </div>

            {inputMode === 'subjects' ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Mathematics Marks (Max 100):
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={mathsMarks}
                    onChange={(e) => setMathsMarks(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1.1rem', fontWeight: 700 }}
                  />
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>Full weightage (100%)</div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Physics Marks (Max 100):
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={physicsMarks}
                    onChange={(e) => setPhysicsMarks(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1.1rem', fontWeight: 700 }}
                  />
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>Half weightage (÷ 2)</div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Chemistry Marks (Max 100):
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={chemistryMarks}
                    onChange={(e) => setChemistryMarks(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1.1rem', fontWeight: 700 }}
                  />
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>Half weightage (÷ 2)</div>
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Direct TNEA Cutoff (50.00 - 200.00):
                </label>
                <input
                  type="number"
                  step="0.25"
                  min="50"
                  max="200"
                  value={directCutoff}
                  onChange={(e) => setDirectCutoff(e.target.value)}
                  style={{ width: '100%', maxWidth: '300px', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1.25rem', fontWeight: 800, color: '#2563eb' }}
                />
              </div>
            )}

            {/* Calculated Cutoff Display Banner */}
            <div
              style={{
                backgroundColor: '#0f172a',
                color: '#ffffff',
                borderRadius: '12px',
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '2rem',
              }}
            >
              <div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Calculated TNEA Engineering Cutoff
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#38bdf8', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  {effectiveCutoff.toFixed(2)} <span style={{ fontSize: '1.1rem', color: '#94a3b8', fontWeight: 600 }}>/ 200</span>
                </div>
              </div>

              <div style={{ fontSize: '0.82rem', color: '#cbd5e1', maxWidth: '300px', lineHeight: 1.4 }}>
                Formula: <strong>Maths + (Physics ÷ 2) + (Chemistry ÷ 2)</strong>
              </div>
            </div>

            {/* Next Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                style={{
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem 1.75rem',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <span>Continue to Step 2: Community & Ranks</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Community & Ranks */}
        {currentStep === 2 && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem', maxWidth: '780px', margin: '0 auto', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Step 2: Community & Reservation Category</h2>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>Select your official Tamil Nadu community quota and optional TNEA ranks.</p>
            </div>

            {/* Community Selector */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>
                Community Reservation Category:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.6rem' }}>
                {[
                  { code: 'OC', label: 'OC (Open Merit)' },
                  { code: 'BC', label: 'BC (Backward Class)' },
                  { code: 'BCM', label: 'BCM (Muslim)' },
                  { code: 'MBC/DNC', label: 'MBC & DNC' },
                  { code: 'SC', label: 'SC' },
                  { code: 'SCA', label: 'SCA (Arunthathiyar)' },
                  { code: 'ST', label: 'ST (Tribal)' },
                ].map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => setCommunity(c.code)}
                    style={{
                      padding: '0.75rem 0.5rem',
                      borderRadius: '8px',
                      border: community === c.code ? '2px solid #2563eb' : '1px solid #cbd5e1',
                      backgroundColor: community === c.code ? '#eff6ff' : '#ffffff',
                      color: community === c.code ? '#1d4ed8' : '#334155',
                      fontWeight: community === c.code ? 800 : 600,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Special Reservation Quota */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Special Reservation Category (if applicable):
              </label>
              <select
                value={specialReservation}
                onChange={(e) => setSpecialReservation(e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', backgroundColor: '#ffffff' }}
              >
                <option value="None">None (General Single Window)</option>
                <option value="7.5% Government School">7.5% Government School Preferential Quota</option>
                <option value="Differently Abled">Differently Abled (PwD)</option>
                <option value="Eminent Sports">Eminent Sports Persons</option>
                <option value="Ex-Servicemen">Children of Ex-Servicemen</option>
              </select>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.3rem' }}>
                Special reservation benefits are accounted for during the allotment chance simulation.
              </div>
            </div>

            {/* Rank Inputs (Optional) */}
            <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                <Award size={16} color="#7c3aed" />
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>TNEA Rank Details (Optional):</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '0.2rem' }}>
                    Overall TNEA Rank:
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 12450"
                    value={overallRank}
                    onChange={(e) => setOverallRank(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '0.2rem' }}>
                    Community Rank:
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 3200"
                    value={communityRank}
                    onChange={(e) => setCommunityRank(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.65rem' }}>
                {!overallRank ? (
                  <span style={{ color: '#d97706', fontWeight: 600 }}>ℹ Rank not provided — prediction uses historical cutoff comparison only.</span>
                ) : (
                  <span style={{ color: '#059669', fontWeight: 600 }}>✓ Ranks will be incorporated in preference simulation.</span>
                )}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                style={{ backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', padding: '0.75rem 1.25rem', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                style={{ backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '0.75rem 1.75rem', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <span>Continue to Step 3: Choice Builder</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Preferences & Choice Builder */}
        {currentStep === 3 && (
          <div>
            {/* Top Bar with Smart Suggestions Trigger */}
            <div
              style={{
                backgroundColor: '#0f172a',
                color: '#ffffff',
                borderRadius: '16px',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Candidate Profile</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginTop: '0.2rem' }}>
                  Cutoff: <span style={{ color: '#38bdf8' }}>{effectiveCutoff.toFixed(2)}</span> • Category: <span style={{ color: '#38bdf8' }}>{community}</span>
                  {specialReservation !== 'None' && ` • ${specialReservation}`}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowSuggestionsModal(true)}
                style={{
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.65rem 1.25rem',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 12px rgba(37,99,235,0.4)',
                }}
              >
                <Sparkles size={16} />
                <span>Explore Smart College Suggestions</span>
              </button>
            </div>

            {/* Interactive Preference Builder */}
            <ChoiceListBuilder
              preferences={preferenceList}
              onPreferencesChange={setPreferenceList}
              allColleges={allColleges}
              allDepartments={allDepartments}
            />

            {/* Run Simulation Action Bar */}
            <div
              style={{
                marginTop: '1.75rem',
                backgroundColor: '#ffffff',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                padding: '1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                style={{ backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', padding: '0.75rem 1.25rem', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                  {preferenceList.length} Choice{preferenceList.length !== 1 ? 's' : ''} Ready to Evaluate
                </span>

                <button
                  type="button"
                  disabled={simulating || preferenceList.length === 0}
                  onClick={handleRunSimulation}
                  style={{
                    backgroundColor: preferenceList.length > 0 ? '#059669' : '#94a3b8',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.85rem 2rem',
                    fontSize: '1rem',
                    fontWeight: 800,
                    cursor: preferenceList.length > 0 ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: preferenceList.length > 0 ? '0 4px 14px rgba(5,150,105,0.4)' : 'none',
                  }}
                >
                  <Sparkles size={18} />
                  <span>{simulating ? 'Simulating Allotment...' : 'Simulate TNEA Seat Allotment →'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Simulation Results Dashboard */}
        {currentStep === 4 && simulationResults && (
          <div>
            {/* Top Summary Bar */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Simulation Profile Summary
                  </div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginTop: '0.2rem' }}>
                    Cutoff: {effectiveCutoff.toFixed(2)} / 200 • Category: {community}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.2rem' }}>
                    Evaluated across {simulationResults.summaryCounts?.totalPreferences || 0} candidate choices for Academic Year {academicYear} ({counsellingRound})
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    style={{ backgroundColor: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <RotateCcw size={14} />
                    <span>Modify Choices</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSavePlan}
                    disabled={savingPlan}
                    style={{ backgroundColor: savedSuccess ? '#ecfdf5' : '#eff6ff', color: savedSuccess ? '#065f46' : '#1d4ed8', border: '1px solid #bfdbfe', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <Bookmark size={14} />
                    <span>{savedSuccess ? 'Plan Saved!' : 'Save My TNEA Plan'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowShareModal(true)}
                    style={{ backgroundColor: '#0f172a', color: '#ffffff', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <Share2 size={14} />
                    <span>Share Summary</span>
                  </button>
                </div>
              </div>

              {/* Simulation Result Counters */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem' }}>
                <div style={{ backgroundColor: '#ecfdf5', borderRadius: '10px', border: '1px solid #a7f3d0', padding: '0.85rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#065f46' }}>Likely Allotments</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#059669' }}>{simulationResults.summaryCounts?.likelyCount || 0}</div>
                </div>

                <div style={{ backgroundColor: '#eff6ff', borderRadius: '10px', border: '1px solid #bfdbfe', padding: '0.85rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1d4ed8' }}>Possible Target Choices</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2563eb' }}>{simulationResults.summaryCounts?.possibleCount || 0}</div>
                </div>

                <div style={{ backgroundColor: '#fffbeb', borderRadius: '10px', border: '1px solid #fde68a', padding: '0.85rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400e' }}>Reach / Aspirational</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#d97706' }}>{simulationResults.summaryCounts?.reachCount || 0}</div>
                </div>

                <div style={{ backgroundColor: '#fef2f2', borderRadius: '10px', border: '1px solid #fecaca', padding: '0.85rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#991b1b' }}>Unlikely Choices</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#dc2626' }}>{simulationResults.summaryCounts?.unlikelyCount || 0}</div>
                </div>
              </div>
            </div>

            {/* Highest Recommended Preference Spotlight Card */}
            {simulationResults.highestRecommendedChoice && (
              <div
                style={{
                  backgroundColor: '#0f172a',
                  borderRadius: '16px',
                  color: '#ffffff',
                  padding: '1.75rem',
                  marginBottom: '2rem',
                  boxShadow: '0 10px 25px rgba(15,23,42,0.15)',
                  border: '1px solid #334155',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ backgroundColor: '#059669', color: '#ffffff', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                    HIGHEST ESTIMATED ALLOTMENT IN YOUR ORDER
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Choice Priority #{simulationResults.highestRecommendedChoice.priority}</span>
                </div>

                <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.25rem' }}>
                  {simulationResults.highestRecommendedChoice.collegeName}
                </h3>
                <div style={{ fontSize: '0.95rem', color: '#38bdf8', fontWeight: 700, marginBottom: '1rem' }}>
                  Branch: {simulationResults.highestRecommendedChoice.departmentName} ({simulationResults.highestRecommendedChoice.departmentCode})
                </div>

                {/* Why Breakdown */}
                <div style={{ backgroundColor: '#1e293b', borderRadius: '10px', padding: '1rem', border: '1px solid #334155' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#cbd5e1', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                    Why this choice?
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem', color: '#e2e8f0', lineHeight: 1.6 }}>
                    {(simulationResults.highestRecommendedChoice.reasons || []).map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Detailed Choice Results Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {(simulationResults.results || []).map((item) => {
                const tier = getTierBadge(item.predictionTier);
                const isChartOpen = expandedCharts[item.priority];

                return (
                  <div
                    key={item.priority}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '16px',
                      border: '1px solid #e2e8f0',
                      padding: '1.5rem',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                    }}
                  >
                    {/* Card Top: Priority & Tier Badge */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ backgroundColor: '#1e293b', color: '#ffffff', fontSize: '0.78rem', fontWeight: 800, padding: '0.2rem 0.55rem', borderRadius: '6px' }}>
                          Preference #{item.priority}
                        </span>
                        <span style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                          Code: {item.collegeCode}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span
                          style={{
                            backgroundColor: tier.bg,
                            color: tier.text,
                            border: `1px solid ${tier.border}`,
                            fontSize: '0.82rem',
                            fontWeight: 800,
                            padding: '0.25rem 0.65rem',
                            borderRadius: '6px',
                          }}
                        >
                          {tier.label}
                        </span>

                        <span style={{ backgroundColor: '#f1f5f9', color: '#475569', fontSize: '0.72rem', fontWeight: 700, padding: '0.25rem 0.5rem', borderRadius: '6px' }}>
                          Data Confidence: <strong>{item.dataConfidence}</strong>
                        </span>
                      </div>
                    </div>

                    {/* College & Department */}
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.3, marginBottom: '0.35rem' }}>
                      {item.collegeName}
                    </h3>
                    <div style={{ fontSize: '0.9rem', color: '#2563eb', fontWeight: 700, marginBottom: '0.85rem' }}>
                      Branch: {item.departmentName} ({item.departmentCode}) • {item.district}
                    </div>

                    {/* Key Metrics Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', backgroundColor: '#f8fafc', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '1rem', fontSize: '0.82rem' }}>
                      <div>
                        <span style={{ color: '#64748b' }}>Your Cutoff:</span>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                          {item.studentCutoff !== null && item.studentCutoff !== undefined && !isNaN(Number(item.studentCutoff)) ? Number(item.studentCutoff).toFixed(2) : '—'}
                        </div>
                      </div>

                      <div>
                        <span style={{ color: '#64748b' }}>Latest Cutoff:</span>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#2563eb' }}>
                          {item.historicalCutoff !== null && item.historicalCutoff !== undefined && !isNaN(Number(item.historicalCutoff)) ? Number(item.historicalCutoff).toFixed(2) : 'Unavailable'}
                        </div>
                      </div>

                      <div>
                        <span style={{ color: '#64748b' }}>Difference:</span>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: (item.difference || 0) >= 0 ? '#059669' : '#dc2626' }}>
                          {item.difference !== null && item.difference !== undefined && !isNaN(Number(item.difference))
                            ? (Number(item.difference) >= 0 ? `+${Number(item.difference).toFixed(2)}` : Number(item.difference).toFixed(2))
                            : '—'}
                        </div>
                      </div>

                      <div>
                        <span style={{ color: '#64748b' }}>Available Seats:</span>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: item.availableSeats > 0 ? '#059669' : '#64748b' }}>
                          {item.availableSeats > 0 ? `${item.availableSeats} Vacancies` : (item.seatStatus || 'General Seat Allocation')}
                        </div>
                      </div>
                    </div>

                    {/* Reasons Checklist */}
                    <div style={{ marginBottom: '1rem' }}>
                      <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.82rem', color: '#475569', lineHeight: 1.5 }}>
                        {(item.reasons || []).map((r, idx) => (
                          <li key={idx}>{r}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Historical Cutoff Graph Toggle */}
                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => toggleChartExpansion(item.priority)}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: '#2563eb',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          padding: 0,
                        }}
                      >
                        <TrendingUp size={15} />
                        <span>{isChartOpen ? 'Hide 5-Year Cutoff Trend Chart ▲' : 'View 5-Year Cutoff Trend Chart ▼'}</span>
                      </button>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link
                          to={`/colleges/${item.collegeCode}`}
                          style={{ backgroundColor: '#f1f5f9', color: '#334155', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none' }}
                        >
                          College Profile
                        </Link>
                        <button
                          onClick={() => addCollegeToCompare({ code: item.collegeCode, name: item.collegeName, district: item.district })}
                          style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          + Compare
                        </button>
                      </div>
                    </div>

                    {/* Render Chart if Expanded */}
                    {isChartOpen && (
                      <HistoricalCutoffChart
                        history={item.fiveYearHistory}
                        studentCutoff={item.studentCutoff}
                        average={item.fiveYearAverage}
                        trend={item.trend}
                        highest={item.highestCutoff}
                        lowest={item.lowestCutoff}
                        community={item.community}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Smart Suggestions Modal */}
      <SmartSuggestionsModal
        isOpen={showSuggestionsModal}
        onClose={() => setShowSuggestionsModal(false)}
        suggestions={smartSuggestions}
        onAddChoice={handleAddSuggestedChoice}
        existingPreferences={preferenceList}
      />

      {/* Share Simulation Modal */}
      <ShareSimulationModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        simulationData={simulationResults}
      />
    </div>
  );
};

export default TneaSimulator;
