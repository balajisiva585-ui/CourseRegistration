import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Calendar,
  Sparkles,
  Award,
  Clock,
  MapPin,
  User,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Layers,
} from 'lucide-react';
import api from '../../services/api';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import ConflictModal from '../../components/ConflictModal';

export const StudentDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [conflictModal, setConflictModal] = useState({ isOpen: false, data: null, course: null });
  const [registeringId, setRegisteringId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const navigate = useNavigate();

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard/student');
      if (res.data?.success) {
        setDashboardData(res.data.data);
      }
    } catch (err) {
      setError(err.userMessage || 'Failed to load dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleQuickRegister = async (course) => {
    try {
      setRegisteringId(course._id);
      const res = await api.post('/registrations', { courseId: course._id });
      if (res.data?.success) {
        setToastMessage({
          type: 'success',
          text: `Successfully registered for ${course.courseCode}!`,
        });
        fetchDashboard();
      }
    } catch (err) {
      if (err.data?.conflictDetails) {
        setConflictModal({
          isOpen: true,
          data: err.data,
          course,
        });
      } else {
        setToastMessage({
          type: 'error',
          text: err.userMessage || 'Registration failed.',
        });
      }
    } finally {
      setRegisteringId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
        Loading your academic dashboard...
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div style={{ padding: '2rem' }}>
        <div
          style={{
            padding: '1.25rem',
            backgroundColor: '#fff1f2',
            border: '1px solid #fecdd3',
            borderRadius: '0.75rem',
            color: '#e11d48',
          }}
        >
          {error || 'Unable to display dashboard.'}
        </div>
      </div>
    );
  }

  const { student, stats, upcomingSchedule, recommendations, advisorNotice } = dashboardData;

  return (
    <div className="page-body">
      {/* Toast alert */}
      {toastMessage && (
        <div className="toast-container">
          <div className={`toast toast-${toastMessage.type}`}>
            {toastMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{toastMessage.text}</span>
            <button
              onClick={() => setToastMessage(null)}
              style={{
                marginLeft: 'auto',
                background: 'none',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          color: '#ffffff',
          marginBottom: '1.75rem',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 600,
              marginBottom: '0.75rem',
            }}
          >
            <GraduationCap size={14} />
            <span>
              {student.department} • Semester {student.currentSemester}
            </span>
          </div>
          <h1 style={{ color: '#ffffff', fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            Welcome back, {student.name}!
          </h1>
          <p style={{ color: '#bfdbfe', fontSize: '0.875rem' }}>
            Student ID: <strong>{student.studentId}</strong> | Batch: {student.batch} | Registration Window: <span style={{ color: '#86efac', fontWeight: 700 }}>Open</span>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/student/courses" className="btn" style={{ backgroundColor: '#ffffff', color: '#1e40af', fontWeight: 700 }}>
            <BookOpen size={16} /> Browse Courses
          </Link>
          <Link to="/student/timetable" className="btn" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)' }}>
            <Calendar size={16} /> Timetable
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="stat-grid">
        <StatCard
          title="Enrolled Courses"
          value={stats.registeredCoursesCount}
          subtitle={`Max allowed: 6 courses`}
          icon={BookOpen}
          variant="blue"
        />
        <StatCard
          title="Current Registered Credits"
          value={`${stats.totalRegisteredCredits} / ${stats.maxCreditLimit}`}
          subtitle={`${stats.maxCreditLimit - stats.totalRegisteredCredits} credits remaining`}
          icon={Layers}
          variant="emerald"
        />
        <StatCard
          title="Completed Credits"
          value={`${stats.completedCredits} / ${stats.requiredCredits}`}
          subtitle={`${Math.max(0, stats.requiredCredits - stats.completedCredits - stats.totalRegisteredCredits)} credits to graduation`}
          icon={Award}
          variant="indigo"
        />
        <StatCard
          title="Degree Progress"
          value={`${stats.progressPercentage}%`}
          subtitle="Credit fulfillment rate"
          icon={Sparkles}
          variant="amber"
        />
      </div>

      {/* Main 2-Column Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '1.75rem', marginBottom: '2rem' }}>
        {/* Left: Upcoming Schedule */}
        <div className="academic-card">
          <div className="academic-card-header">
            <h2 className="academic-card-title">
              <Calendar size={20} color="#2563eb" />
              Upcoming Weekly Classes
            </h2>
            <Link to="/student/timetable" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
              View Full Timetable →
            </Link>
          </div>

          {upcomingSchedule.length === 0 ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: '#94a3b8' }}>
              <Calendar size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
              <p>You have no classes scheduled. Register for courses to populate your timetable!</p>
              <Link to="/student/courses" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
                Register Courses Now
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {upcomingSchedule.slice(0, 5).map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.875rem 1rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '0.625rem',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div
                      style={{
                        padding: '0.5rem 0.75rem',
                        backgroundColor: '#eff6ff',
                        color: '#1d4ed8',
                        borderRadius: '0.5rem',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        textAlign: 'center',
                        minWidth: '60px',
                      }}
                    >
                      {item.day.slice(0, 3)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0f172a' }}>
                        {item.courseCode} - {item.courseName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', gap: '0.75rem', marginTop: '0.2rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Clock size={12} /> {item.startTime} - {item.endTime}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <MapPin size={12} /> {item.room}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="badge badge-blue">{item.credits} Cr</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Smart Recommendations */}
        <div className="academic-card">
          <div className="academic-card-header">
            <h2 className="academic-card-title">
              <Sparkles size={20} color="#f59e0b" />
              Planning Suggestions
            </h2>
            <Link to="/student/recommendations" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
              All ({recommendations.length}) →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {recommendations.slice(0, 3).map((rec, idx) => {
              const c = rec.course;
              return (
                <div
                  key={c._id || idx}
                  style={{
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontWeight: 800, fontSize: '0.875rem', color: '#2563eb' }}>
                        {c.courseCode}
                      </span>
                      <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', margin: '0.15rem 0' }}>
                        {c.courseName}
                      </h4>
                    </div>
                    <span className="badge badge-emerald">{c.credits} Cr</span>
                  </div>

                  <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600, margin: '0.35rem 0' }}>
                    ✓ {rec.reasons[0] || 'Prerequisites satisfied'}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {c.availableSeats} seats open
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link to={`/student/courses/${c._id}`} className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                        Details
                      </Link>
                      <button
                        className="btn btn-primary btn-sm"
                        style={{ padding: '0.25rem 0.625rem', fontSize: '0.75rem' }}
                        onClick={() => handleQuickRegister(c)}
                        disabled={registeringId === c._id}
                      >
                        {registeringId === c._id ? '...' : 'Register'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ fontSize: '0.6875rem', color: '#94a3b8', marginTop: '1rem', fontStyle: 'italic' }}>
            ℹ️ {advisorNotice}
          </div>
        </div>
      </div>

      {/* Schedule Conflict Modal */}
      <ConflictModal
        isOpen={conflictModal.isOpen}
        onClose={() => setConflictModal({ isOpen: false, data: null, course: null })}
        conflictData={conflictModal.data}
        targetCourse={conflictModal.course}
      />
    </div>
  );
};

export default StudentDashboard;
