import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  User,
  Trash2,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
} from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import DropConfirmModal from '../../components/DropConfirmModal';

export const MyCourses = () => {
  const [registrations, setRegistrations] = useState([]);
  const [totalCredits, setTotalCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dropModal, setDropModal] = useState({ isOpen: false, regId: null, course: null });
  const [isDropping, setIsDropping] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const fetchMyCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/registrations/my');
      if (res.data?.success) {
        setRegistrations(res.data.data);
        setTotalCredits(res.data.totalCredits || 0);
      }
    } catch (err) {
      setError(err.userMessage || 'Failed to fetch registered courses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const handleDropConfirm = async (reason) => {
    try {
      setIsDropping(true);
      const res = await api.delete(`/registrations/${dropModal.regId}`, {
        data: { reason },
      });
      if (res.data?.success) {
        setToastMessage({
          type: 'success',
          text: `Course ${dropModal.course?.courseCode} has been dropped.`,
        });
        setDropModal({ isOpen: false, regId: null, course: null });
        fetchMyCourses();
      }
    } catch (err) {
      setToastMessage({
        type: 'error',
        text: err.userMessage || 'Failed to drop course.',
      });
    } finally {
      setIsDropping(false);
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
            My Enrolled Courses
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Current Semester 5 Registration Status & Schedule
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: '#eff6ff', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #bfdbfe', fontSize: '0.875rem', color: '#1e40af', fontWeight: 700 }}>
            Total Credits: {totalCredits} / 24 Max
          </div>
          <Link to="/student/courses" className="btn btn-primary btn-sm">
            <PlusCircle size={14} /> Add More Courses
          </Link>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading registered courses...</div>
      ) : registrations.length === 0 ? (
        <div className="academic-card" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
          <BookOpen size={44} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
          <h3 style={{ color: '#475569', marginBottom: '0.25rem' }}>No Registered Courses Yet</h3>
          <p style={{ fontSize: '0.875rem' }}>You are not registered for any courses in the active semester.</p>
          <Link to="/student/courses" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
            Browse Course Catalog
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {registrations.map((reg) => {
            const course = reg.course;
            if (!course) return null;

            return (
              <div
                key={reg._id}
                className="academic-card"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1.25rem',
                  padding: '1.25rem 1.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '0.75rem',
                      backgroundColor: '#eff6ff',
                      color: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1rem',
                      fontFamily: 'var(--font-display)',
                      flexShrink: 0,
                    }}
                  >
                    {course.courseCode.slice(0, 2)}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 800, fontSize: '1rem', color: '#2563eb' }}>
                        {course.courseCode}
                      </span>
                      <StatusBadge status={course.courseType} text={`${course.credits} Credits`} />
                      <StatusBadge status={course.courseType} text={course.courseType} />
                    </div>

                    <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                      {course.courseName}
                    </h3>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.75rem', color: '#64748b' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <User size={13} color="#3b82f6" /> {course.facultyName || course.faculty?.name || 'Instructor'}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <MapPin size={13} color="#64748b" /> {course.room || 'Hall TBA'}
                      </span>
                      {course.schedules && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Clock size={13} color="#10b981" />
                          {course.schedules.map((s) => `${s.day.slice(0, 3)} ${s.startTime}-${s.endTime}`).join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Link to={`/student/courses/${course._id}`} className="btn btn-secondary btn-sm">
                    View Details
                  </Link>

                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => setDropModal({ isOpen: true, regId: reg._id, course })}
                  >
                    <Trash2 size={14} /> Drop Course
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Drop Modal */}
      <DropConfirmModal
        isOpen={dropModal.isOpen}
        onClose={() => setDropModal({ isOpen: false, regId: null, course: null })}
        onConfirm={handleDropConfirm}
        course={dropModal.course}
        isSubmitting={isDropping}
      />
    </div>
  );
};

export default MyCourses;
