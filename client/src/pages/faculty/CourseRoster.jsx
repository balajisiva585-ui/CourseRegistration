import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Users,
  BookOpen,
  Download,
  Search,
  Calendar,
  Clock,
  MapPin,
  Mail,
  GraduationCap,
  ChevronLeft,
  RefreshCw,
  FileSpreadsheet,
} from 'lucide-react';
import api from '../../services/api';

export const CourseRoster = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCourseId = searchParams.get('courseId') || '';

  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(initialCourseId);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  // Fetch all assigned courses with rosters
  const fetchFacultyCourses = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/faculty/me/courses');
      if (res.data?.success) {
        const fetchedCourses = res.data.data || [];
        setCourses(fetchedCourses);

        if (fetchedCourses.length > 0) {
          if (!selectedCourseId || !fetchedCourses.some((c) => c._id === selectedCourseId)) {
            setSelectedCourseId(fetchedCourses[0]._id);
          }
        }
      }
    } catch (err) {
      setError(err.userMessage || 'Failed to load course rosters.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacultyCourses();
  }, []);

  const handleCourseChange = (id) => {
    setSelectedCourseId(id);
    setSearchParams({ courseId: id });
  };

  const activeCourse = courses.find((c) => c._id === selectedCourseId) || null;
  const enrolledStudents = activeCourse?.students || [];

  // Filter students by search term
  const filteredStudents = enrolledStudents.filter((item) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const stu = item.student;
    return (
      stu?.name?.toLowerCase().includes(term) ||
      stu?.studentId?.toLowerCase().includes(term) ||
      stu?.email?.toLowerCase().includes(term) ||
      stu?.department?.name?.toLowerCase().includes(term)
    );
  });

  // Export roster to CSV
  const exportRosterCSV = () => {
    if (!activeCourse || enrolledStudents.length === 0) return;

    const headers = ['Registration ID', 'Student ID', 'Student Name', 'Email', 'Department', 'Semester', 'Batch', 'Registration Date'];
    const rows = enrolledStudents.map((item) => [
      item.registrationId,
      item.student?.studentId || 'N/A',
      item.student?.name || 'N/A',
      item.student?.email || 'N/A',
      item.student?.department?.name || 'N/A',
      `Semester ${item.student?.currentSemester || 'N/A'}`,
      item.student?.batch || 'N/A',
      item.registrationDate ? new Date(item.registrationDate).toLocaleDateString() : 'N/A',
    ]);

    const escapeCell = (val) => `"${String(val).replace(/"/g, '""')}"`;
    const csvContent = [headers.map(escapeCell).join(','), ...rows.map((r) => r.map(escapeCell).join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `roster_${activeCourse.courseCode}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading roster data...</div>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Back and Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <Link
            to="/faculty/dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.8125rem',
              color: '#64748b',
              fontWeight: 600,
              marginBottom: '0.5rem',
              textDecoration: 'none',
            }}
          >
            <ChevronLeft size={16} /> Back to Assigned Courses
          </Link>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Users color="#059669" size={28} />
            Class Rosters & Enrolled Students
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            View, search, and download student enrollment rosters for your instructed courses.
          </p>
        </div>

        <button
          onClick={exportRosterCSV}
          disabled={!activeCourse || enrolledStudents.length === 0}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#059669',
            color: '#ffffff',
            padding: '0.625rem 1.25rem',
            borderRadius: '0.5rem',
            border: 'none',
            fontWeight: 700,
            fontSize: '0.875rem',
            cursor: !activeCourse || enrolledStudents.length === 0 ? 'not-allowed' : 'pointer',
            opacity: !activeCourse || enrolledStudents.length === 0 ? 0.6 : 1,
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <Download size={18} /> Export Roster CSV
        </button>
      </div>

      {courses.length === 0 ? (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', padding: '3rem', textAlign: 'center', border: '1px solid #e2e8f0', color: '#64748b' }}>
          No courses currently assigned to your account.
        </div>
      ) : (
        <>
          {/* Course Selector Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              backgroundColor: '#f1f5f9',
              padding: '0.375rem',
              borderRadius: '0.75rem',
              marginBottom: '1.5rem',
              overflowX: 'auto',
            }}
          >
            {courses.map((course) => {
              const isActive = course._id === selectedCourseId;
              return (
                <button
                  key={course._id}
                  onClick={() => handleCourseChange(course._id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    padding: '0.625rem 1.25rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    backgroundColor: isActive ? '#ffffff' : 'transparent',
                    color: isActive ? '#059669' : '#64748b',
                    fontWeight: isActive ? 800 : 600,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ fontFamily: 'monospace' }}>{course.courseCode}</span>
                  <span style={{ fontSize: '0.75rem', color: isActive ? '#047857' : '#94a3b8' }}>
                    ({course.students?.length || 0} students)
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Course Banner */}
          {activeCourse && (
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                border: '1px solid #e2e8f0',
                boxShadow: 'var(--shadow-sm)',
                marginBottom: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1.5rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                  <span
                    style={{
                      backgroundColor: '#ecfdf5',
                      color: '#047857',
                      fontWeight: 800,
                      fontSize: '0.875rem',
                      padding: '0.25rem 0.625rem',
                      borderRadius: '0.375rem',
                      fontFamily: 'monospace',
                    }}
                  >
                    {activeCourse.courseCode}
                  </span>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                    {activeCourse.courseName}
                  </h2>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8125rem', color: '#64748b', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Calendar size={15} color="#2563eb" />
                    {activeCourse.schedule?.days?.join(', ') || 'TBA'}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Clock size={15} color="#059669" />
                    {activeCourse.schedule?.startTime} - {activeCourse.schedule?.endTime}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <MapPin size={15} color="#7c3aed" />
                    {activeCourse.schedule?.room || 'TBA'}
                  </span>
                  <span>{activeCourse.credits} Credits</span>
                </div>
              </div>

              {/* Quick Roster Stats */}
              <div style={{ display: 'flex', gap: '1.25rem', textAlign: 'center' }}>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem 1.25rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#059669' }}>
                    {enrolledStudents.length}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                    Enrolled
                  </div>
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem 1.25rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
                    {activeCourse.capacity}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                    Capacity
                  </div>
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem 1.25rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2563eb' }}>
                    {activeCourse.capacity > 0 ? `${Math.round((enrolledStudents.length / activeCourse.capacity) * 100)}%` : '0%'}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                    Fill Rate
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search Table Filter */}
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
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '0.5rem',
                padding: '0.375rem 0.75rem',
                width: '320px',
              }}
            >
              <Search size={16} color="#94a3b8" />
              <input
                type="text"
                placeholder="Search students by name, ID, email..."
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

            <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>
              Showing <strong>{filteredStudents.length}</strong> of {enrolledStudents.length} enrolled students
            </div>
          </div>

          {/* Student Roster Table */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.75rem',
              border: '1px solid #e2e8f0',
              boxShadow: 'var(--shadow-sm)',
              overflow: 'hidden',
            }}
          >
            {filteredStudents.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                No students enrolled in this section yet.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>#</th>
                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>STUDENT ID</th>
                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>FULL NAME</th>
                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>EMAIL</th>
                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>DEPARTMENT</th>
                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>SEMESTER</th>
                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>BATCH</th>
                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>REGISTERED DATE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((item, idx) => {
                      const stu = item.student;
                      return (
                        <tr
                          key={item.registrationId || idx}
                          style={{
                            borderBottom: '1px solid #f1f5f9',
                            fontSize: '0.8125rem',
                            color: '#334155',
                            backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafafa',
                          }}
                        >
                          <td style={{ padding: '0.75rem 1rem', color: '#94a3b8' }}>{idx + 1}</td>
                          <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: 700, color: '#2563eb' }}>
                            {stu?.studentId || 'N/A'}
                          </td>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#0f172a' }}>
                            {stu?.name || 'N/A'}
                          </td>
                          <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>
                            {stu?.email || 'N/A'}
                          </td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            {stu?.department?.name || 'N/A'}
                          </td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            Semester {stu?.currentSemester || 'N/A'}
                          </td>
                          <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>
                            {stu?.batch || 'N/A'}
                          </td>
                          <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>
                            {item.registrationDate ? new Date(item.registrationDate).toLocaleDateString() : 'N/A'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CourseRoster;
