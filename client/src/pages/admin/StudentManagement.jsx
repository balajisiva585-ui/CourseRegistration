import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle,
  Eye,
  X,
} from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

export const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedStudentDetail, setSelectedStudentDetail] = useState(null);
  const [modalError, setModalError] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    department: '',
    currentSemester: 1,
    phone: '',
    batch: '2024-2028',
    status: 'Active',
    password: 'Student@123',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentsRes, deptsRes] = await Promise.all([
        api.get('/students'),
        api.get('/departments'),
      ]);

      if (studentsRes.data?.success) setStudents(studentsRes.data.data);
      if (deptsRes.data?.success) {
        setDepartments(deptsRes.data.data);
        if (deptsRes.data.data.length > 0 && !formData.department) {
          setFormData((prev) => ({ ...prev, department: deptsRes.data.data[0]._id }));
        }
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setFormData({
      name: '',
      email: '',
      studentId: '',
      department: departments[0]?._id || '',
      currentSemester: 1,
      phone: '',
      batch: '2024-2028',
      status: 'Active',
      password: 'Student@123',
    });
    setModalError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      studentId: student.studentId,
      department: student.department?._id || student.department || '',
      currentSemester: student.currentSemester,
      phone: student.phone || '',
      batch: student.batch || '2022-2026',
      status: student.status || 'Active',
      password: '',
    });
    setModalError('');
    setIsModalOpen(true);
  };

  const handleViewDetails = async (student) => {
    try {
      const res = await api.get(`/students/${student._id}`);
      if (res.data?.success) {
        setSelectedStudentDetail(res.data.data);
        setIsDetailModalOpen(true);
      }
    } catch (err) {
      console.error('Error viewing student details:', err);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setModalError('');

    try {
      if (editingStudent) {
        await api.put(`/students/${editingStudent._id}`, formData);
        setToastMessage({ type: 'success', text: `Student ${formData.studentId} updated!` });
      } else {
        await api.post('/students', formData);
        setToastMessage({ type: 'success', text: `Student ${formData.studentId} created!` });
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      setModalError(err.userMessage || 'Failed to save student.');
    }
  };

  const handleDelete = async (student) => {
    if (!window.confirm(`Are you sure you want to delete student ${student.name} (${student.studentId})?`)) {
      return;
    }

    try {
      const res = await api.delete(`/students/${student._id}`);
      if (res.data?.success) {
        setToastMessage({ type: 'success', text: 'Student deleted.' });
        fetchData();
      }
    } catch (err) {
      setToastMessage({ type: 'error', text: err.userMessage || 'Failed to delete student.' });
    }
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept =
      selectedDept === 'ALL' ||
      s.department?._id === selectedDept ||
      s.department === selectedDept;
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
            Student Directory & Management
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            View academic profiles, manage student records, and inspect enrolled courses.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} /> Add New Student
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
              placeholder="Search by student name, ID, or email..."
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
        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading student records...</div>
      ) : (
        <div className="table-container">
          <table className="academic-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Semester</th>
                <th>Completed Credits</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', color: '#94a3b8', padding: '2.5rem' }}>
                    No student records found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s._id}>
                    <td style={{ fontWeight: 800, color: '#2563eb' }}>{s.studentId}</td>
                    <td style={{ fontWeight: 600, color: '#0f172a' }}>{s.name}</td>
                    <td style={{ color: '#64748b' }}>{s.email}</td>
                    <td>{s.department?.name || 'N/A'}</td>
                    <td>Semester {s.currentSemester}</td>
                    <td>{s.completedCredits || 0} Cr</td>
                    <td>
                      <StatusBadge status={s.status} text={s.status} />
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.35rem 0.5rem' }}
                          title="View Records"
                          onClick={() => handleViewDetails(s)}
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.35rem 0.5rem' }}
                          onClick={() => handleOpenEdit(s)}
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          style={{ padding: '0.35rem 0.5rem' }}
                          onClick={() => handleDelete(s)}
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

      {/* Add / Edit Student Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingStudent ? `Edit Student: ${editingStudent.studentId}` : 'Add New Student'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                {modalError && (
                  <div style={{ padding: '0.75rem 1rem', backgroundColor: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '0.5rem', color: '#e11d48', fontSize: '0.8125rem', marginBottom: '1rem' }}>
                    {modalError}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Student ID *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.studentId}
                      onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    className="form-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Department *</label>
                    <select
                      className="form-select"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    >
                      {departments.map((d) => (
                        <option key={d._id} value={d._id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Semester</label>
                    <select
                      className="form-select"
                      value={formData.currentSemester}
                      onChange={(e) => setFormData({ ...formData, currentSemester: e.target.value })}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                        <option key={s} value={s}>
                          Sem {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Batch</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.batch}
                      onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingStudent ? 'Update Student' : 'Create Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Details Inspection Modal */}
      {isDetailModalOpen && selectedStudentDetail && (
        <div className="modal-overlay" onClick={() => setIsDetailModalOpen(false)}>
          <div className="modal-dialog" style={{ maxWidth: '650px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                Academic Dossier: {selectedStudentDetail.student?.name} ({selectedStudentDetail.student?.studentId})
              </h3>
              <button onClick={() => setIsDetailModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '0.5rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>DEPARTMENT</div>
                  <div style={{ fontWeight: 700 }}>{selectedStudentDetail.student?.department?.name}</div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '0.5rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>COMPLETED CREDITS</div>
                  <div style={{ fontWeight: 700, color: '#10b981' }}>{selectedStudentDetail.student?.completedCredits} / 160 Cr</div>
                </div>
              </div>

              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Active Registrations ({selectedStudentDetail.registrations?.length || 0})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
                {selectedStudentDetail.registrations?.map((r) => (
                  <div
                    key={r._id}
                    style={{
                      padding: '0.5rem 0.75rem',
                      backgroundColor: '#eff6ff',
                      borderRadius: '0.375rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 800, color: '#2563eb' }}>{r.course?.courseCode}</span>{' '}
                      <span>{r.course?.courseName}</span>
                    </div>
                    <span className="badge badge-emerald">{r.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setIsDetailModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
