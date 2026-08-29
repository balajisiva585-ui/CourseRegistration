import React, { useState } from 'react';
import { User, Mail, Phone, BookOpen, GraduationCap, Building2, Shield, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';

export const StudentProfile = () => {
  const { user } = useAuth();
  const profile = user?.studentProfile || {};

  return (
    <div className="page-body">
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
          Student Profile & Academic Records
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
          Personal student details, enrollment status, and degree metrics.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.75rem' }}>
        {/* Left: Avatar Card */}
        <div className="academic-card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
          <div
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              fontWeight: 800,
              margin: '0 auto 1rem',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            {user?.name ? user.name[0].toUpperCase() : 'S'}
          </div>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
            {user?.name}
          </h2>
          <div style={{ fontSize: '0.8125rem', color: '#2563eb', fontWeight: 700, marginBottom: '0.75rem' }}>
            Student ID: {profile.studentId || 'STU001'}
          </div>
          <span className="badge badge-emerald">Status: {profile.status || 'Active'}</span>

          <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '1.5rem', paddingTop: '1.25rem', textAlign: 'left', fontSize: '0.8125rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={16} color="#3b82f6" /> {user?.email}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Phone size={16} color="#3b82f6" /> {profile.phone || '+1 (555) 987-6543'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building2 size={16} color="#3b82f6" /> {profile.department?.name || 'AI & Data Science'}
            </div>
          </div>
        </div>

        {/* Right: Academic Metrics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="academic-card">
            <h3 className="academic-card-title" style={{ marginBottom: '1.25rem' }}>
              <GraduationCap size={20} color="#2563eb" /> Academic Standing & Degree Information
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>CURRENT SEMESTER</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
                  Semester {profile.currentSemester || 5}
                </div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>BATCH COHORT</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
                  {profile.batch || '2022-2026'}
                </div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>COMPLETED CREDITS</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981', marginTop: '0.25rem' }}>
                  {profile.completedCredits || 0} Credits
                </div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>DEGREE REQUIREMENT</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2563eb', marginTop: '0.25rem' }}>
                  {profile.totalDegreeCredits || 160} Credits
                </div>
              </div>
            </div>
          </div>

          <div className="academic-card">
            <h3 className="academic-card-title" style={{ marginBottom: '1rem' }}>
              <Shield size={20} color="#2563eb" /> Security & Account Credentials
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
              Your account is authenticated using encrypted JSON Web Tokens (JWT) and bcrypt password hashing.
            </p>
            <button className="btn btn-secondary btn-sm" onClick={() => alert('Password reset link sent to student email.')}>
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
