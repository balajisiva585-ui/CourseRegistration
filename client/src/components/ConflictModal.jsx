import React from 'react';
import { AlertTriangle, Clock, Calendar, X } from 'lucide-react';

export const ConflictModal = ({ isOpen, onClose, conflictData, targetCourse }) => {
  if (!isOpen) return null;

  const conflicts = conflictData?.conflictDetails || conflictData?.conflicts || [];

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
              <AlertTriangle size={20} />
            </div>
            <h3 className="modal-title" style={{ color: '#9f1239' }}>
              Schedule Conflict Detected
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
          <p style={{ color: '#475569', fontSize: '0.875rem', marginBottom: '1rem' }}>
            Cannot register for <strong>{targetCourse?.courseCode} - {targetCourse?.courseName}</strong> because it creates a timetable overlap with your already registered courses.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
            {conflicts.map((conflict, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  padding: '0.875rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Calendar size={16} color="#2563eb" />
                  <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.875rem' }}>
                    {conflict.day}
                  </span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.75rem',
                    fontSize: '0.8125rem',
                  }}
                >
                  <div style={{ backgroundColor: '#eff6ff', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #bfdbfe' }}>
                    <div style={{ color: '#1e40af', fontWeight: 600 }}>Attempting Course:</div>
                    <div style={{ fontWeight: 700 }}>{targetCourse?.courseCode}</div>
                    <div style={{ color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                      <Clock size={12} /> {conflict.newCourseTime || 'Class slot'}
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#fef2f2', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #fecdd3' }}>
                    <div style={{ color: '#991b1b', fontWeight: 600 }}>Conflicting Enrolled:</div>
                    <div style={{ fontWeight: 700 }}>{conflict.conflictingCourseCode || conflict.conflictingCourseName}</div>
                    <div style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                      <Clock size={12} /> {conflict.existingCourseTime || 'Enrolled slot'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: '0.5rem',
              fontSize: '0.8125rem',
              color: '#92400e',
            }}
          >
            <strong>Advisor Tip:</strong> To take this course, you will need to either drop the conflicting course or select an alternative elective slot.
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Understand & Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConflictModal;
