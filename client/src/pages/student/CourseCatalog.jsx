import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  ArrowUpDown,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import api from '../../services/api';
import CourseCard from '../../components/CourseCard';
import ConflictModal from '../../components/ConflictModal';

export const CourseCatalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [registeringId, setRegisteringId] = useState(null);
  const [conflictModal, setConflictModal] = useState({ isOpen: false, data: null, course: null });
  const [toastMessage, setToastMessage] = useState(null);

  const navigate = useNavigate();

  // Filters State
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedDept, setSelectedDept] = useState(searchParams.get('department') || 'ALL');
  const [selectedSem, setSelectedSem] = useState(searchParams.get('semester') || 'ALL');
  const [selectedCredits, setSelectedCredits] = useState(searchParams.get('credits') || 'ALL');
  const [selectedType, setSelectedType] = useState(searchParams.get('courseType') || 'ALL');
  const [availableOnly, setAvailableOnly] = useState(searchParams.get('availableOnly') === 'true');
  const [sortBy, setSortBy] = useState('courseCode');
  const [sortOrder, setSortOrder] = useState('asc');

  // Load departments
  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const res = await api.get('/departments');
        if (res.data?.success) {
          setDepartments(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching departments:', err);
      }
    };
    fetchDepts();
  }, []);

  // Fetch Courses with filters
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const params = {
        q: searchTerm.trim() || undefined,
        department: selectedDept !== 'ALL' ? selectedDept : undefined,
        semester: selectedSem !== 'ALL' ? selectedSem : undefined,
        credits: selectedCredits !== 'ALL' ? selectedCredits : undefined,
        courseType: selectedType !== 'ALL' ? selectedType : undefined,
        availableOnly: availableOnly ? 'true' : undefined,
        sortBy,
        order: sortOrder,
      };

      const res = await api.get('/courses', { params });
      if (res.data?.success) {
        setCourses(res.data.data);
      }
    } catch (err) {
      setError(err.userMessage || 'Failed to load courses.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedDept, selectedSem, selectedCredits, selectedType, availableOnly, sortBy, sortOrder]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleRegisterCourse = async (course) => {
    try {
      setRegisteringId(course._id);
      const res = await api.post('/registrations', { courseId: course._id });
      if (res.data?.success) {
        setToastMessage({
          type: 'success',
          text: `Success! You are now enrolled in ${course.courseCode} - ${course.courseName}.`,
        });
        fetchCourses();
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

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedDept('ALL');
    setSelectedSem('ALL');
    setSelectedCredits('ALL');
    setSelectedType('ALL');
    setAvailableOnly(false);
    setSortBy('courseCode');
    setSortOrder('asc');
  };

  return (
    <div className="page-body">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="toast-container">
          <div className={`toast toast-${toastMessage.type}`}>
            {toastMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{toastMessage.text}</span>
            <button
              onClick={() => setToastMessage(null)}
              style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
            Course Catalog & Registration
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Browse available university courses, verify prerequisites, and secure your schedule slots.
          </p>
        </div>

        <button className="btn btn-secondary btn-sm" onClick={fetchCourses}>
          <RefreshCw size={14} /> Refresh Catalog
        </button>
      </div>

      {/* Filter & Search Bar Panel */}
      <div className="academic-card" style={{ marginBottom: '1.75rem', padding: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.25rem' }}
              placeholder="Search code, course name, faculty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Department */}
          <select
            className="form-select"
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
          >
            <option value="ALL">All Departments</option>
            {departments.map((d) => (
              <option key={d._id} value={d._id}>
                {d.code} - {d.name}
              </option>
            ))}
          </select>

          {/* Semester */}
          <select
            className="form-select"
            value={selectedSem}
            onChange={(e) => setSelectedSem(e.target.value)}
          >
            <option value="ALL">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <option key={s} value={s}>
                Semester {s}
              </option>
            ))}
          </select>

          {/* Course Type */}
          <select
            className="form-select"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="ALL">All Types</option>
            <option value="Core">Core</option>
            <option value="Elective">Elective</option>
            <option value="Lab">Lab</option>
            <option value="Seminar">Seminar</option>
          </select>

          {/* Credits */}
          <select
            className="form-select"
            value={selectedCredits}
            onChange={(e) => setSelectedCredits(e.target.value)}
          >
            <option value="ALL">All Credits</option>
            <option value="1">1 Credit</option>
            <option value="2">2 Credits</option>
            <option value="3">3 Credits</option>
            <option value="4">4 Credits</option>
          </select>
        </div>

        {/* Second Row: Available Seats Toggle, Sort, Reset */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#334155', cursor: 'pointer', fontWeight: 600 }}>
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: '#2563eb' }}
            />
            Show Available Seats Only (Exclude Full Courses)
          </label>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}>
              <ArrowUpDown size={14} color="#64748b" />
              <span style={{ color: '#64748b', fontWeight: 600 }}>Sort By:</span>
              <select
                className="form-select"
                style={{ padding: '0.35rem 0.6rem', fontSize: '0.8125rem', width: 'auto' }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="courseCode">Course Code</option>
                <option value="courseName">Course Name</option>
                <option value="credits">Credits</option>
                <option value="availableSeats">Available Seats</option>
              </select>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.35rem 0.5rem' }}
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                title="Toggle Sort Order"
              >
                {sortOrder.toUpperCase()}
              </button>
            </div>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleResetFilters}
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div style={{ marginBottom: '1rem', fontSize: '0.8125rem', color: '#64748b', fontWeight: 600 }}>
        Showing {courses.length} course{courses.length === 1 ? '' : 's'}
      </div>

      {/* Course Grid */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
          Loading course catalog...
        </div>
      ) : courses.length === 0 ? (
        <div className="academic-card" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
          <BookOpen size={40} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
          <h3 style={{ color: '#475569', marginBottom: '0.25rem' }}>No Courses Found</h3>
          <p style={{ fontSize: '0.875rem' }}>Try adjusting your search terms or filter criteria.</p>
          <button className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }} onClick={handleResetFilters}>
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="course-grid">
          {courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              onRegister={handleRegisterCourse}
              onViewDetails={(c) => navigate(`/student/courses/${c._id}`)}
              onShowConflict={(conflictData, c) =>
                setConflictModal({ isOpen: true, data: conflictData, course: c })
              }
              isRegistering={registeringId === course._id}
            />
          ))}
        </div>
      )}

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

export default CourseCatalog;
