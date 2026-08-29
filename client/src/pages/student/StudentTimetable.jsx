import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Printer,
  Download,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';
import api from '../../services/api';

export const StudentTimetable = () => {
  const [timetableData, setTimetableData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const timeSlots = [
    '08:00 - 09:30',
    '09:00 - 10:30',
    '10:30 - 12:00',
    '11:00 - 12:30',
    '12:30 - 14:00',
    '14:00 - 15:30',
    '14:00 - 16:00',
    '16:00 - 17:30',
  ];

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const res = await api.get('/timetable/student');
      if (res.data?.success) {
        setTimetableData(res.data.data);
      }
    } catch (err) {
      setError(err.userMessage || 'Failed to load timetable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="page-body">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
            Weekly Class Timetable
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Interactive timetable automatically generated from your registered courses.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={handlePrint}>
            <Printer size={14} /> Print Timetable
          </button>
          <Link to="/student/courses" className="btn btn-primary btn-sm">
            <BookOpen size={14} /> Add / Change Classes
          </Link>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Generating your weekly timetable...</div>
      ) : !timetableData || timetableData.totalSlots === 0 ? (
        <div className="academic-card" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
          <Calendar size={44} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
          <h3 style={{ color: '#475569', marginBottom: '0.25rem' }}>No Classes Scheduled</h3>
          <p style={{ fontSize: '0.875rem' }}>Register for courses in the catalog to generate your weekly schedule.</p>
          <Link to="/student/courses" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
            Browse Courses
          </Link>
        </div>
      ) : (
        <div>
          {/* Day Cards Overview */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => {
              const slots = timetableData.timetableByDay[day] || [];
              const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }) === day;

              return (
                <div
                  key={day}
                  className="academic-card"
                  style={{
                    borderTop: isToday ? '4px solid #2563eb' : '1px solid #e2e8f0',
                    backgroundColor: isToday ? '#faf5ff' : '#ffffff',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 800, fontSize: '1.0625rem', color: '#0f172a' }}>
                        {day}
                      </span>
                      {isToday && <span className="badge badge-indigo">Today</span>}
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
                      {slots.length} class{slots.length === 1 ? '' : 'es'}
                    </span>
                  </div>

                  {slots.length === 0 ? (
                    <div style={{ padding: '1.5rem 0', textAlign: 'center', color: '#94a3b8', fontSize: '0.8125rem' }}>
                      No classes scheduled on this day.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {slots.map((slot, sIdx) => (
                        <div
                          key={sIdx}
                          style={{
                            padding: '0.875rem',
                            backgroundColor: '#eff6ff',
                            borderLeft: '4px solid #2563eb',
                            borderRadius: '0.5rem',
                            boxShadow: 'var(--shadow-sm)',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.875rem', color: '#1e40af' }}>
                              {slot.courseCode}
                            </span>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                              <Clock size={12} /> {slot.timeSlot}
                            </span>
                          </div>

                          <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0f172a', margin: '0.2rem 0' }}>
                            {slot.courseName}
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginTop: '0.35rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <MapPin size={12} /> {slot.room}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <User size={12} /> {slot.facultyName}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentTimetable;
