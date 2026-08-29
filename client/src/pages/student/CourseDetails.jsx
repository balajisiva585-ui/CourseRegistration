import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Layers,
  Award,
  Users,
} from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import ConflictModal from '../../components/ConflictModal';

export const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [eligibility, setEligibility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [conflictModal, setConflictModal] = useState({ isOpen: false, data: null });
  const [toastMessage, setToastMessage] = useState(null);

  const navigate = useNavigate();

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/courses/${id}`);
      if (res.data?.success) {
        setCourse(res.data.data);
        setEligibility(res.data.eligibility);
      }
    } catch (err) {
      setError(err.userMessage || 'Failed to load course details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const handleRegister = async () => {
    try {
      setIsRegistering(true);
      const res = await api.post('/registrations', { courseId: course._id });
      if (res.data?.success) {
        setToastMessage({
          type: 'success',
          text: `Successfully enrolled in ${course.courseCode}!`,
        });
        fetchCourseDetails();
      }
    } catch (err) {
      if (err.data?.conflictDetails) {
        setConflictModal({
          isOpen: true,
          data: err.data,
        });
      } else {
        setToastMessage({
          type: 'error',
          text: err.userMessage || 'Registration failed.',
        });
      }
    } finally {
      setIsRegistering(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading syllabus & course details...</div>;
  }

  if (error || !course) {
    return (
      <div className="page-body">
        <div style={{ padding: '2rem', backgroundColor: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '0.75rem', color: '#e11d48' }}>
          {error || 'Course not found.'}
        </div>
      </div>
    );
  }

  const isRegistered = eligibility?.isRegistered;
  const isPrereqSatisfied = eligibility?.isPrereqSatisfied ?? true;
  const hasConflict = eligibility?.hasTimeConflict;
  const isFull = course.availableSeats <= 0;
  const fillPercentage = Math.min(100, Math.round(((course.enrolledCount || 0) / (course.capacity || 1)) * 100));

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

      {/* Back Link */}
      <div style={{ marginBottom: '1.25rem' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'none',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: 600,
          }}
        >
          <ArrowLeft size={16} /> Back to Courses
        </button>
      </div>

      {/* Main Course Header Card */}
      <div className="academic-card" style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: '#2563eb' }}>
                {course.courseCode}
              </span>
              <StatusBadge status={course.courseType} text={`${course.credits} Credits`} />
              <StatusBadge status={course.courseType} text={course.courseType} />
              <StatusBadge status={course.status} text={course.status} />
            </div>
            <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#0f172a' }}>
              {course.courseName}
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Department of {course.department?.name} ({course.department?.code}) • Target Semester {course.semester}
            </p>
          </div>

          {/* Registration Action Box */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
            {isRegistered ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.625rem 1.25rem', borderRadius: '0.5rem', color: '#047857', fontWeight: 700 }}>
                <CheckCircle2 size={18} /> You are enrolled in this course
              </div>
            ) : hasConflict ? (
              <button
                className="btn btn-danger btn-lg"
                onClick={() => setConflictModal({ isOpen: true, data: { conflicts: eligibility.conflictDetails } })}
              >
                <AlertTriangle size={18} /> Schedule Conflict ⚠
              </button>
            ) : !isPrereqSatisfied ? (
              <button className="btn btn-secondary btn-lg" style={{ backgroundColor: '#fffbeb', borderColor: '#fde68a', color: '#b45309' }} disabled>
                <Lock size={18} /> Missing Prerequisites
              </button>
            ) : isFull ? (
              <button className="btn btn-secondary btn-lg" disabled>
                Course Full (0 Seats)
              </button>
            ) : (
              <button className="btn btn-primary btn-lg" onClick={handleRegister} disabled={isRegistering}>
                {isRegistering ? 'Processing Registration...' : 'Register for Course'}
              </button>
            )}
          </div>
        </div>

        <p style={{ fontSize: '0.9375rem', color: '#334155', lineHeight: 1.6, borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
          {course.description || 'No detailed course description provided.'}
        </p>
      </div>

      {/* Grid: Left Syllabus & Prerequisites, Right Schedule & Faculty */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '1.75rem' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Prerequisites Card */}
          <div className="academic-card">
            <h3 className="academic-card-title" style={{ marginBottom: '1rem' }}>
              <Award size={20} color="#2563eb" /> Course Prerequisites
            </h3>

            {(!course.prerequisites || course.prerequisites.length === 0) &&
            (!course.prerequisiteCodes || course.prerequisiteCodes.length === 0) ? (
              <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem', color: '#64748b', fontSize: '0.875rem' }}>
                No prerequisites required for this course. Any eligible student can register.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {(course.prerequisiteCodes || []).map((code) => {
                  const isCompleted = (eligibility?.completedPrereqs || []).includes(code.toUpperCase());
                  return (
                    <div
                      key={code}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 1rem',
                        borderRadius: '0.5rem',
                        backgroundColor: isCompleted ? '#ecfdf5' : '#fffbeb',
                        border: `1px solid ${isCompleted ? '#a7f3d0' : '#fde68a'}`,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {isCompleted ? (
                          <CheckCircle2 size={18} color="#059669" />
                        ) : (
                          <AlertTriangle size={18} color="#d97706" />
                        )}
                        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: isCompleted ? '#065f46' : '#92400e' }}>
                          {code}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: isCompleted ? '#059669' : '#d97706' }}>
                        {isCompleted ? '✓ Requirement Satisfied' : '⚠ Incomplete'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Seat Capacity & Stats */}
          <div className="academic-card">
            <h3 className="academic-card-title" style={{ marginBottom: '1rem' }}>
              <Users size={20} color="#2563eb" /> Capacity & Seat Allocation
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ backgroundColor: '#f8fafc', padding: '0.875rem', borderRadius: '0.5rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>MAX CAPACITY</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{course.capacity}</div>
              </div>
              <div style={{ backgroundColor: '#f8fafc', padding: '0.875rem', borderRadius: '0.5rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>ENROLLED</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2563eb' }}>{course.enrolledCount}</div>
              </div>
              <div style={{ backgroundColor: course.availableSeats > 0 ? '#ecfdf5' : '#fff1f2', padding: '0.875rem', borderRadius: '0.5rem', textAlign: 'center', border: `1px solid ${course.availableSeats > 0 ? '#a7f3d0' : '#fecdd3'}` }}>
                <div style={{ fontSize: '0.75rem', color: course.availableSeats > 0 ? '#047857' : '#be123c', fontWeight: 600 }}>AVAILABLE SEATS</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: course.availableSeats > 0 ? '#047857' : '#be123c' }}>{course.availableSeats}</div>
              </div>
            </div>

            <div className="progress-container" style={{ height: '8px' }}>
              <div className="progress-bar-fill" style={{ width: `${fillPercentage}%`, background: isFull ? '#e11d48' : 'linear-gradient(90deg, #3b82f6, #2563eb)' }} />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Class Schedule Card */}
          <div className="academic-card">
            <h3 className="academic-card-title" style={{ marginBottom: '1rem' }}>
              <Calendar size={20} color="#2563eb" /> Class Schedule & Location
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {course.schedules && course.schedules.length > 0 ? (
                course.schedules.map((slot, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.875rem',
                      backgroundColor: '#f8fafc',
                      borderRadius: '0.5rem',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1e293b' }}>
                      {slot.day}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8125rem', color: '#2563eb', fontWeight: 600 }}>
                      <Clock size={13} /> {slot.startTime} - {slot.endTime}
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Schedule to be announced.</div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', backgroundColor: '#eff6ff', borderRadius: '0.5rem', color: '#1e40af', fontSize: '0.8125rem' }}>
              <MapPin size={16} />
              <span>Assigned Room / Venue: <strong>{course.room || 'Main Academic Hall'}</strong></span>
            </div>
          </div>

          {/* Faculty Profile Card */}
          <div className="academic-card">
            <h3 className="academic-card-title" style={{ marginBottom: '1rem' }}>
              <User size={20} color="#2563eb" /> Instructor Profile
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  backgroundColor: '#dbeafe',
                  color: '#1d4ed8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.125rem',
                }}
              >
                {course.facultyName?.[0] || 'P'}
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                  {course.facultyName || course.faculty?.name || 'Faculty TBA'}
                </h4>
                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {course.faculty?.specialization || 'Department Faculty'}
                </p>
              </div>
            </div>

            {course.faculty && (
              <div style={{ fontSize: '0.8125rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.35rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                <div>Email: <a href={`mailto:${course.faculty.email}`}>{course.faculty.email}</a></div>
                <div>Office: {course.faculty.officeRoom || 'Faculty Block'}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Conflict Modal */}
      <ConflictModal
        isOpen={conflictModal.isOpen}
        onClose={() => setConflictModal({ isOpen: false, data: null })}
        conflictData={conflictModal.data}
        targetCourse={course}
      />
    </div>
  );
};

export default CourseDetails;
