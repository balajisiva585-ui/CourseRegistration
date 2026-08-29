import React, { useState, useEffect } from 'react';
import {
  Settings,
  Calendar,
  Save,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Shield,
  Layers,
  Award,
  Database,
} from 'lucide-react';
import api from '../../services/api';

export const SystemSettings = () => {
  const [settings, setSettings] = useState({
    semesterName: '',
    academicYear: '',
    currentSemesterNumber: 5,
    maxCreditLimit: 24,
    minCreditLimit: 12,
    registrationStartDate: '',
    registrationEndDate: '',
    isRegistrationOpen: true,
    allowDropPeriod: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await api.get('/settings');
        if (res.data?.success) {
          const data = res.data.data;
          setSettings({
            semesterName: data.semesterName || '',
            academicYear: data.academicYear || '',
            currentSemesterNumber: data.currentSemesterNumber || 5,
            maxCreditLimit: data.maxCreditLimit || 24,
            minCreditLimit: data.minCreditLimit || 12,
            registrationStartDate: data.registrationStartDate
              ? new Date(data.registrationStartDate).toISOString().slice(0, 10)
              : '',
            registrationEndDate: data.registrationEndDate
              ? new Date(data.registrationEndDate).toISOString().slice(0, 10)
              : '',
            isRegistrationOpen: data.isRegistrationOpen ?? true,
            allowDropPeriod: data.allowDropPeriod ?? true,
          });
        }
      } catch (err) {
        setToast({ type: 'error', text: err.userMessage || 'Failed to load system settings.' });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setToast(null);

      const res = await api.put('/settings', {
        ...settings,
        currentSemesterNumber: Number(settings.currentSemesterNumber),
        maxCreditLimit: Number(settings.maxCreditLimit),
        minCreditLimit: Number(settings.minCreditLimit),
      });

      if (res.data?.success) {
        setToast({ type: 'success', text: 'Semester configurations successfully saved!' });
      }
    } catch (err) {
      setToast({ type: 'error', text: err.userMessage || 'Failed to save settings.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading semester settings...</div>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Settings color="#2563eb" size={28} />
          Academic Term & Registration Settings
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Configure credit caps, registration windows, semester terms, and operational drop policies.
        </p>
      </div>

      {/* Toast Alert */}
      {toast && (
        <div
          style={{
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            backgroundColor: toast.type === 'success' ? '#ecfdf5' : '#fff1f2',
            color: toast.type === 'success' ? '#047857' : '#be123c',
            border: `1px solid ${toast.type === 'success' ? '#a7f3d0' : '#fecdd3'}`,
            fontWeight: 600,
            fontSize: '0.875rem',
          }}
        >
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          {toast.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Semester Term Configuration */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '0.75rem',
            padding: '1.75rem',
            border: '1px solid #e2e8f0',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Calendar size={20} color="#2563eb" />
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a' }}>Term Identification</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.375rem' }}>
                Semester Title / Display Name
              </label>
              <input
                type="text"
                name="semesterName"
                value={settings.semesterName}
                onChange={handleChange}
                required
                placeholder="e.g. Fall 2026 (Semester 5)"
                style={{
                  width: '100%',
                  padding: '0.625rem 0.875rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.375rem' }}>
                Academic Year
              </label>
              <input
                type="text"
                name="academicYear"
                value={settings.academicYear}
                onChange={handleChange}
                required
                placeholder="e.g. 2025-2026"
                style={{
                  width: '100%',
                  padding: '0.625rem 0.875rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.375rem' }}>
                Active Semester Number
              </label>
              <select
                name="currentSemesterNumber"
                value={settings.currentSemesterNumber}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.625rem 0.875rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.875rem',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <option key={num} value={num}>
                    Semester {num}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Credit Rules Configuration */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '0.75rem',
            padding: '1.75rem',
            border: '1px solid #e2e8f0',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Award size={20} color="#2563eb" />
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a' }}>Credit Hours & Limits</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.375rem' }}>
                Minimum Credit Limit per Student
              </label>
              <input
                type="number"
                name="minCreditLimit"
                value={settings.minCreditLimit}
                onChange={handleChange}
                min="0"
                max="30"
                required
                style={{
                  width: '100%',
                  padding: '0.625rem 0.875rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
              <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem', display: 'block' }}>
                Standard minimum required for full-time academic standing (typically 12 Cr).
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.375rem' }}>
                Maximum Credit Cap per Student
              </label>
              <input
                type="number"
                name="maxCreditLimit"
                value={settings.maxCreditLimit}
                onChange={handleChange}
                min="10"
                max="40"
                required
                style={{
                  width: '100%',
                  padding: '0.625rem 0.875rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
              <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem', display: 'block' }}>
                Students cannot register beyond this limit without dean override (typically 24 Cr).
              </span>
            </div>
          </div>
        </div>

        {/* Portal Controls & Schedule */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '0.75rem',
            padding: '1.75rem',
            border: '1px solid #e2e8f0',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Clock size={20} color="#2563eb" />
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a' }}>Portal Access Switches</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0',
                backgroundColor: settings.isRegistrationOpen ? '#eff6ff' : '#f8fafc',
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                name="isRegistrationOpen"
                checked={settings.isRegistrationOpen}
                onChange={handleChange}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0f172a' }}>
                  Enable Live Course Registration Window
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  When disabled, students can only browse the catalog and view enrolled courses; adding new courses will be rejected.
                </div>
              </div>
            </label>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0',
                backgroundColor: settings.allowDropPeriod ? '#ecfdf5' : '#f8fafc',
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                name="allowDropPeriod"
                checked={settings.allowDropPeriod}
                onChange={handleChange}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0f172a' }}>
                  Allow Add/Drop & Course Withdrawal
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Allows students to drop enrolled courses during the open grace window.
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.75rem',
              borderRadius: '0.5rem',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1,
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <Save size={18} />
            {saving ? 'Saving System Policies...' : 'Save Configuration'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SystemSettings;
