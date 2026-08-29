import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft, Home, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const NotFound = () => {
  const { role, isAuthenticated } = useAuth();

  let homePath = '/login';
  if (isAuthenticated) {
    if (role === 'ADMIN') homePath = '/admin/dashboard';
    else if (role === 'FACULTY') homePath = '/faculty/dashboard';
    else homePath = '/student/dashboard';
  }

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          maxWidth: '500px',
          width: '100%',
          backgroundColor: '#ffffff',
          borderRadius: '1rem',
          padding: '3rem 2rem',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid #e2e8f0',
        }}
      >
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: '#eff6ff',
            color: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}
        >
          <Compass size={36} />
        </div>

        <h1 style={{ fontSize: '3rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>404</h1>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#334155', marginTop: '0.5rem', marginBottom: '0.75rem' }}>
          Page Not Found
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5, marginBottom: '2rem' }}>
          The academic module or resource you requested does not exist or has been relocated.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to={homePath}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              padding: '0.625rem 1.25rem',
              borderRadius: '0.5rem',
              fontWeight: 700,
              fontSize: '0.875rem',
              boxShadow: 'var(--shadow-sm)',
              textDecoration: 'none',
            }}
          >
            <Home size={16} /> Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
