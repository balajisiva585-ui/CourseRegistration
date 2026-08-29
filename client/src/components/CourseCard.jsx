import React from 'react';
import {
  BookOpen,
  Calendar,
  Check,
  CheckCircle,
  Clock,
  MapPin,
  User,
  AlertTriangle,
  Lock,
} from 'lucide-react';
import StatusBadge from './StatusBadge';

export const CourseCard = ({
  course,
  onRegister,
  onViewDetails,
  onShowConflict,
  isRegistering = false,
}) => {
  const isRegistered = course.isRegistered;
  const isFull = (course.availableSeats || 0) <= 0;
  const isPrereqSatisfied = course.prereqCheck ? course.prereqCheck.isSatisfied : true;
  const hasConflict = course.conflictCheck ? course.conflictCheck.hasConflict : false;

  const capacity = course.capacity || 60;
  const enrolled = course.enrolledCount || 0;
  const available = course.availableSeats ?? Math.max(0, capacity - enrolled);
  const fillPercentage = Math.min(100, Math.round((enrolled / capacity) * 100));

  const handleActionClick = () => {
    if (isRegistered) return;
    if (hasConflict) {
      if (onShowConflict) onShowConflict(course.conflictCheck, course);
      return;
    }
    if (onRegister) {
      onRegister(course);
    }
  };

  return (
    <div className="course-card">
      <div className="course-card-top">
        <span className="course-code-tag">{course.courseCode}</span>
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          <StatusBadge status={course.courseType || 'Core'} text={`${course.credits} Credits`} />
          <StatusBadge status={course.courseType} text={course.courseType} />
        </div>
      </div>

      <h3 className="course-name-title">{course.courseName}</h3>

      <div style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <User size={14} color="#3b82f6" />
          <span>{course.facultyName || course.faculty?.name || 'Faculty TBA'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <MapPin size={14} color="#64748b" />
          <span>{course.room || 'Lecture Hall'} • Sem {course.semester}</span>
        </div>
      </div>

      {/* Schedule slots */}
      {course.schedules && course.schedules.length > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.75rem',
            color: '#475569',
            backgroundColor: '#f1f5f9',
            padding: '0.375rem 0.625rem',
            borderRadius: '0.375rem',
            marginBottom: '0.75rem',
          }}
        >
          <Clock size={13} color="#2563eb" />
          <span>
            {course.schedules.map((s) => `${s.day.slice(0, 3)} ${s.startTime}-${s.endTime}`).join(' | ')}
          </span>
        </div>
      )}

      {/* Prerequisite Indicator */}
      {course.prereqCheck && (
        <div style={{ marginBottom: '0.75rem', fontSize: '0.75rem' }}>
          {isPrereqSatisfied ? (
            <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
              <CheckCircle size={13} />
              Prerequisites satisfied
            </span>
          ) : (
            <span style={{ color: '#d97706', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
              <AlertTriangle size={13} />
              Requires: {course.prereqCheck.missingPrereqs.join(', ')}
            </span>
          )}
        </div>
      )}

      {/* Seat Availability Bar */}
      <div className="course-seat-meter">
        <div className="course-seat-header">
          <span>Seat Availability</span>
          {isFull ? (
            <span style={{ color: '#e11d48', fontWeight: 700 }}>🔴 Course Full</span>
          ) : (
            <span style={{ color: '#059669', fontWeight: 700 }}>
              🟢 {available} seat{available === 1 ? '' : 's'} available
            </span>
          )}
        </div>
        <div className="progress-container">
          <div
            className="progress-bar-fill"
            style={{
              width: `${fillPercentage}%`,
              background: isFull
                ? '#e11d48'
                : fillPercentage > 85
                ? '#f59e0b'
                : 'linear-gradient(90deg, #3b82f6, #2563eb)',
            }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: '#94a3b8', marginTop: '0.25rem' }}>
          <span>Enrolled: {enrolled}</span>
          <span>Max Capacity: {capacity}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="course-action-footer">
        <button
          className="btn btn-secondary btn-sm"
          style={{ flex: 1 }}
          onClick={() => onViewDetails && onViewDetails(course)}
        >
          Details
        </button>

        {isRegistered ? (
          <button
            className="btn btn-success btn-sm"
            style={{ flex: 1.5, cursor: 'default' }}
            disabled
          >
            <Check size={14} /> Registered ✓
          </button>
        ) : hasConflict ? (
          <button
            className="btn btn-sm"
            style={{
              flex: 1.5,
              backgroundColor: '#fff1f2',
              color: '#e11d48',
              borderColor: '#fecdd3',
            }}
            onClick={handleActionClick}
          >
            <AlertTriangle size={14} /> Time Conflict
          </button>
        ) : !isPrereqSatisfied ? (
          <button
            className="btn btn-sm"
            style={{
              flex: 1.5,
              backgroundColor: '#fffbeb',
              color: '#b45309',
              borderColor: '#fde68a',
            }}
            onClick={() => onViewDetails && onViewDetails(course)}
          >
            <Lock size={14} /> Prereq Needed
          </button>
        ) : isFull ? (
          <button className="btn btn-secondary btn-sm" style={{ flex: 1.5 }} disabled>
            Course Full
          </button>
        ) : (
          <button
            className="btn btn-primary btn-sm"
            style={{ flex: 1.5 }}
            onClick={handleActionClick}
            disabled={isRegistering}
          >
            {isRegistering ? 'Registering...' : 'Register Course'}
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
