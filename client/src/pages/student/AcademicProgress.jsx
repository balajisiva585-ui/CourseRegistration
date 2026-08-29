import React, { useState, useEffect } from 'react';
import { Award, BookOpen, CheckCircle2, ChevronRight, GraduationCap, Layers } from 'lucide-react';
import api from '../../services/api';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';

export const AcademicProgress = () => {
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('ALL');

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        const res = await api.get('/academic-progress');
        if (res.data?.success) {
          setProgressData(res.data.data);
        }
      } catch (err) {
        setError(err.userMessage || 'Failed to load academic progress.');
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Calculating academic credit metrics...</div>;
  }

  if (error || !progressData) {
    return (
      <div className="page-body">
        <div style={{ padding: '2rem', backgroundColor: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '0.75rem', color: '#e11d48' }}>
          {error || 'Unable to load progress data.'}
        </div>
      </div>
    );
  }

  const { student, creditSummary, completedCourses, currentCourses, semesterBreakdown } = progressData;

  const filteredCompletedCourses =
    selectedSemester === 'ALL'
      ? completedCourses
      : completedCourses.filter((c) => c.semesterCompleted === Number(selectedSemester));

  return (
    <div className="page-body">
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
          Degree Audit & Academic Progress
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
          Tracking degree credit fulfillment, completed course milestones, and graduation requirements.
        </p>
      </div>

      {/* Overview Stat Cards */}
      <div className="stat-grid">
        <StatCard
          title="Completed Credits"
          value={`${creditSummary.completedCredits} / ${creditSummary.totalRequiredCredits}`}
          subtitle={`${creditSummary.remainingCredits} credits remaining`}
          icon={Award}
          variant="emerald"
        />
        <StatCard
          title="Current Term Credits"
          value={creditSummary.currentRegisteredCredits}
          subtitle={`Semester ${student.currentSemester} enrolled`}
          icon={Layers}
          variant="blue"
        />
        <StatCard
          title="Degree Completion"
          value={`${creditSummary.completionPercentage}%`}
          subtitle={`Bachelor of Technology`}
          icon={GraduationCap}
          variant="indigo"
        />
      </div>

      {/* Progress Bar Card */}
      <div className="academic-card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#0f172a' }}>
            Overall Degree Fulfillment Progress
          </span>
          <span style={{ fontWeight: 800, fontSize: '1.125rem', color: '#2563eb' }}>
            {creditSummary.completionPercentage}% Complete
          </span>
        </div>

        <div className="progress-container" style={{ height: '14px' }}>
          <div
            className="progress-bar-fill"
            style={{
              width: `${creditSummary.completionPercentage}%`,
              background: 'linear-gradient(90deg, #10b981 0%, #3b82f6 100%)',
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
          <span>0 Credits (Entry)</span>
          <span>Target: {creditSummary.totalRequiredCredits} Credits (Graduation)</span>
        </div>
      </div>

      {/* Completed Courses Checklist */}
      <div className="academic-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h3 className="academic-card-title">
            <CheckCircle2 size={20} color="#059669" /> Completed Courses & Grades ({completedCourses.length})
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600 }}>Filter Semester:</span>
            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.35rem 0.6rem', fontSize: '0.8125rem' }}
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
            >
              <option value="ALL">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>
                  Semester {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="academic-table">
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Name</th>
                <th>Semester</th>
                <th>Credits</th>
                <th>Grade</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompletedCourses.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
                    No completed courses found for this filter.
                  </td>
                </tr>
              ) : (
                filteredCompletedCourses.map((c, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 800, color: '#2563eb' }}>{c.courseCode}</td>
                    <td style={{ fontWeight: 600, color: '#0f172a' }}>{c.courseName}</td>
                    <td>Semester {c.semesterCompleted}</td>
                    <td>{c.credits} Cr</td>
                    <td>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '0.25rem',
                          backgroundColor: c.grade.startsWith('A') ? '#ecfdf5' : '#eff6ff',
                          color: c.grade.startsWith('A') ? '#047857' : '#1e40af',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                        }}
                      >
                        {c.grade}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status="COMPLETED" text="Completed" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AcademicProgress;
