import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2, Search, CheckCircle2, AlertCircle, BookOpen, X } from 'lucide-react';
import api from '../../services/api';

export const FacultyManagement = () => {
  const [faculty, setFaculty] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [modalError, setModalError] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    facultyId: '',
    department: '',
    phone: '',
    specialization: '',
    officeRoom: 'Faculty Block B-201',
    password: 'Faculty@123',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [facRes, deptRes] = await Promise.all([
        api.get('/faculty'),
        api.get('/departments'),
      ]);

      if (facRes.data?.success) setFaculty(facRes.data.data);
      if (deptRes.data?.success) {
        setDepartments(deptRes.data.data);
        if (deptRes.data.data.length > 0 && !formData.department) {
          setFormData((prev) => ({ ...prev, department: deptRes.data.data[0]._id }));
        }
      }
    } catch (err) {
      console.error('Error fetching faculty:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setEditingFaculty(null);
    setFormData({
      name: '',
      email: '',
      facultyId: '',
      department: departments[0]?._id || '',
      phone: '',
      specialization: '',
      officeRoom: 'Faculty Block B-201',
      password: 'Faculty@123',
    });
    setModalError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (f) => {
    setEditingFaculty(f);
    setFormData({
      name: f.name,
      email: f.email,
      facultyId: f.facultyId,
      department: f.department?._id || f.department || '',
      phone: f.phone || '',
      specialization: f.specialization || '',
      officeRoom: f.officeRoom || 'Faculty Block',
      password: '',
    });
    setModalError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setModalError('');

    try {
      if (editingFaculty) {
        await api.put(`/faculty/${editingFaculty._id}`, formData);
        setToastMessage({ type: 'success', text: `Faculty profile updated.` });
      } else {
        await api.post('/faculty', formData);
        setToastMessage({ type: 'success', text: `Faculty member created successfully.` });
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      setModalError(err.userMessage || 'Failed to save faculty.');
    }
  };

  const handleDelete = async (f) => {
    if (!window.confirm(`Delete faculty member ${f.name} (${f.facultyId})?`)) return;

    try {
      const res = await api.delete(`/faculty/${f._id}`);
      if (res.data?.success) {
        setToastMessage({ type: 'success', text: 'Faculty deleted.' });
        fetchData();
      }
    } catch (err) {
      setToastMessage({ type: 'error', text: err.userMessage || 'Failed to delete faculty.' });
    }
  };

  const filteredFaculty = faculty.filter((f) => {
    return (
      f.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.facultyId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
    );
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
            Faculty Directory & Course Assignments
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Manage teaching staff, departmental assignments, and course allocations.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} /> Add New Faculty
        </button>
      </div>

      {/* Filter */}
      <div className="academic-card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.25rem' }}
            placeholder="Search by instructor name, ID, specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading faculty directory...</div>
      ) : (
        <div className="table-container">
          <table className="academic-table">
            <thead>
              <tr>
                <th>Faculty ID</th>
                <th>Instructor Name</th>
                <th>Department</th>
                <th>Specialization</th>
                <th>Assigned Courses</th>
                <th>Office Venue</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFaculty.map((f) => (
                <tr key={f._id}>
                  <td style={{ fontWeight: 800, color: '#2563eb' }}>{f.facultyId}</td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{f.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{f.email}</div>
                  </td>
                  <td>{f.department?.name || 'N/A'}</td>
                  <td style={{ fontSize: '0.8125rem' }}>{f.specialization || 'General'}</td>
                  <td>
                    <span className="badge badge-blue">
                      {f.assignedCourses?.length || 0} Courses
                    </span>
                  </td>
                  <td>{f.officeRoom || 'N/A'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button className="btn btn-secondary btn-sm" style={{ padding: '0.35rem 0.5rem' }} onClick={() => handleOpenEdit(f)}>
                        <Edit2 size={13} />
                      </button>
                      <button className="btn btn-outline-danger btn-sm" style={{ padding: '0.35rem 0.5rem' }} onClick={() => handleDelete(f)}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingFaculty ? `Edit Faculty: ${editingFaculty.name}` : 'Add Faculty Member'}
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
                    <label className="form-label">Faculty ID *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.facultyId}
                      onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
                    <label className="form-label">Specialization</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    />
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
                    <label className="form-label">Office Venue</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.officeRoom}
                      onChange={(e) => setFormData({ ...formData, officeRoom: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingFaculty ? 'Update Faculty' : 'Save Faculty'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyManagement;
