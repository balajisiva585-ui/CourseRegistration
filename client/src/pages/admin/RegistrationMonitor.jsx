import React, { useState, useEffect } from 'react';
import {
  Layers,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Download,
  Calendar,
} from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

export const RegistrationMonitor = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [semesterFilter, setSemesterFilter] = useState('ALL');
  const [toastMessage, setToastMessage] = useState(null);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const params = {
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        semester: semesterFilter !== 'ALL' ? semesterFilter : undefined,
        search: searchTerm.trim() || undefined,
      };

      const res = await api.get('/registrations', { params });
      if (res.data?.success) {
        setRegistrations(res.data.data);
      }
    } catch (err) {
      console.error('Error loading registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [statusFilter, semesterFilter, searchTerm]);

  const handleAdminDrop = async (reg) => {
    const reason = window.prompt(
      `Enter administrative reason for dropping registration for ${reg.student?.name} in ${reg.course?.courseCode}:`,
      'Administrative Schedule Adjustment'
    );
    if (reason === null) return;

    try {
      const res = await api.delete(`/registrations/admin/${reg._id}`, {
        data: { reason },
      });
      if (res.data?.success) {
        setToastMessage({ type: 'success', text: `Registration cancelled by administrator.` });
        fetchRegistrations();
      }
    } catch (err) {
      setToastMessage({ type: 'error', text: err.userMessage || 'Failed to cancel registration.' });
    }
  };

  return (
    <div className="page-body">
      {/* Toast */}
      {toastMessage && (
        <div className="toast-container">
          <div className={`toast toast-${toastMessage.type}`}>
            {toastMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{toastMessage.text}</span>
            <button onClick={() => setToastMessage(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>✕</button>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
            Registration Monitor & Roster Audit
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Live university-wide course registrations, enrollment audits, and administrative overrides.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="academic-card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.25rem' }}
              placeholder="Search by student, ID, or course code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="Registered">Registered</option>
            <option value="Dropped">Dropped</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            className="form-select"
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
          >
            <option value="ALL">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <option key={s} value={s}>
                Semester {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading registrations...</div>
      ) : (
        <div className="table-container">
          <table className="academic-table">
            <thead>
              <tr>
                <th>Reg ID</th>
                <th>Student</th>
                <th>Course</th>
                <th>Dept</th>
                <th>Sem</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {registrations.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', color: '#94a3b8', padding: '2.5rem' }}>
                    No registrations found matching search criteria.
                  </td>
                </tr>
              ) : (
                registrations.map((r) => (
                  <tr key={r._id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700, color: '#64748b' }}>
                      {r.registrationId}
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{r.student?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        ID: {r.student?.studentId}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 800, color: '#2563eb' }}>
                        {r.course?.courseCode}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#475569' }}>
                        {r.course?.courseName} ({r.course?.credits} Cr)
                      </div>
                    </td>
                    <td>{r.student?.department?.code || 'N/A'}</td>
                    <td>Sem {r.semester}</td>
                    <td>
                      {r.registrationDate
                        ? new Date(r.registrationDate).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td>
                      <StatusBadge status={r.status} text={r.status} />
                    </td>
                    <td>
                      {r.status === 'Registered' && (
                        <button
                          className="btn btn-outline-danger btn-sm"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                          title="Administrative Drop"
                          onClick={() => handleAdminDrop(r)}
                        >
                          <Trash2 size={13} /> Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RegistrationMonitor;
