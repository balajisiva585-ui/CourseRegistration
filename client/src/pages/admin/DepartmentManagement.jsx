import React, { useState, useEffect } from 'react';
import { Building2, Plus, Edit2, Trash2, CheckCircle2, AlertCircle, X } from 'lucide-react';
import api from '../../services/api';

export const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [modalError, setModalError] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    departmentId: '',
    headOfDepartment: '',
    description: '',
  });

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/departments');
      if (res.data?.success) {
        setDepartments(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching departments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleOpenAdd = () => {
    setEditingDept(null);
    setFormData({
      name: '',
      code: '',
      departmentId: `DEP-${Math.floor(100 + Math.random() * 900)}`,
      headOfDepartment: '',
      description: '',
    });
    setModalError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (d) => {
    setEditingDept(d);
    setFormData({
      name: d.name,
      code: d.code,
      departmentId: d.departmentId,
      headOfDepartment: d.headOfDepartment || '',
      description: d.description || '',
    });
    setModalError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setModalError('');

    try {
      if (editingDept) {
        await api.put(`/departments/${editingDept._id}`, formData);
        setToastMessage({ type: 'success', text: 'Department updated.' });
      } else {
        await api.post('/departments', formData);
        setToastMessage({ type: 'success', text: 'Department created.' });
      }

      setIsModalOpen(false);
      fetchDepartments();
    } catch (err) {
      setModalError(err.userMessage || 'Failed to save department.');
    }
  };

  const handleDelete = async (d) => {
    if (!window.confirm(`Delete department ${d.name}?`)) return;

    try {
      const res = await api.delete(`/departments/${d._id}`);
      if (res.data?.success) {
        setToastMessage({ type: 'success', text: 'Department deleted.' });
        fetchDepartments();
      }
    } catch (err) {
      setToastMessage({ type: 'error', text: err.userMessage || 'Failed to delete department.' });
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
            Academic Departments
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Manage university faculties, Department Heads, and department curriculum mappings.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} /> Add Department
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading departments...</div>
      ) : (
        <div className="table-container">
          <table className="academic-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Department Name</th>
                <th>Head of Department</th>
                <th>Courses</th>
                <th>Enrolled Students</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((d) => (
                <tr key={d._id}>
                  <td style={{ fontWeight: 800, color: '#2563eb' }}>{d.code}</td>
                  <td style={{ fontWeight: 700, color: '#0f172a' }}>{d.name}</td>
                  <td>{d.headOfDepartment || 'TBA'}</td>
                  <td>
                    <span className="badge badge-blue">{d.courseCount || 0} Courses</span>
                  </td>
                  <td>{d.studentCount || 0} Students</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button className="btn btn-secondary btn-sm" style={{ padding: '0.35rem 0.5rem' }} onClick={() => handleOpenEdit(d)}>
                        <Edit2 size={13} />
                      </button>
                      <button className="btn btn-outline-danger btn-sm" style={{ padding: '0.35rem 0.5rem' }} onClick={() => handleDelete(d)}>
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
                {editingDept ? `Edit Department: ${editingDept.name}` : 'Create Department'}
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

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Department Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Dept Code *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Head of Department (HOD)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.headOfDepartment}
                    onChange={(e) => setFormData({ ...formData, headOfDepartment: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingDept ? 'Update Department' : 'Save Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentManagement;
