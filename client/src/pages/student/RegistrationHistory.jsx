import React, { useState, useEffect } from 'react';
import { History, BookOpen, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

export const RegistrationHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await api.get('/registrations/history');
        if (res.data?.success) {
          setHistory(res.data.data);
        }
      } catch (err) {
        setError(err.userMessage || 'Failed to load registration history.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="page-body">
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
          Registration Audit History
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
          Chronological record of course registrations, drops, and enrollments across all semesters.
        </p>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading history records...</div>
      ) : history.length === 0 ? (
        <div className="academic-card" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
          <History size={40} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
          <h3 style={{ color: '#475569', marginBottom: '0.25rem' }}>No Registration History Found</h3>
          <p style={{ fontSize: '0.875rem' }}>Your registration actions will be logged here.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="academic-table">
            <thead>
              <tr>
                <th>Registration ID</th>
                <th>Course</th>
                <th>Semester</th>
                <th>Credits</th>
                <th>Registration Date</th>
                <th>Status</th>
                <th>Drop Reason</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item._id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 700, color: '#64748b' }}>
                    {item.registrationId}
                  </td>
                  <td>
                    <div style={{ fontWeight: 800, color: '#2563eb' }}>
                      {item.course?.courseCode}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#475569' }}>
                      {item.course?.courseName}
                    </div>
                  </td>
                  <td>Semester {item.semester}</td>
                  <td>{item.course?.credits || 0} Cr</td>
                  <td>
                    {item.registrationDate
                      ? new Date(item.registrationDate).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td>
                    <StatusBadge status={item.status} text={item.status} />
                  </td>
                  <td style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                    {item.dropReason || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RegistrationHistory;
