import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Layers,
  Search,
  RotateCcw,
  ShieldCheck,
  Building,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Filter,
  PieChart,
  BarChart,
  Sparkles,
} from 'lucide-react';
import tneaService from '../../services/tneaService';
import SeatProgressBar from '../../components/hub/SeatProgressBar';
import DisclaimerBanner from '../../components/hub/DisclaimerBanner';

export const SeatMatrixExplorer = () => {
  const [searchParams] = useSearchParams();

  const [collegesList, setCollegesList] = useState([]);
  const [departmentsList, setDepartmentsList] = useState([]);

  const [selectedCollegeCode, setSelectedCollegeCode] = useState(searchParams.get('collegeCode') || '0001');
  const [selectedDeptCode, setSelectedDeptCode] = useState(searchParams.get('departmentCode') || 'CS');
  const [academicYear, setAcademicYear] = useState(2025);
  const [counsellingRound, setCounsellingRound] = useState('Round 1');
  const [activeQuota, setActiveQuota] = useState('Government'); // 'Government', 'Management', 'Overall'

  const [seatMatrix, setSeatMatrix] = useState(null);
  const [allSeatsForCollege, setAllSeatsForCollege] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Load Colleges & Departments for dropdown selectors
  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const [collegesRes, deptRes] = await Promise.all([
          tneaService.getColleges({ limit: 50 }),
          tneaService.getDepartments(),
        ]);

        if (collegesRes?.success) setCollegesList(collegesRes.data);
        if (deptRes?.success) setDepartmentsList(deptRes.data);
      } catch (err) {
        console.error('Failed to load dropdown lists', err);
      }
    };

    loadDropdownData();
  }, []);

  // Fetch Seat Matrix for Selected College & Filters
  useEffect(() => {
    const fetchMatrix = async () => {
      setLoading(true);
      try {
        const res = await tneaService.getSeatMatrices({
          collegeCode: selectedCollegeCode,
          academicYear,
          round: counsellingRound,
          quota: activeQuota,
        });

        if (res?.success) {
          setAllSeatsForCollege(res.data);
          setLastUpdated(res.lastUpdated || new Date());

          // Find specific department or default to first
          const found = res.data.find((s) => s.departmentCode === selectedDeptCode) || res.data[0];
          setSeatMatrix(found || null);
        }
      } catch (err) {
        console.error('Failed to load seat matrix', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatrix();
  }, [selectedCollegeCode, selectedDeptCode, academicYear, counsellingRound, activeQuota]);

  const selectedCollegeObj = collegesList.find((c) => c.code === selectedCollegeCode);

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '1.5rem 0 4rem' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#7c3aed', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
            <Layers size={18} />
            <span>TNEA Admission Quota & Category Breakdown</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
                Seat Availability Matrix
              </h1>
              <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '0.25rem' }}>
                Track real-time category-wise intake, filled seats, and vacancies across TNEA Single Window and Institutional Quotas.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link
                to="/colleges"
                style={{
                  backgroundColor: '#ffffff',
                  color: '#334155',
                  border: '1px solid #cbd5e1',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Browse Colleges
              </Link>
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
                <span>Cutoff Predictor</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Disclaimer Banner with Last Updated Timestamp */}
        <DisclaimerBanner lastUpdated={lastUpdated} />

        {/* Matrix Controls & Selectors Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
            marginBottom: '1.75rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            {/* College Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
                Select Engineering College
              </label>
              <select
                value={selectedCollegeCode}
                onChange={(e) => setSelectedCollegeCode(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  backgroundColor: '#ffffff',
                }}
              >
                {collegesList.map((col) => (
                  <option key={col.code} value={col.code}>
                    {col.code} - {col.shortName || col.name} ({col.district})
                  </option>
                ))}
              </select>
            </div>

            {/* Department Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
                Select Department / Branch
              </label>
              <select
                value={selectedDeptCode}
                onChange={(e) => setSelectedDeptCode(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  backgroundColor: '#ffffff',
                }}
              >
                {departmentsList.map((d) => (
                  <option key={d.code} value={d.code}>
                    {d.code} - {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Academic Year */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
                Academic Year
              </label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  backgroundColor: '#ffffff',
                }}
              >
                <option value={2025}>2025 - 2026 (Active Matrix)</option>
                <option value={2024}>2024 - 2025 (Historical Reference)</option>
              </select>
            </div>

            {/* Counselling Round */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
                Counselling Round
              </label>
              <select
                value={counsellingRound}
                onChange={(e) => setCounsellingRound(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  backgroundColor: '#ffffff',
                }}
              >
                <option value="Round 1">Round 1 (Initial Intake)</option>
                <option value="Round 2">Round 2</option>
                <option value="Round 3">Round 3</option>
              </select>
            </div>
          </div>

          {/* Quota Switcher Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginRight: '0.5rem' }}>Admission Quota:</span>
            {['Overall', 'Government', 'Management'].map((q) => {
              const active = activeQuota === q;
              return (
                <button
                  key={q}
                  onClick={() => setActiveQuota(q)}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: active ? '#2563eb' : '#cbd5e1',
                    backgroundColor: active ? '#2563eb' : '#ffffff',
                    color: active ? '#ffffff' : '#475569',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {q === 'Government' ? 'Government / TNEA Quota' : q === 'Management' ? 'Management Quota' : 'Overall All Quotas'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Matrix Dashboard Display */}
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
            <h3>Loading seat availability matrix...</h3>
          </div>
        ) : !seatMatrix ? (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '3.5rem', textAlign: 'center' }}>
            <h3>No seat matrix found for this selection</h3>
            <p style={{ color: '#64748b' }}>Try changing the department or counselling round.</p>
          </div>
        ) : (
          <div>
            {/* Overview Summary Gauges */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Total Intake</div>
                <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0f172a' }}>{seatMatrix.totalIntake}</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Approved annual sanctioned seats</div>
              </div>

              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Seats Filled</div>
                <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#2563eb' }}>{seatMatrix.totalFilled}</div>
                <div style={{ fontSize: '0.78rem', color: '#2563eb' }}>
                  {seatMatrix.totalIntake > 0 ? Math.round((seatMatrix.totalFilled / seatMatrix.totalIntake) * 100) : 0}% Filled
                </div>
              </div>

              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700, textTransform: 'uppercase' }}>Seats Available</div>
                <div style={{ fontSize: '2.25rem', fontWeight: 900, color: seatMatrix.totalAvailable > 0 ? '#059669' : '#ef4444' }}>
                  {seatMatrix.totalAvailable}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#059669' }}>Vacant for upcoming rounds</div>
              </div>
            </div>

            {/* Department Visual Header */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.75rem', marginBottom: '1.75rem', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ backgroundColor: '#1e293b', color: '#ffffff', fontSize: '0.75rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                      Code: {seatMatrix.collegeCode}
                    </span>
                    <span style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', fontSize: '0.75rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                      {seatMatrix.departmentCode}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    {seatMatrix.departmentName} – {seatMatrix.collegeName}
                  </h2>
                </div>

                <Link
                  to={`/colleges/${seatMatrix.collegeCode}`}
                  style={{
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  View Full College Profile →
                </Link>
              </div>

              {/* Visual Overall Fill Progress Bar */}
              <div style={{ marginBottom: '1.75rem', backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <SeatProgressBar
                  total={seatMatrix.totalIntake}
                  filled={seatMatrix.totalFilled}
                  available={seatMatrix.totalAvailable}
                  label="Overall Branch Saturation & Availability"
                  height={12}
                />
              </div>

              {/* Category-wise Breakdown Table */}
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.85rem' }}>
                Category Reservation Matrix Breakdown
              </h3>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#0f172a', color: '#f8fafc', textAlign: 'center' }}>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Community / Reservation Category</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Total Seats</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Filled</th>
                      <th style={{ padding: '0.75rem 1rem', backgroundColor: '#047857', color: '#ffffff' }}>Available Seats</th>
                      <th style={{ padding: '0.75rem 1rem', width: '280px' }}>Fill Visual Meter</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(seatMatrix.categories || []).map((cat, i) => {
                      const fillPct = cat.totalSeats > 0 ? Math.round((cat.filledSeats / cat.totalSeats) * 100) : 0;
                      return (
                        <tr
                          key={cat.category}
                          style={{
                            borderBottom: '1px solid #e2e8f0',
                            backgroundColor: i % 2 === 0 ? '#ffffff' : '#f8fafc',
                            textAlign: 'center',
                          }}
                        >
                          <td style={{ padding: '0.85rem 1rem', textAlign: 'left', fontWeight: 800, color: '#0f172a' }}>
                            {cat.category}
                            <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b', marginLeft: '0.5rem' }}>
                              {cat.category === 'OC' && '(Open 31%)'}
                              {cat.category === 'BC' && '(26.5%)'}
                              {cat.category === 'BCM' && '(3.5%)'}
                              {cat.category === 'MBC/DNC' && '(20%)'}
                              {cat.category === 'SC' && '(15%)'}
                              {cat.category === 'SCA' && '(3%)'}
                              {cat.category === 'ST' && '(1%)'}
                            </span>
                          </td>
                          <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>{cat.totalSeats}</td>
                          <td style={{ padding: '0.85rem 1rem', color: '#64748b', fontWeight: 600 }}>{cat.filledSeats}</td>
                          <td
                            style={{
                              padding: '0.85rem 1rem',
                              fontWeight: 900,
                              fontSize: '1rem',
                              color: cat.availableSeats > 0 ? '#059669' : '#ef4444',
                              backgroundColor: cat.availableSeats > 0 ? '#ecfdf5' : '#fef2f2',
                            }}
                          >
                            {cat.availableSeats}
                          </td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <SeatProgressBar
                              total={cat.totalSeats}
                              filled={cat.filledSeats}
                              available={cat.availableSeats}
                              showNumbers={false}
                              height={8}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Department Switcher for this college */}
            {allSeatsForCollege.length > 1 && (
              <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>
                  Other Departments at {seatMatrix.collegeName}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.85rem' }}>
                  {allSeatsForCollege
                    .filter((s) => s.departmentCode !== seatMatrix.departmentCode)
                    .map((otherSeat) => (
                      <div
                        key={otherSeat._id}
                        onClick={() => setSelectedDeptCode(otherSeat.departmentCode)}
                        style={{
                          backgroundColor: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          padding: '0.85rem 1rem',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb' }}>{otherSeat.departmentCode}</span>
                          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>{otherSeat.departmentName}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#059669' }}>{otherSeat.totalAvailable}</span>
                          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>available</div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SeatMatrixExplorer;
