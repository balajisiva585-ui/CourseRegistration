import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Scale,
  Plus,
  Trash2,
  Building,
  MapPin,
  Award,
  Briefcase,
  Layers,
  DollarSign,
  ShieldCheck,
  CheckCircle,
  XCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useCompare } from '../../context/CompareContext';
import tneaService from '../../services/tneaService';
import DisclaimerBanner from '../../components/hub/DisclaimerBanner';

export const CollegeCompare = () => {
  const { comparedColleges, removeCollegeFromCompare, clearComparison, addCollegeToCompare } = useCompare();

  const [allCollegesList, setAllCollegesList] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedToAdd, setSelectedToAdd] = useState('');

  // Load all colleges for addition dropdown
  useEffect(() => {
    const loadColleges = async () => {
      try {
        const res = await tneaService.getColleges({ limit: 50 });
        if (res?.success) setAllCollegesList(res.data);
      } catch (err) {
        console.error('Failed to load colleges for comparison', err);
      }
    };
    loadColleges();
  }, []);

  // Fetch full details for compared colleges
  useEffect(() => {
    const fetchCompareDetails = async () => {
      if (comparedColleges.length === 0) {
        setComparisonData([]);
        return;
      }
      setLoading(true);
      try {
        const codes = comparedColleges.map((c) => c.code).join(',');
        const res = await tneaService.compareColleges(codes);
        if (res?.success) {
          setComparisonData(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch compare data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompareDetails();
  }, [comparedColleges]);

  const handleAddCollege = (e) => {
    e.preventDefault();
    if (!selectedToAdd) return;
    const found = allCollegesList.find((c) => c.code === selectedToAdd);
    if (found) {
      addCollegeToCompare(found);
      setSelectedToAdd('');
    }
  };

  // Extract Branch Cutoff helper safely
  const formatCutoffPair = (rec) => {
    if (!rec) return 'Unavailable';
    const oc = rec.ocCutoff !== null && rec.ocCutoff !== undefined && !isNaN(Number(rec.ocCutoff)) ? Number(rec.ocCutoff).toFixed(2) : '—';
    const bc = rec.bcCutoff !== null && rec.bcCutoff !== undefined && !isNaN(Number(rec.bcCutoff)) ? Number(rec.bcCutoff).toFixed(2) : '—';
    if (oc === '—' && bc === '—') return 'Unavailable';
    return `${oc} (OC) / ${bc} (BC)`;
  };

  const getCseCutoff = (cutoffs) => formatCutoffPair((cutoffs || []).find((c) => c.departmentCode === 'CS'));
  const getAidsCutoff = (cutoffs) => formatCutoffPair((cutoffs || []).find((c) => c.departmentCode === 'AD'));
  const getEceCutoff = (cutoffs) => formatCutoffPair((cutoffs || []).find((c) => c.departmentCode === 'EC'));

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '1.5rem 0 4rem' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#d97706', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
            <Scale size={18} />
            <span>Decision Support Matrix</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
                Side-by-Side College Comparison
              </h1>
              <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '0.25rem' }}>
                Compare up to 4 Tamil Nadu engineering colleges across cutoffs, seat matrices, placements, accreditation, and facilities.
              </p>
            </div>

            {comparedColleges.length > 0 && (
              <button
                onClick={clearComparison}
                style={{
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                  border: '1px solid #fca5a5',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <Trash2 size={14} />
                <span>Clear All ({comparedColleges.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <DisclaimerBanner />

        {/* Quick Add College Bar */}
        {comparedColleges.length < 4 && (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '1rem 1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={18} color="#2563eb" />
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                Add College to Compare ({comparedColleges.length}/4 Selected):
              </span>
            </div>

            <form onSubmit={handleAddCollege} style={{ display: 'flex', gap: '0.5rem', flex: 1, maxWidth: '480px' }}>
              <select
                value={selectedToAdd}
                onChange={(e) => setSelectedToAdd(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.85rem',
                  backgroundColor: '#ffffff',
                }}
              >
                <option value="">-- Choose college to add --</option>
                {allCollegesList
                  .filter((c) => !comparedColleges.some((cc) => cc.code === c.code))
                  .map((col) => (
                    <option key={col.code} value={col.code}>
                      {col.code} - {col.shortName || col.name} ({col.district})
                    </option>
                  ))}
              </select>
              <button
                type="submit"
                disabled={!selectedToAdd}
                style={{
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.5rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: selectedToAdd ? 'pointer' : 'not-allowed',
                  opacity: selectedToAdd ? 1 : 0.6,
                }}
              >
                Add
              </button>
            </form>
          </div>
        )}

        {/* Comparison Table View */}
        {comparedColleges.length === 0 ? (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '4rem 2rem',
              textAlign: 'center',
            }}
          >
            <Scale size={48} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
              No Colleges in Comparison List
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748b', maxWidth: '480px', margin: '0 auto 1.5rem', lineHeight: 1.5 }}>
              Select up to 4 engineering colleges from the directory or search results to see a side-by-side breakdown of cutoffs, available seats, placements, and campus amenities.
            </p>
            <Link
              to="/colleges"
              style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                padding: '0.65rem 1.5rem',
                borderRadius: '8px',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Browse Colleges to Compare
            </Link>
          </div>
        ) : loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
            <h3>Loading comparison matrix...</h3>
          </div>
        ) : (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              overflowX: 'auto',
              boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              {/* Table Header: College Cards */}
              <thead>
                <tr>
                  <th
                    style={{
                      width: '200px',
                      minWidth: '200px',
                      padding: '1.25rem',
                      backgroundColor: '#f8fafc',
                      borderBottom: '2px solid #cbd5e1',
                      borderRight: '1px solid #e2e8f0',
                      textAlign: 'left',
                      verticalAlign: 'top',
                    }}
                  >
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>Feature / Metric</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>Detailed side-by-side analysis</div>
                  </th>

                  {comparisonData.map(({ college }) => (
                    <th
                      key={college.code}
                      style={{
                        padding: '1.25rem',
                        backgroundColor: '#ffffff',
                        borderBottom: '2px solid #cbd5e1',
                        borderRight: '1px solid #e2e8f0',
                        textAlign: 'left',
                        verticalAlign: 'top',
                        minWidth: '260px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <span style={{ backgroundColor: '#1e293b', color: '#ffffff', fontSize: '0.72rem', fontWeight: 800, padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                          Code: {college.code}
                        </span>
                        <button
                          onClick={() => removeCollegeFromCompare(college.code)}
                          style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: '#dc2626',
                            cursor: 'pointer',
                            padding: '0.2rem',
                          }}
                          title="Remove from comparison"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.3, marginBottom: '0.35rem' }}>
                        {college.shortName || college.name}
                      </h4>

                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.75rem' }}>
                        {college.district}, Tamil Nadu
                      </div>

                      <Link
                        to={`/colleges/${college.code}`}
                        style={{
                          backgroundColor: '#eff6ff',
                          color: '#1d4ed8',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        <span>Full Profile</span>
                        <ExternalLink size={11} />
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {/* 1. Location */}
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: '#334155', backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><MapPin size={14} color="#2563eb" /> Location</div>
                  </td>
                  {comparisonData.map(({ college }) => (
                    <td key={college.code} style={{ padding: '1rem 1.25rem', borderRight: '1px solid #f1f5f9' }}>
                      <strong>{college.district}</strong>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{college.city || college.area}</div>
                    </td>
                  ))}
                </tr>

                {/* 2. College Type & Autonomous */}
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: '#334155', backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Building size={14} color="#059669" /> Institution Type</div>
                  </td>
                  {comparisonData.map(({ college }) => (
                    <td key={college.code} style={{ padding: '1rem 1.25rem', borderRight: '1px solid #f1f5f9' }}>
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>{college.collegeType}</span>
                      <div style={{ fontSize: '0.78rem', color: college.isAutonomous ? '#059669' : '#64748b' }}>
                        {college.isAutonomous ? '✓ Autonomous' : 'Affiliated'}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* 3. Accreditation (NAAC & NIRF) */}
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: '#334155', backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Award size={14} color="#7c3aed" /> Accreditation</div>
                  </td>
                  {comparisonData.map(({ college }) => (
                    <td key={college.code} style={{ padding: '1rem 1.25rem', borderRight: '1px solid #f1f5f9' }}>
                      <div>NAAC: <strong>Grade {college.accreditation?.naacGrade || 'Accredited'}</strong></div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        {college.accreditation?.nirfRank ? `NIRF Rank #${college.accreditation.nirfRank}` : 'NIRF Rank: Unranked/Top Tier'}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* 4. CSE Cutoff */}
                <tr style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: '#f0fdf4' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: '#166534', backgroundColor: '#dcfce7', borderRight: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Sparkles size={14} color="#16a34a" /> CSE Cutoff (2025)</div>
                  </td>
                  {comparisonData.map(({ college, cutoffs }) => (
                    <td key={college.code} style={{ padding: '1rem 1.25rem', borderRight: '1px solid #f1f5f9', fontWeight: 800, color: '#15803d' }}>
                      {getCseCutoff(cutoffs)}
                    </td>
                  ))}
                </tr>

                {/* 5. AI & Data Science Cutoff */}
                <tr style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: '#f0fdf4' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: '#166534', backgroundColor: '#dcfce7', borderRight: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Sparkles size={14} color="#16a34a" /> AI & DS Cutoff (2025)</div>
                  </td>
                  {comparisonData.map(({ college, cutoffs }) => (
                    <td key={college.code} style={{ padding: '1rem 1.25rem', borderRight: '1px solid #f1f5f9', fontWeight: 800, color: '#15803d' }}>
                      {getAidsCutoff(cutoffs)}
                    </td>
                  ))}
                </tr>

                {/* 6. ECE Cutoff */}
                <tr style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: '#f0fdf4' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: '#166534', backgroundColor: '#dcfce7', borderRight: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Sparkles size={14} color="#16a34a" /> ECE Cutoff (2025)</div>
                  </td>
                  {comparisonData.map(({ college, cutoffs }) => (
                    <td key={college.code} style={{ padding: '1rem 1.25rem', borderRight: '1px solid #f1f5f9', fontWeight: 800, color: '#15803d' }}>
                      {getEceCutoff(cutoffs)}
                    </td>
                  ))}
                </tr>

                {/* 7. Available Seats & Intake */}
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: '#334155', backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Layers size={14} color="#2563eb" /> Available Seats</div>
                  </td>
                  {comparisonData.map(({ college, seats }) => {
                    const totalIntake = (seats || []).reduce((acc, curr) => acc + curr.totalIntake, 0);
                    const totalAvailable = (seats || []).reduce((acc, curr) => acc + curr.totalAvailable, 0);
                    return (
                      <td key={college.code} style={{ padding: '1rem 1.25rem', borderRight: '1px solid #f1f5f9' }}>
                        <strong style={{ color: '#059669' }}>{totalAvailable || 'Available'}</strong> / {totalIntake || 'Intake'}
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>across monitored branches</div>
                      </td>
                    );
                  })}
                </tr>

                {/* 8. Placements */}
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: '#334155', backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Briefcase size={14} color="#059669" /> Placements</div>
                  </td>
                  {comparisonData.map(({ college }) => (
                    <td key={college.code} style={{ padding: '1rem 1.25rem', borderRight: '1px solid #f1f5f9' }}>
                      <div>Rate: <strong style={{ color: '#059669' }}>{college.placements?.placementPercentage || 85}%</strong></div>
                      <div>Highest CTC: <strong>₹{college.placements?.highestPackageLPA || 20} LPA</strong></div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Avg CTC: ₹{college.placements?.averagePackageLPA || 6} LPA</div>
                    </td>
                  ))}
                </tr>

                {/* 9. Hostel */}
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: '#334155', backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0' }}>
                    Hostel Facilities
                  </td>
                  {comparisonData.map(({ college }) => (
                    <td key={college.code} style={{ padding: '1rem 1.25rem', borderRight: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#059669', fontWeight: 700 }}>
                        <CheckCircle size={15} />
                        <span>Boys & Girls Hostel</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>In-campus mess</div>
                    </td>
                  ))}
                </tr>

                {/* 10. Fees (Marked Coming Soon) */}
                <tr style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#fffbeb' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: '#92400e', backgroundColor: '#fef3c7', borderRight: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><DollarSign size={14} color="#d97706" /> Fees Structure</div>
                  </td>
                  {comparisonData.map(({ college }) => (
                    <td key={college.code} style={{ padding: '1rem 1.25rem', borderRight: '1px solid #f1f5f9', color: '#b45309', fontWeight: 700 }}>
                      <span style={{ backgroundColor: '#fde68a', color: '#78350f', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.78rem' }}>
                        Coming Soon
                      </span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollegeCompare;
