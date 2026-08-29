import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  X,
} from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

export const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [modalError, setModalError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    courseCode: '',
    courseName: '',
    description: '',
    department: '',
    faculty: '',
    credits: 3,
    semester: 1,
    courseType: 'Core',
    capacity: 60,
    room: 'Lecture Hall 101',
    prerequisiteCodes: '',
    scheduleDay: 'Monday',
    startTime: '09:00',
    endTime: '10:30',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [coursesRes, deptsRes, facultyRes] = await Promise.all([
        api.get('/courses'),
        api.get('/departments'),
        api.get('/faculty'),
      ]);

      if (coursesRes.data?.success) setCourses(coursesRes.data.data);
      if (deptsRes.data?.success) {
        setDepartments(deptsRes.data.data);
        if (deptsRes.data.data.length > 0 && !formData.department) {
          setFormData((prev) => ({ ...prev, department: deptsRes.data.data[0]._id }));
        }
      }
      if (facultyRes.data?.success) setFacultyList(facultyRes.data.data);
    } catch (err) {
      console.error('Error loading courses management:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setEditingCourse(null);
    setFormData({
      courseCode: '',
      courseName: '',
      description: '',
      department: departments[0]?._id || '',
      faculty: '',
      credits: 3,
      semester: 1,
      courseType: 'Core',
      capacity: 60,
      room: 'Lecture Hall 101',
      prerequisiteCodes: '',
      scheduleDay: 'Monday',
      startTime: '09:00',
      endTime: '10:30',
    });
    setModalError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (course) => {
    setEditingCourse(course);
    const firstSchedule = course.schedules?.[0] || {};
    setFormData({
      courseCode: course.courseCode,
      courseName: course.courseName,
      description: course.description || '',
      department: course.department?._id || course.department || '',
      faculty: course.faculty?._id || course.faculty || '',
      credits: course.credits,
      semester: course.semester,
      courseType: course.courseType,
      capacity: course.capacity,
      room: course.room || 'Lecture Hall 101',
      prerequisiteCodes: (course.prerequisiteCodes || []).join(', '),
      scheduleDay: firstSchedule.day || 'Monday',
      startTime: firstSchedule.startTime || '09:00',
      endTime: firstSchedule.endTime || '10:30',
    });
    setModalError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setModalError('');
    setIsSubmitting(true);

    try {
      const prereqsArray = formData.prerequisiteCodes
        .split(',')
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean);

      const schedules = [
        {
          day: formData.scheduleDay,
          startTime: formData.startTime,
          endTime: formData.endTime,
        },
      ];

      const payload = {
        courseCode: formData.courseCode,
        courseName: formData.courseName,
        description: formData.description,
        department: formData.department,
        faculty: formData.faculty || undefined,
        credits: Number(formData.credits),
        semester: Number(formData.semester),
        courseType: formData.courseType,
        capacity: Number(formData.capacity),
        room: formData.room,
        prerequisiteCodes: prereqsArray,
        schedules,
      };

      if (editingCourse) {
        await api.put(`/courses/${editingCourse._id}`, payload);
        setToastMessage({ type: 'success', text: `Course ${payload.courseCode} updated!` });
      } else {
        await api.post('/courses', payload);
        setToastMessage({ type: 'success', text: `Course ${payload.courseCode} created!` });
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      setModalError(err.userMessage || 'Failed to save course.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCourse = async (course) => {
    if (!window.confirm(`Are you sure you want to delete ${course.courseCode} - ${course.courseName}?`)) {
      return;
    }

    try {
      const res = await api.delete(`/courses/${course._id}`);
      if (res.data?.success) {
        setToastMessage({ type: 'success', text: `Course deleted successfully.` });
        fetchData();
      }
    } catch (err) {
      setToastMessage({ type: 'error', text: err.userMessage || 'Failed to delete course.' });
    }
  };

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.courseCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.facultyName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept =
      selectedDept === 'ALL' ||
      c.department?._id === selectedDept ||
      c.department === selectedDept;
    return matchesSearch && matchesDept;
  });

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
            Course Management
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Create, configure prerequisites, allocate schedules, and monitor course enrollments.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} /> Add New Course
        </button>
      </div>

      {/* Filter Row */}
      <div className="academic-card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.25rem' }}
              placeholder="Search by code, title, instructor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="form-select"
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
          >
            <option value="ALL">All Departments</option>
            {departments.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading courses...</div>
      ) : (
        <div className="table-container">
          <table className="academic-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Course Name</th>
                <th>Department</th>
                <th>Instructor</th>
                <th>Credits</th>
                <th>Semester</th>
                <th>Seats</th>
                <th>Schedule</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', color: '#94a3b8', padding: '2.5rem' }}>
                    No courses found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredCourses.map((c) => (
                  <tr key={c._id}>
                    <td style={{ fontWeight: 800, color: '#2563eb' }}>{c.courseCode}</td>
                    <td style={{ fontWeight: 600, color: '#0f172a' }}>{c.courseName}</td>
                    <td>{c.department?.name || 'N/A'}</td>
                    <td>{c.facultyName || 'TBA'}</td>
                    <td>{c.credits} Cr</td>
                    <td>Sem {c.semester}</td>
                    <td>
                      <span style={{ fontWeight: 700, color: c.availableSeats === 0 ? '#e11d48' : '#059669' }}>
                        {c.enrolledCount} / {c.capacity} ({c.availableSeats} open)
                      </span>
                    </td>
                    <td style={{ fontSize: '0.75rem', color: '#475569' }}>
                      {c.schedules?.map((s) => `${s.day.slice(0, 3)} ${s.startTime}-${s.endTime}`).join(', ') || 'TBA'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.35rem 0.5rem' }}
                          onClick={() => handleOpenEdit(c)}
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          style={{ padding: '0.35rem 0.5rem' }}
                          onClick={() => handleDeleteCourse(c)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Course Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-dialog" style={{ maxWidth: '650px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingCourse ? `Edit Course: ${editingCourse.courseCode}` : 'Create New University Course'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                {modalError && (
                  <div style={{ padding: '0.75rem 1rem', backgroundColor: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '0.5rem', color: '#e11d48', fontSize: '0.8125rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertCircle size={16} /> <span>{modalError}</span>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Course Code *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. CS501"
                      value={formData.courseCode}
                      onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Course Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Advanced Machine Learning"
                      value={formData.courseName}
                      onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Department *</label>
                    <select
                      className="form-select"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      required
                    >
                      {departments.map((d) => (
                        <option key={d._id} value={d._id}>
                          {d.name} ({d.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Assigned Instructor</label>
                    <select
                      className="form-select"
                      value={formData.faculty}
                      onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                    >
                      <option value="">To be assigned</option>
                      {facultyList.map((f) => (
                        <option key={f._id} value={f._id}>
                          {f.name} ({f.department?.code || 'Dept'})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Credits *</label>
                    <input
                      type="number"
                      min="1"
                      max="8"
                      className="form-input"
                      value={formData.credits}
                      onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Semester *</label>
                    <select
                      className="form-select"
                      value={formData.semester}
                      onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                        <option key={s} value={s}>
                          Sem {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Type</label>
                    <select
                      className="form-select"
                      value={formData.courseType}
                      onChange={(e) => setFormData({ ...formData, courseType: e.target.value })}
                    >
                      <option value="Core">Core</option>
                      <option value="Elective">Elective</option>
                      <option value="Lab">Lab</option>
                      <option value="Seminar">Seminar</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Max Capacity *</label>
                    <input
                      type="number"
                      min="1"
                      className="form-input"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Class Day</label>
                    <select
                      className="form-select"
                      value={formData.scheduleDay}
                      onChange={(e) => setFormData({ ...formData, scheduleDay: e.target.value })}
                    >
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Start Time</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="09:00"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">End Time</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="10:30"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Venue / Room</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Lecture Hall 101"
                      value={formData.room}
                      onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Prerequisites (Comma-separated)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. CS201, CS403"
                      value={formData.prerequisiteCodes}
                      onChange={(e) => setFormData({ ...formData, prerequisiteCodes: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Course Description</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder="Brief syllabus outline and key learning outcomes..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving Course...' : editingCourse ? 'Update Course' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;
