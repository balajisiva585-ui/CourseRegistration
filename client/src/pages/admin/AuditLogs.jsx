import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  RefreshCw,
  Clock,
  User,
  Activity,
  AlertCircle,
  KeyRound,
  FileText,
  Settings,
  Layers,
} from 'lucide-react';
import api from '../../services/api';

export const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [moduleFilter, setModuleFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {
        module: moduleFilter !== 'ALL' ? moduleFilter : undefined,
        userRole: roleFilter !== 'ALL' ? roleFilter : undefined,
        q: searchTerm.trim() || undefined,
        limit: 150,
      };

      const res = await api.get('/audit-logs', { params });
      if (res.data?.success) {
        setLogs(res.data.data);
      }
    } catch (err) {
      setError(err.userMessage || 'Failed to load audit logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [moduleFilter, roleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLogs();
  };

  // Helper for badge styling based on action type
  const getActionBadge = (action) => {
    let bg = '#eff6ff';
    let text = '#2563eb';

    if (action.includes('LOGIN') || action.includes('AUTH')) {
      bg = '#eef2ff';
      text = '#4f46e5';
    } else if (action.includes('REGISTER') || action.includes('CREATED') || action.includes('ADDED')) {
      bg = '#ecfdf5';
      text = '#047857';
    } else if (action.includes('DROP') || action.includes('DELETE') || action.includes('CANCEL')) {
      bg = '#fff1f2';
      text = '#be123c';
    } else if (action.includes('UPDATE') || action.includes('SETTING')) {
      bg = '#fffbeb';
      text = '#b45309';
    }

    return (
      <span
        style={{
          padding: '0.25rem 0.5rem',
          borderRadius: '0.375rem',
          fontSize: '0.6875rem',
          fontWeight: 700,
          backgroundColor: bg,
          color: text,
          fontFamily: 'monospace',
        }}
      >
        {action}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    let color = '#2563eb';
    if (role === 'ADMIN') color = '#7c3aed';
    if (role === 'FACULTY') color = '#059669';

    return (
      <span
        style={{
          fontSize: '0.6875rem',
          fontWeight: 700,
          color: color,
          backgroundColor: `${color}15`,
          padding: '0.2rem 0.45rem',
          borderRadius: '0.25rem',
        }}
      >
        {role}
      </span>
    );
  };

  // Compute summary stats
  const totalEvents = logs.length;
  const authEvents = logs.filter((l) => l.module === 'AUTH').length;
  const regEvents = logs.filter((l) => l.module === 'REGISTRATION' || l.module === 'COURSES').length;
  const adminEvents = logs.filter((l) => l.userRole === 'ADMIN').length;

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShieldCheck color="#2563eb" size={28} />
            Security & System Audit Logs
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Real-time compliance trail, authentication events, registration operations, and administrator actions.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            border: '1px solid #cbd5e1',
            backgroundColor: '#ffffff',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#475569',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <RefreshCw size={16} /> Refresh Trail
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', padding: '1.25rem', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
            <Activity size={16} color="#2563eb" /> Total Events Logged
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginTop: '0.375rem' }}>
            {totalEvents}
          </div>
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', padding: '1.25rem', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
            <KeyRound size={16} color="#4f46e5" /> Authentication Logs
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginTop: '0.375rem' }}>
            {authEvents}
          </div>
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', padding: '1.25rem', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
            <Layers size={16} color="#059669" /> Course Operations
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginTop: '0.375rem' }}>
            {regEvents}
          </div>
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', padding: '1.25rem', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
            <ShieldCheck size={16} color="#7c3aed" /> Admin Executions
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginTop: '0.375rem' }}>
            {adminEvents}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '0.75rem',
          padding: '1rem 1.25rem',
          border: '1px solid #e2e8f0',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1rem',
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '260px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '0.5rem',
              padding: '0.375rem 0.75rem',
              width: '100%',
              maxWidth: '360px',
            }}
          >
            <Search size={16} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search action, details, user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: 'none',
                background: 'none',
                outline: 'none',
                paddingLeft: '0.5rem',
                fontSize: '0.8125rem',
                width: '100%',
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: '0.45rem 0.875rem',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              borderRadius: '0.375rem',
              border: 'none',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Search
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Module Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600 }}>Module:</span>
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              style={{
                padding: '0.375rem 0.625rem',
                borderRadius: '0.375rem',
                border: '1px solid #cbd5e1',
                fontSize: '0.8125rem',
                backgroundColor: '#ffffff',
                outline: 'none',
              }}
            >
              <option value="ALL">All Modules</option>
              <option value="AUTH">Authentication</option>
              <option value="COURSES">Courses</option>
              <option value="REGISTRATIONS">Registrations</option>
              <option value="STUDENTS">Students</option>
              <option value="FACULTY">Faculty</option>
              <option value="DEPARTMENTS">Departments</option>
              <option value="SETTINGS">Settings</option>
            </select>
          </div>

          {/* User Role Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600 }}>Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{
                padding: '0.375rem 0.625rem',
                borderRadius: '0.375rem',
                border: '1px solid #cbd5e1',
                fontSize: '0.8125rem',
                backgroundColor: '#ffffff',
                outline: 'none',
              }}
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">ADMIN</option>
              <option value="FACULTY">FACULTY</option>
              <option value="STUDENT">STUDENT</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '0.75rem',
          border: '1px solid #e2e8f0',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden',
        }}
      >
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            Retrieving tamper-resistant audit logs...
          </div>
        ) : error ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#e11d48' }}>{error}</div>
        ) : logs.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
            No audit events found matching query.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>TIMESTAMP</th>
                  <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>USER / ACTOR</th>
                  <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>ROLE</th>
                  <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>MODULE</th>
                  <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>ACTION TYPE</th>
                  <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>EVENT DETAILS</th>
                  <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>IP ADDRESS</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr
                    key={log._id}
                    onClick={() => setSelectedLog(log)}
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      fontSize: '0.8125rem',
                      color: '#334155',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
                  >
                    <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap', color: '#64748b', fontSize: '0.75rem' }}>
                      {new Date(log.timestamp || log.createdAt).toLocaleString()}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{log.userName || 'Anonymous'}</div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>{getRoleBadge(log.userRole)}</td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem' }}>
                      {log.module}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>{getActionBadge(log.action)}</td>
                    <td style={{ padding: '0.75rem 1rem', maxWidth: '380px' }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {log.details}
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', color: '#64748b', fontSize: '0.75rem' }}>
                      {log.ipAddress || '127.0.0.1'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedLog && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
          onClick={() => setSelectedLog(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.75rem',
              maxWidth: '560px',
              width: '100%',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-xl)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a' }}>Audit Record Details</h3>
              <button
                onClick={() => setSelectedLog(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748b' }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8125rem' }}>
              <div>
                <span style={{ color: '#64748b', fontWeight: 600 }}>Action:</span>{' '}
                {getActionBadge(selectedLog.action)}
              </div>
              <div>
                <span style={{ color: '#64748b', fontWeight: 600 }}>User:</span>{' '}
                <strong>{selectedLog.userName}</strong> ({selectedLog.userRole})
              </div>
              <div>
                <span style={{ color: '#64748b', fontWeight: 600 }}>Module:</span> {selectedLog.module}
              </div>
              <div>
                <span style={{ color: '#64748b', fontWeight: 600 }}>Time:</span>{' '}
                {new Date(selectedLog.timestamp || selectedLog.createdAt).toUTCString()}
              </div>
              <div>
                <span style={{ color: '#64748b', fontWeight: 600 }}>IP Address:</span> {selectedLog.ipAddress || '127.0.0.1'}
              </div>
              <div>
                <span style={{ color: '#64748b', fontWeight: 600 }}>User Agent:</span>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.5rem', borderRadius: '0.375rem', marginTop: '0.25rem', fontSize: '0.75rem', color: '#475569', wordBreak: 'break-all' }}>
                  {selectedLog.userAgent || 'Mozilla/5.0'}
                </div>
              </div>
              <div>
                <span style={{ color: '#64748b', fontWeight: 600 }}>Description:</span>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '0.375rem', marginTop: '0.25rem', color: '#0f172a', fontWeight: 500 }}>
                  {selectedLog.details}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
              <button
                onClick={() => setSelectedLog(null)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: '0.375rem',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                }}
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogs;
