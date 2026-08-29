import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Building,
  Layers,
  BarChart3,
  FileText,
  Upload,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  Download,
  Save,
  X,
  Search,
  ShieldAlert,
  ShieldCheck,
  Check,
  Eye,
} from 'lucide-react';
import tneaService from '../../services/tneaService';

export const AdminHubDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics', 'verification', 'colleges', 'cutoffs', 'seats', 'applications', 'bulkUpload'
  const [analytics, setAnalytics] = useState(null);
  const [verificationStats, setVerificationStats] = useState(null);
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [cutoffs, setCutoffs] = useState([]);
  const [seatMatrices, setSeatMatrices] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // Modal / Form States
  const [showCollegeModal, setShowCollegeModal] = useState(false);
  const [collegeFormData, setCollegeFormData] = useState({
    code: '',
    name: '',
    district: 'Chennai',
    collegeType: 'Autonomous',
    isAutonomous: true,
    establishedYear: 2000,
    website: '',
    phone: '',
    email: '',
  });

  // Enhanced Bulk Upload Wizard state
  const [bulkCutoffText, setBulkCutoffText] = useState('');
  const [uploadStep, setUploadStep] = useState(1); // 1: Paste/File, 2: Validate & Preview, 3: Ingestion Report
  const [parsedRows, setParsedRows] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);
  const [bulkUploadReport, setBulkUploadReport] = useState(null);
  const [uploadingBulk, setUploadingBulk] = useState(false);

  // Load Overview Analytics & Lists
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, verifyRes, collegesRes, deptsRes, cutoffsRes, seatsRes, appsRes] = await Promise.all([
        tneaService.getHubAnalytics(),
        tneaService.getDataVerificationStats(),
        tneaService.getColleges({ limit: 50 }),
        tneaService.getDepartments(),
        tneaService.getCutoffs({ limit: 20 }),
        tneaService.getSeatMatrices({ limit: 20 }),
        tneaService.getApplications({ limit: 20 }),
      ]);

      if (analyticsRes?.success) setAnalytics(analyticsRes.data);
      if (verifyRes?.success) setVerificationStats(verifyRes.data);
      if (collegesRes?.success) setColleges(collegesRes.data);
      if (deptsRes?.success) setDepartments(deptsRes.data);
      if (cutoffsRes?.success) setCutoffs(cutoffsRes.data);
      if (seatsRes?.success) setSeatMatrices(seatsRes.data);
      if (appsRes?.success) setApplications(appsRes.data);
    } catch (err) {
      console.error('Failed to load admin dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleCreateCollege = async (e) => {
    e.preventDefault();
    try {
      const res = await tneaService.createCollege(collegeFormData);
      if (res?.success) {
        setStatusMessage({ type: 'success', text: `College ${collegeFormData.name} added successfully!` });
        setShowCollegeModal(false);
        setCollegeFormData({ code: '', name: '', district: 'Chennai', collegeType: 'Autonomous', isAutonomous: true, establishedYear: 2000, website: '', phone: '', email: '' });
        loadDashboardData();
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.userMessage || 'Failed to add college.' });
    }
  };

  const handleDeleteCollege = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}? All cutoffs and seat matrices will also be removed.`)) return;
    try {
      const res = await tneaService.deleteCollege(id);
      if (res?.success) {
        setStatusMessage({ type: 'success', text: `College deleted successfully.` });
        loadDashboardData();
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.userMessage || 'Failed to delete college.' });
    }
  };

  // Step 2: Validate & Parse CSV rows for preview
  const handleValidateCsv = () => {
    if (!bulkCutoffText.trim()) return;

    const lines = bulkCutoffText.trim().split('\n');
    const rows = [];
    const errors = [];

    const isHeader = lines[0].toLowerCase().includes('year') || lines[0].toLowerCase().includes('college');
    const startIndex = isHeader ? 1 : 0;

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const parts = line.split(',').map((p) => p.trim());

      if (parts.length < 4) {
        errors.push(`Row ${i + 1}: Insufficient columns (expected at least year, college_code, college_name, department).`);
        continue;
      }

      const year = Number(parts[0]);
      if (isNaN(year) || year < 2000 || year > 2030) {
        errors.push(`Row ${i + 1}: Invalid academic year "${parts[0]}".`);
      }

      rows.push({
        academicYear: year || 2025,
        collegeCode: parts[1],
        collegeName: parts[2] || `College ${parts[1]}`,
        departmentCode: parts[3]?.toUpperCase(),
        ocCutoff: Number(parts[4] || 180),
        openingRank: Number(parts[5] || 100),
        round: 'Round 1',
        dataType: 'IMPORTED',
        source: 'Bulk Admin Ingestion',
      });
    }

    setParsedRows(rows);
    setValidationErrors(errors);
    setUploadStep(2);
  };

  // Step 3: Confirm and Commit Ingestion
  const handleConfirmImport = async () => {
    if (parsedRows.length === 0) return;

    setUploadingBulk(true);
    try {
      const res = await tneaService.bulkUploadCutoffs(parsedRows);
      if (res?.success) {
        setBulkUploadReport(res.report);
        setStatusMessage({ type: 'success', text: res.message });
        setUploadStep(3);
        loadDashboardData();
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.userMessage || 'Bulk upload failed.' });
    } finally {
      setUploadingBulk(false);
    }
  };

  const downloadSampleCsv = (type) => {
    let sampleContent = '';
    let filename = '';

    if (type === 'cutoff') {
      sampleContent = `year,college_code,college_name,department,oc_cutoff,rank\n2025,0001,College of Engineering Guindy,CS,199.50,150\n2025,2006,PSG College of Technology,AD,197.00,850\n2025,1315,SSN College of Engineering,EC,194.50,1950`;
      filename = 'TNEA_Sample_Cutoff_Upload.csv';
    } else {
      sampleContent = `year,college_code,department,quota,category,total_seats,filled_seats,available_seats\n2025,0001,CS,Government,OC,37,35,2\n2025,2006,AD,Government,BC,32,28,4`;
      filename = 'TNEA_Sample_Seat_Matrix_Upload.csv';
    }

    const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + sampleContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '1.5rem 0 4rem' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#2563eb', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
              <LayoutDashboard size={16} />
              <span>Administration Control Center</span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
              TNEA Central Hub Management Dashboard
            </h1>
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
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Public Hub View →
            </Link>
          </div>
        </div>

        {/* Status Toast */}
        {statusMessage && (
          <div
            style={{
              backgroundColor: statusMessage.type === 'success' ? '#ecfdf5' : '#fef2f2',
              color: statusMessage.type === 'success' ? '#065f46' : '#991b1b',
              border: '1px solid',
              borderColor: statusMessage.type === 'success' ? '#a7f3d0' : '#fecaca',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              marginBottom: '1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.88rem',
              fontWeight: 600,
            }}
          >
            <span>{statusMessage.text}</span>
            <button
              onClick={() => setStatusMessage(null)}
              style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit' }}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', borderBottom: '2px solid #e2e8f0', marginBottom: '1.75rem', paddingBottom: '0.25rem' }}>
          {[
            { id: 'analytics', label: 'Platform Analytics', icon: LayoutDashboard },
            { id: 'verification', label: 'Data Verification', icon: ShieldCheck, count: verificationStats?.summary?.totalRecords },
            { id: 'colleges', label: 'Manage Colleges', icon: Building, count: colleges.length },
            { id: 'cutoffs', label: 'Cutoff Dataset', icon: BarChart3, count: analytics?.summary?.totalCutoffs },
            { id: 'seats', label: 'Seat Matrices', icon: Layers, count: analytics?.summary?.totalSeatRecords },
            { id: 'applications', label: 'Applications', icon: FileText, count: applications.length },
            { id: 'bulkUpload', label: 'Bulk Dataset Wizard', icon: Upload },
          ].map((tab) => {
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

        {/* Tab 1: Analytics Overview */}
        {activeTab === 'analytics' && (
          <div>
            {/* Stat Counters */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Institutions</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>{analytics?.summary?.totalColleges || 0}</div>
                <div style={{ fontSize: '0.75rem', color: '#059669' }}>Engineering Colleges Catalogued</div>
              </div>

              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Active Branches</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#2563eb' }}>{analytics?.summary?.totalDepartments || 0}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>CSE, AI&DS, IT, ECE, EEE...</div>
              </div>

              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Cutoff Data Points</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#7c3aed' }}>{analytics?.summary?.totalCutoffs || 0}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Across 2021 to 2026</div>
              </div>

              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Seat Matrix Records</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#d97706' }}>{analytics?.summary?.totalSeatRecords || 0}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Category & Quota breakups</div>
              </div>
            </div>

            {/* Aggregation Charts / Tables */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {/* District Distribution */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
                  Colleges by District
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {(analytics?.districtBreakdown || []).map((d) => (
                    <div key={d._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: 600, color: '#334155' }}>{d._id}</span>
                      <span style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 800 }}>
                        {d.count} Colleges
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* College Type Distribution */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
                  Institution Classification
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {(analytics?.typeBreakdown || []).map((t) => (
                    <div key={t._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: 600, color: '#334155' }}>{t._id}</span>
                      <span style={{ backgroundColor: '#ecfdf5', color: '#065f46', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 800 }}>
                        {t.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular Searches */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
                  Top Student Search Trends
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {(analytics?.popularSearches || []).map((s) => (
                    <div key={s._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: 600, color: '#334155' }}>{s._id}</span>
                      <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
                        {s.count} searches
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Data Verification */}
        {activeTab === 'verification' && verificationStats && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.75rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#059669', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <ShieldCheck size={16} />
                <span>Dataset Integrity & Quality Audit</span>
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0' }}>
                TNEA Records Data Provenance & Verification
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0 }}>
                Audit official versus demo records, source metadata links, and academic year completeness.
              </p>
            </div>

            {/* Provenance Stat Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Total Database Records</div>
                <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>{verificationStats.summary?.totalRecords}</div>
                <div style={{ fontSize: '0.75rem', color: '#2563eb' }}>{verificationStats.summary?.totalCutoffs} Cutoffs + {verificationStats.summary?.totalSeats} Seat Matrices</div>
              </div>

              <div style={{ backgroundColor: '#ecfdf5', padding: '1.25rem', borderRadius: '12px', border: '1px solid #a7f3d0' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#065f46' }}>Official DOTE Records</div>
                <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#059669' }}>{verificationStats.summary?.officialRecords}</div>
                <div style={{ fontSize: '0.75rem', color: '#059669' }}>Verified against official gazette</div>
              </div>

              <div style={{ backgroundColor: '#eff6ff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1d4ed8' }}>Demo Dataset Records</div>
                <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#2563eb' }}>{verificationStats.summary?.demoRecords}</div>
                <div style={{ fontSize: '0.75rem', color: '#2563eb' }}>Marked with Demo Tag</div>
              </div>

              <div style={{ backgroundColor: '#fef2f2', padding: '1.25rem', borderRadius: '12px', border: '1px solid #fecaca' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#991b1b' }}>Data Quality Warnings</div>
                <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#dc2626' }}>
                  {verificationStats.summary?.recordsMissingSource + verificationStats.summary?.recordsMissingYear}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#dc2626' }}>
                  {verificationStats.summary?.recordsMissingSource} Missing Source, {verificationStats.summary?.recordsMissingYear} Missing Year
                </div>
              </div>
            </div>

            {/* Academic Years Breakdown */}
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
              Cutoff Records Distribution by Academic Year
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
              {(verificationStats.yearsDistribution || []).map((y) => (
                <div key={y._id} style={{ backgroundColor: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Year {y._id}</div>
                  <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700 }}>{y.count} records</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Manage Colleges */}
        {activeTab === 'colleges' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Colleges Directory Management
              </h3>
              <button
                onClick={() => setShowCollegeModal(true)}
                style={{
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.5rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <Plus size={16} />
                <span>Add New College</span>
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Code</th>
                    <th style={{ padding: '0.75rem 1rem' }}>College Name</th>
                    <th style={{ padding: '0.75rem 1rem' }}>District</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Type</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Autonomous</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {colleges.map((col) => (
                    <tr key={col._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#2563eb' }}>{col.code}</td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#0f172a' }}>{col.name}</td>
                      <td style={{ padding: '0.85rem 1rem', color: '#64748b' }}>{col.district}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '0.15rem 0.45rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                          {col.collegeType}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: col.isAutonomous ? '#059669' : '#64748b', fontWeight: 600 }}>
                        {col.isAutonomous ? 'Yes' : 'No'}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
                          <Link
                            to={`/colleges/${col.code}`}
                            style={{ backgroundColor: '#f1f5f9', color: '#334155', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, textDecoration: 'none' }}
                          >
                            View
                          </Link>
                          <button
                            onClick={() => handleDeleteCollege(col._id, col.name)}
                            style={{ backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Enhanced Bulk Dataset Wizard */}
        {activeTab === 'bulkUpload' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.75rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
                Bulk CSV / Excel Dataset Ingestion Wizard
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0 }}>
                4-step workflow: Upload $\rightarrow$ Validate Schema $\rightarrow$ Preview First 5 Rows $\rightarrow$ Confirm Ingestion.
              </p>
            </div>

            {/* Template Download Buttons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.75rem', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <button
                onClick={() => downloadSampleCsv('cutoff')}
                style={{ backgroundColor: '#ffffff', color: '#2563eb', border: '1px solid #bfdbfe', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Download size={14} />
                <span>Download Sample Cutoffs CSV Template</span>
              </button>

              <button
                onClick={() => downloadSampleCsv('seats')}
                style={{ backgroundColor: '#ffffff', color: '#059669', border: '1px solid #a7f3d0', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Download size={14} />
                <span>Download Sample Seat Matrix CSV Template</span>
              </button>
            </div>

            {/* Step 1: Paste CSV */}
            {uploadStep === 1 && (
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                  Paste CSV Rows or Upload Content:
                </label>
                <textarea
                  rows={8}
                  placeholder="year,college_code,college_name,department,oc_cutoff,rank&#10;2025,0001,College of Engineering Guindy,CS,199.50,150&#10;2025,2006,PSG College of Technology,AD,197.00,850"
                  value={bulkCutoffText}
                  onChange={(e) => setBulkCutoffText(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    fontFamily: 'monospace',
                    marginBottom: '1rem',
                  }}
                />

                <button
                  type="button"
                  disabled={!bulkCutoffText.trim()}
                  onClick={handleValidateCsv}
                  style={{
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.75rem 1.75rem',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <Eye size={16} />
                  <span>Validate & Preview Dataset →</span>
                </button>
              </div>
            )}

            {/* Step 2: Validate & Preview First 5 Rows */}
            {uploadStep === 2 && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      Validation Preview ({parsedRows.length} Valid Rows Parsed)
                    </h4>
                    {validationErrors.length > 0 && (
                      <div style={{ color: '#dc2626', fontSize: '0.82rem', marginTop: '0.2rem' }}>
                        ⚠ {validationErrors.length} validation errors found.
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setUploadStep(1)}
                    style={{ backgroundColor: '#f1f5f9', color: '#475569', border: 'none', padding: '0.4rem 0.85rem', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Edit CSV Text
                  </button>
                </div>

                {/* Preview Table */}
                <div style={{ overflowX: 'auto', marginBottom: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                    <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <tr>
                        <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left' }}>Year</th>
                        <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left' }}>Code</th>
                        <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left' }}>College</th>
                        <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left' }}>Dept</th>
                        <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left' }}>OC Cutoff</th>
                        <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left' }}>Opening Rank</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedRows.slice(0, 5).map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '0.5rem 0.75rem' }}>{row.academicYear}</td>
                          <td style={{ padding: '0.5rem 0.75rem', fontWeight: 700, color: '#2563eb' }}>{row.collegeCode}</td>
                          <td style={{ padding: '0.5rem 0.75rem' }}>{row.collegeName}</td>
                          <td style={{ padding: '0.5rem 0.75rem', fontWeight: 700 }}>{row.departmentCode}</td>
                          <td style={{ padding: '0.5rem 0.75rem', fontWeight: 800, color: '#059669' }}>{row.ocCutoff}</td>
                          <td style={{ padding: '0.5rem 0.75rem' }}>{row.openingRank}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button
                  type="button"
                  disabled={uploadingBulk || parsedRows.length === 0}
                  onClick={handleConfirmImport}
                  style={{
                    backgroundColor: '#059669',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.75rem 2rem',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <Check size={16} />
                  <span>{uploadingBulk ? 'Ingesting Dataset...' : `Confirm & Commit ${parsedRows.length} Records`}</span>
                </button>
              </div>
            )}

            {/* Step 3: Success Report */}
            {uploadStep === 3 && bulkUploadReport && (
              <div style={{ backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#059669', marginBottom: '0.75rem' }}>
                  <CheckCircle2 size={22} />
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                    Bulk Ingestion Successfully Completed!
                  </h4>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div style={{ backgroundColor: '#ffffff', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Total Received</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{bulkUploadReport.totalReceived}</div>
                  </div>
                  <div style={{ backgroundColor: '#ecfdf5', padding: '0.75rem', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
                    <div style={{ fontSize: '0.72rem', color: '#065f46' }}>Successfully Inserted</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#059669' }}>{bulkUploadReport.successfulCount}</div>
                  </div>
                  <div style={{ backgroundColor: '#fffbeb', padding: '0.75rem', borderRadius: '8px', border: '1px solid #fde68a' }}>
                    <div style={{ fontSize: '0.72rem', color: '#92400e' }}>Duplicates Skipped</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#d97706' }}>{bulkUploadReport.duplicateCount}</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setBulkCutoffText('');
                    setUploadStep(1);
                  }}
                  style={{ backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '0.5rem 1.25rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Upload Another Dataset
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Cutoffs List View */}
        {activeTab === 'cutoffs' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
              Cutoff Dataset Records ({analytics?.summary?.totalCutoffs || 0})
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                    <th style={{ padding: '0.6rem 0.85rem' }}>Year</th>
                    <th style={{ padding: '0.6rem 0.85rem' }}>Code</th>
                    <th style={{ padding: '0.6rem 0.85rem' }}>College</th>
                    <th style={{ padding: '0.6rem 0.85rem' }}>Branch</th>
                    <th style={{ padding: '0.6rem 0.85rem' }}>Round</th>
                    <th style={{ padding: '0.6rem 0.85rem' }}>OC Cutoff</th>
                    <th style={{ padding: '0.6rem 0.85rem' }}>BC Cutoff</th>
                  </tr>
                </thead>
                <tbody>
                  {cutoffs.map((c) => (
                    <tr key={c._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.6rem 0.85rem' }}>{c.academicYear}</td>
                      <td style={{ padding: '0.6rem 0.85rem', fontWeight: 700, color: '#2563eb' }}>{c.collegeCode}</td>
                      <td style={{ padding: '0.6rem 0.85rem', fontWeight: 600 }}>{c.collegeName}</td>
                      <td style={{ padding: '0.6rem 0.85rem' }}>{c.departmentCode}</td>
                      <td style={{ padding: '0.6rem 0.85rem' }}>{c.round}</td>
                      <td style={{ padding: '0.6rem 0.85rem', fontWeight: 800, color: '#2563eb' }}>{c.ocCutoff.toFixed(2)}</td>
                      <td style={{ padding: '0.6rem 0.85rem' }}>{c.bcCutoff.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 6: Seat Matrices View */}
        {activeTab === 'seats' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
              Seat Matrix Records ({analytics?.summary?.totalSeatRecords || 0})
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                    <th style={{ padding: '0.6rem 0.85rem' }}>College Code</th>
                    <th style={{ padding: '0.6rem 0.85rem' }}>College Name</th>
                    <th style={{ padding: '0.6rem 0.85rem' }}>Branch</th>
                    <th style={{ padding: '0.6rem 0.85rem' }}>Intake</th>
                    <th style={{ padding: '0.6rem 0.85rem' }}>Filled</th>
                    <th style={{ padding: '0.6rem 0.85rem', color: '#059669' }}>Available</th>
                  </tr>
                </thead>
                <tbody>
                  {seatMatrices.map((s) => (
                    <tr key={s._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.6rem 0.85rem', fontWeight: 700, color: '#2563eb' }}>{s.collegeCode}</td>
                      <td style={{ padding: '0.6rem 0.85rem', fontWeight: 600 }}>{s.collegeName}</td>
                      <td style={{ padding: '0.6rem 0.85rem' }}>{s.departmentCode}</td>
                      <td style={{ padding: '0.6rem 0.85rem', fontWeight: 700 }}>{s.totalIntake}</td>
                      <td style={{ padding: '0.6rem 0.85rem', color: '#64748b' }}>{s.totalFilled}</td>
                      <td style={{ padding: '0.6rem 0.85rem', fontWeight: 800, color: '#059669' }}>{s.totalAvailable}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 7: Applications View */}
        {activeTab === 'applications' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
              Admission Application Notices
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {applications.map((app) => (
                <div key={app._id} style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ backgroundColor: '#ecfdf5', color: '#065f46', fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: '4px', marginRight: '0.5rem' }}>
                      {app.status}
                    </span>
                    <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{app.title}</strong>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>{app.collegeName} (Code: {app.collegeCode})</div>
                  </div>
                  <a href={app.applicationLink} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 700 }}>
                    Official Link →
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add College Modal */}
      {showCollegeModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '520px', boxShadow: '0 20px 25px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Add New College</h3>
              <button onClick={() => setShowCollegeModal(false)} style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateCollege} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>College Code (Unique 4 digits)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1509"
                  value={collegeFormData.code}
                  onChange={(e) => setCollegeFormData({ ...collegeFormData, code: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>College Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Meenakshi Sundararajan Engineering College"
                  value={collegeFormData.name}
                  onChange={(e) => setCollegeFormData({ ...collegeFormData, name: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>District</label>
                  <input
                    type="text"
                    required
                    value={collegeFormData.district}
                    onChange={(e) => setCollegeFormData({ ...collegeFormData, district: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>College Type</label>
                  <select
                    value={collegeFormData.collegeType}
                    onChange={(e) => setCollegeFormData({ ...collegeFormData, collegeType: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  >
                    <option value="Government">Government</option>
                    <option value="Government Aided">Government Aided</option>
                    <option value="Autonomous">Autonomous</option>
                    <option value="Private">Private</option>
                    <option value="University">University</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowCollegeModal(false)}
                  style={{ backgroundColor: '#f1f5f9', color: '#475569', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '0.5rem 1.25rem', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Save College
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHubDashboard;
