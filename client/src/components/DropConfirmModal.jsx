import React, { useState } from 'react';
import { AlertCircle, Trash2, X } from 'lucide-react';

export const DropConfirmModal = ({ isOpen, onClose, onConfirm, course, isSubmitting = false }) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(reason);
    setReason('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" style={{ borderBottomColor: '#fecdd3', backgroundColor: '#fff1f2' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#ffe4e6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#e11d48',
              }}
            >
              <Trash2 size={20} />
            </div>
            <h3 className="modal-title" style={{ color: '#9f1239' }}>
              Confirm Course Drop
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#9f1239',
              padding: '0.25rem',
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ color: '#334155', fontSize: '0.9375rem', marginBottom: '1rem' }}>
            Are you sure you want to drop{' '}
            <strong>
              {course?.courseCode} - {course?.courseName}
            </strong>{' '}
            ({course?.credits} Credits)?
          </p>

          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#fff1f2',
              border: '1px solid #fecdd3',
              borderRadius: '0.5rem',
              fontSize: '0.8125rem',
              color: '#9f1239',
              marginBottom: '1.25rem',
            }}
          >
            <strong>Note:</strong> Dropping this course will immediately release your seat to other waiting students and update your registered credits.
          </div>

          <div className="form-group">
            <label className="form-label">Optional Drop Reason</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="e.g. Schedule adjustment, choosing alternative elective, workload rebalancing..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={handleConfirm} disabled={isSubmitting}>
            {isSubmitting ? 'Dropping...' : 'Yes, Drop Course'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DropConfirmModal;
