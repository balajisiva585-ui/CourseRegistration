import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Clock,
  Calendar,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Building,
  Filter,
  DollarSign,
  ShieldCheck,
} from 'lucide-react';
import tneaService from '../../services/tneaService';
import DisclaimerBanner from '../../components/hub/DisclaimerBanner';

export const ApplicationsHub = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  useEffect(() => {
    const fetchApps = async () => {
      setLoading(true);
      try {
        const res = await tneaService.getApplications({
          status: statusFilter,
          type: typeFilter,
          academicYear: 2025,
        });
        if (res?.success) {
          setApplications(res.data);
        }
      } catch (err) {
        console.error('Failed to load applications', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, [statusFilter, typeFilter]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Open':
        return { bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0', icon: CheckCircle2 };
      case 'Closing Soon':
        return { bg: '#fffbeb', text: '#92400e', border: '#fde68a', icon: Clock };
      case 'Closed':
        return { bg: '#fef2f2', text: '#991b1b', border: '#fecaca', icon: AlertCircle };
      case 'Upcoming':
        return { bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe', icon: Calendar };
      default:
        return { bg: '#f8fafc', text: '#334155', border: '#e2e8f0', icon: FileText };
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '1.5rem 0 4rem' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0284c7', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
            <FileText size={18} />
            <span>Admission Windows & Deadlines</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
                Engineering Admission Applications
              </h1>
              <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '0.25rem' }}>
                Track active TNEA central counselling schedules, institutional management quota windows, eligibility criteria, and official registration portals.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <DisclaimerBanner />

        {/* Filters Bar */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '1rem 1.25rem',
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ padding: '0.4rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', backgroundColor: '#ffffff', fontWeight: 600 }}
              >
                <option value="All">All Statuses</option>
                <option value="Open">Open</option>
                <option value="Closing Soon">Closing Soon</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>Application Route:</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                style={{ padding: '0.4rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', backgroundColor: '#ffffff', fontWeight: 600 }}
              >
                <option value="All">All Admission Routes</option>
                <option value="TNEA Counselling">TNEA Counselling (Single Window)</option>
                <option value="Management Quota Direct">Management Quota Direct</option>
                <option value="NRI Quota">NRI / International Quota</option>
                <option value="Lateral Entry">Lateral Entry (Diploma holders)</option>
              </select>
            </div>
          </div>

          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Showing <strong>{applications.length}</strong> active admission notices
          </div>
        </div>

        {/* Applications List */}
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
            <h3>Loading application notices...</h3>
          </div>
        ) : applications.length === 0 ? (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '3.5rem', textAlign: 'center' }}>
            <FileText size={48} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
            <h3>No Application Windows Found</h3>
            <p style={{ color: '#64748b' }}>Try changing the status or application route filter.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {applications.map((app) => {
              const status = getStatusBadge(app.status);
              const StatusIcon = status.icon;

              return (
                <div
                  key={app._id}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '14px',
                    border: '1px solid #e2e8f0',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  }}
                >
                  <div>
                    {/* Status & Type Badges */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span
                        style={{
                          backgroundColor: status.bg,
                          color: status.text,
                          border: `1px solid ${status.border}`,
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.55rem',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        <StatusIcon size={13} />
                        <span>{app.status}</span>
                      </span>

                      <span style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', fontSize: '0.72rem', fontWeight: 700, padding: '0.18rem 0.45rem', borderRadius: '4px' }}>
                        {app.applicationType}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.35, marginBottom: '0.5rem' }}>
                      {app.title}
                    </h3>

                    {/* College name */}
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#2563eb', marginBottom: '0.85rem' }}>
                      <Link to={`/colleges/${app.collegeCode}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
                        {app.collegeName} (Code: {app.collegeCode})
                      </Link>
                    </div>

                    {/* Key Info Dates & Fee */}
                    <div style={{ backgroundColor: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '8px', padding: '0.85rem', marginBottom: '1rem', fontSize: '0.82rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                        <span style={{ color: '#64748b' }}>Start Date:</span>
                        <strong>{new Date(app.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                        <span style={{ color: '#64748b' }}>Closing Date:</span>
                        <strong style={{ color: '#dc2626' }}>
                          {app.closingDate ? new Date(app.closingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'To be announced'}
                        </strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#64748b' }}>Application Fee:</span>
                        <strong style={{ color: '#059669' }}>₹{app.applicationFee || 500}</strong>
                      </div>
                    </div>

                    {/* Eligibility snippet */}
                    <div style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.45, marginBottom: '1rem' }}>
                      <strong>Eligibility:</strong> {app.eligibility}
                    </div>

                    {/* Required Documents */}
                    {app.requiredDocuments && app.requiredDocuments.length > 0 && (
                      <div style={{ marginBottom: '1.25rem' }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>Required Documents:</div>
                        <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.75rem', color: '#64748b' }}>
                          {app.requiredDocuments.slice(0, 3).map((doc, idx) => (
                            <li key={idx} style={{ marginBottom: '0.2rem' }}>{doc}</li>
                          ))}
                          {app.requiredDocuments.length > 3 && (
                            <li style={{ color: '#2563eb' }}>+{app.requiredDocuments.length - 3} more verification items</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Apply External Redirect CTA */}
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                    <a
                      href={app.applicationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        width: '100%',
                        backgroundColor: '#0f172a',
                        color: '#ffffff',
                        padding: '0.65rem',
                        borderRadius: '8px',
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      <span>Apply via Official Portal</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationsHub;
