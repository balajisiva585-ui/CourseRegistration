import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Award,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  ArrowRight,
  Info,
  Clock,
  User,
  MapPin,
} from 'lucide-react';
import api from '../../services/api';
import ConflictModal from '../../components/ConflictModal';

export const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [advisorNotice, setAdvisorNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [registeringId, setRegisteringId] = useState(null);
  const [conflictModal, setConflictModal] = useState({ isOpen: false, data: null, course: null });
  const [toastMessage, setToastMessage] = useState(null);

  const navigate = useNavigate();

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const res = await api.get('/recommendations');
      if (res.data?.success) {
        setRecommendations(res.data.data.recommendations || []);
        setAdvisorNotice(res.data.data.advisorNotice || '');
      }
    } catch (err) {
      setError(err.userMessage || 'Failed to load recommendations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleRegister = async (course) => {
    try {
      setRegisteringId(course._id);
      const res = await api.post('/registrations', { courseId: course._id });
      if (res.data?.success) {
        setToastMessage({
          type: 'success',
          text: `Successfully enrolled in ${course.courseCode}!`,
        });
        fetchRecommendations();
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
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b', fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.25rem' }}>
          <Sparkles size={16} /> Intelligent Course Planning Engine
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
          Academic Planning Recommendations
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
          Personalized course suggestions derived from your completed prerequisites, cohort semester, and degree pathway.
        </p>
      </div>

      {/* Advisor Notice Alert */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem',
          padding: '1rem 1.25rem',
          backgroundColor: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '2rem',
          color: '#92400e',
          fontSize: '0.875rem',
        }}
      >
        <Info size={20} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong style={{ color: '#78350f' }}>Academic Advisory Notice:</strong>{' '}
          {advisorNotice ||
            'These are suggested courses based on your academic information. Please confirm with your academic advisor before finalizing your official graduation plan.'}
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Analyzing prerequisite graph and degree pathway...</div>
      ) : recommendations.length === 0 ? (
        <div className="academic-card" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
          <Sparkles size={40} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
          <h3 style={{ color: '#475569', marginBottom: '0.25rem' }}>No Active Recommendations</h3>
          <p style={{ fontSize: '0.875rem' }}>You have registered for all recommended courses for your current milestone.</p>
          <Link to="/student/courses" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
            Explore All Courses
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {recommendations.map((item, idx) => {
            const course = item.course;
            return (
              <div key={course._id || idx} className="academic-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.125rem', color: '#2563eb' }}>
                    {course.courseCode}
                  </span>
                  <span className="badge badge-emerald">{course.credits} Credits</span>
                </div>

                <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                  {course.courseName}
                </h3>

                <p style={{ fontSize: '0.8125rem', color: '#475569', lineHeight: 1.5, marginBottom: '1rem' }}>
                  {course.description ? `${course.description.slice(0, 130)}...` : 'Comprehensive course curriculum.'}
                </p>

                {/* Recommendation Reasons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.6875rem', textTransform: 'uppercase', fontWeight: 700, color: '#64748b' }}>
                    Why this is recommended:
                  </div>
                  {item.reasons.map((r, rIdx) => (
                    <div
                      key={rIdx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.75rem',
                        color: '#047857',
                        fontWeight: 600,
                        backgroundColor: '#ecfdf5',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.375rem',
                      }}
                    >
                      <CheckCircle2 size={13} />
                      {r}
                    </div>
                  ))}
                </div>

                {/* Schedule & Seats */}
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <MapPin size={13} /> {course.room || 'Lecture Hall'} • Sem {course.semester}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <User size={13} color="#3b82f6" /> {course.facultyName || 'Faculty TBA'}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '0.5rem' }}>
                  <Link to={`/student/courses/${course._id}`} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                    View Syllabus
                  </Link>

                  <button
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1.5 }}
                    onClick={() => handleRegister(course)}
                    disabled={registeringId === course._id}
                  >
                    {registeringId === course._id ? 'Registering...' : 'Register Now'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Conflict Modal */}
      <ConflictModal
        isOpen={conflictModal.isOpen}
        onClose={() => setConflictModal({ isOpen: false, data: null, course: null })}
        conflictData={conflictModal.data}
        targetCourse={conflictModal.course}
      />
    </div>
  );
};

export default Recommendations;
