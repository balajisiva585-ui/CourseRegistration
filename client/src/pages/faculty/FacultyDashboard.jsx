import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  Mail,
  Award,
  ChevronRight,
  GraduationCap,
  Layers,
  Sparkles,
} from 'lucide-react';
import api from '../../services/api';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';

export const FacultyDashboard = () => {
  const [faculty, setFaculty] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        setLoading(true);
        const res = await api.get('/faculty/me/courses');
        if (res.data?.success) {
          setFaculty(res.data.faculty);
          setCourses(res.data.data || []);
        }
      } catch (err) {
        setError(err.userMessage || 'Failed to load faculty course assignments.');
      } finally {
        setLoading(false);
      }
    };

    fetchFacultyData();
  }, []);

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading faculty workspace...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <div style={{ color: '#e11d48', fontWeight: 600, fontSize: '1rem', marginBottom: '1rem' }}>{error}</div>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
          Please make sure your faculty profile is properly linked to your user account.
        </p>
      </div>
    );
  }

  // Calculate metrics
  const totalCourses = courses.length;
  const totalTeachingCredits = courses.reduce((sum, c) => sum + (c.credits || 0), 0);
  const totalStudents = courses.reduce((sum, c) => sum + (c.enrolledCount || 0), 0);
  const totalCapacity = courses.reduce((sum, c) => sum + (c.capacity || 0), 0);

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Faculty Profile Hero Header */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '1rem',
          padding: '2rem',
          border: '1px solid #e2e8f0',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#059669',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 800,
              boxShadow: '0 4px 10px rgba(5, 150, 105, 0.3)',
            }}
          >
            {faculty?.name ? faculty.name[0] : 'F'}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
                {faculty?.name || 'Faculty Member'}
              </h1>
              <span
                style={{
                  backgroundColor: '#ecfdf5',
                  color: '#047857',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.25rem 0.625rem',
                  borderRadius: '9999px',
                }}
              >
                {faculty?.facultyId}
              </span>
            </div>
            <div style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <Award size={15} color="#059669" />
                {faculty?.specialization || 'Department Faculty'}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <MapPin size={15} color="#64748b" />
                {faculty?.officeRoom || 'Faculty Wing'}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <Mail size={15} color="#64748b" />
                {faculty?.email}
              </span>
            </div>
          </div>
        </div>

        <Link
          to="/faculty/rosters"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#059669',
            color: '#ffffff',
            padding: '0.625rem 1.25rem',
            borderRadius: '0.5rem',
            fontWeight: 700,
            fontSize: '0.875rem',
            boxShadow: 'var(--shadow-sm)',
            textDecoration: 'none',
          }}
        >
          <Users size={18} />
          View Class Rosters
        </Link>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        <StatCard
          icon={BookOpen}
          iconColor="#059669"
          title="Assigned Sections"
          value={totalCourses}
          subtitle="Active lecture sections"
        />
        <StatCard
          icon={Award}
          iconColor="#2563eb"
          title="Teaching Load"
          value={`${totalTeachingCredits} Cr`}
          subtitle="Credit hours instructed"
        />
        <StatCard
          icon={Users}
          iconColor="#7c3aed"
          title="Enrolled Students"
          value={totalStudents}
          subtitle={`Out of ${totalCapacity} seat capacity`}
        />
        <StatCard
          icon={Sparkles}
          iconColor="#f59e0b"
          title="Class Fill Rate"
          value={totalCapacity > 0 ? `${Math.round((totalStudents / totalCapacity) * 100)}%` : '0%'}
          subtitle="Overall capacity ratio"
        />
      </div>

      {/* Assigned Courses Section */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
          Assigned Course Offerings
        </h2>

        {courses.length === 0 ? (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.75rem',
              padding: '3rem',
              textAlign: 'center',
              border: '1px solid #e2e8f0',
              color: '#64748b',
            }}
          >
            <BookOpen size={48} color="#cbd5e1" style={{ margin: '0 auto 1rem' }} />
            <div style={{ fontWeight: 700, fontSize: '1.125rem', color: '#1e293b' }}>
              No Teaching Assignments Found
            </div>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem' }}>
              You are currently not assigned to any courses for the active academic term.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {courses.map((course) => (
              <div
                key={course._id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '0.75rem',
                  border: '1px solid #e2e8f0',
                  boxShadow: 'var(--shadow-sm)',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                }}
              >
                <div>
                  {/* Top Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <span
                      style={{
                        backgroundColor: '#eff6ff',
                        color: '#2563eb',
                        fontWeight: 800,
                        fontSize: '0.8125rem',
                        padding: '0.25rem 0.625rem',
                        borderRadius: '0.375rem',
                        fontFamily: 'monospace',
                      }}
                    >
                      {course.courseCode}
                    </span>
                    <span
                      style={{
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                      }}
                    >
                      {course.credits} Credits • Sem {course.semester}
                    </span>
                  </div>

                  {/* Course Title */}
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                    {course.courseName}
                  </h3>

                  <p style={{ fontSize: '0.8125rem', color: '#64748b', lineHeight: 1.4, marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {course.description || 'Comprehensive curriculum covering foundational and advanced concepts.'}
                  </p>

                  {/* Schedule Details */}
                  <div style={{ backgroundColor: '#f8fafc', padding: '0.875rem', borderRadius: '0.5rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.375rem', fontSize: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155' }}>
                      <Calendar size={14} color="#2563eb" />
                      <strong>Days:</strong> {course.schedule?.days?.join(', ') || 'TBA'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155' }}>
                      <Clock size={14} color="#059669" />
                      <strong>Time:</strong> {course.schedule?.startTime} - {course.schedule?.endTime}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155' }}>
                      <MapPin size={14} color="#7c3aed" />
                      <strong>Room:</strong> {course.schedule?.room || 'TBA'}
                    </div>
                  </div>
                </div>

                {/* Bottom Bar: Enrollment & Roster Action */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#475569' }}>
                      Enrollment: <strong style={{ color: '#0f172a' }}>{course.enrolledCount || 0}</strong> / {course.capacity}
                    </div>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: (course.enrolledCount || 0) >= course.capacity ? '#e11d48' : '#059669',
                      }}
                    >
                      {course.capacity - (course.enrolledCount || 0)} seats remaining
                    </span>
                  </div>

                  <Link
                    to={`/faculty/rosters?courseId=${course._id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      width: '100%',
                      padding: '0.625rem',
                      borderRadius: '0.375rem',
                      backgroundColor: '#f1f5f9',
                      color: '#0f172a',
                      fontWeight: 700,
                      fontSize: '0.8125rem',
                      textDecoration: 'none',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#059669';
                      e.currentTarget.style.color = '#ffffff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f1f5f9';
                      e.currentTarget.style.color = '#0f172a';
                    }}
                  >
                    <Users size={16} /> Open Course Roster
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyDashboard;
