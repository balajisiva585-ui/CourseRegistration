import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Download,
  Filter,
  BarChart3,
  PieChart as PieIcon,
  RefreshCw,
  Search,
  Building2,
  Calendar,
  Layers,
  Users,
  CheckCircle2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import api from '../../services/api';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'];

export const ReportsAnalytics = () => {
  const [reportType, setReportType] = useState('COURSE_ENROLLMENT');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [semesterFilter, setSemesterFilter] = useState('ALL');
  const [departments, setDepartments] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  // Fetch departments list
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get('/departments');
        if (res.data?.success) {
          setDepartments(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching departments:', err);
      }
    };
    fetchDepartments();
  }, []);

  // Fetch report data
  const fetchReport = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {
        type: reportType,
        department: departmentFilter !== 'ALL' ? departmentFilter : undefined,
        semester: semesterFilter !== 'ALL' ? semesterFilter : undefined,
      };

      const res = await api.get('/reports/data', { params });
      if (res.data?.success) {
        setReportData(res.data.data);
      }
    } catch (err) {
      setError(err.userMessage || 'Failed to fetch report data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [reportType, departmentFilter, semesterFilter]);

  // Handle CSV export download
  const handleExportCSV = async () => {
    try {
      setExporting(true);
      const params = new URLSearchParams({
        type: reportType,
        department: departmentFilter !== 'ALL' ? departmentFilter : '',
        semester: semesterFilter !== 'ALL' ? semesterFilter : '',
      });

      const response = await api.get(`/reports/export-csv?${params.toString()}`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `report_${reportType.toLowerCase()}_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to export CSV: ' + (err.userMessage || err.message));
    } finally {
      setExporting(false);
    }
  };

  // Filter report items by search
  const filteredData = reportData.filter((item) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return Object.values(item).some(
      (val) => val && String(val).toLowerCase().includes(term)
    );
  });

  // Calculate high-level summary KPIs
  const getSummaryMetrics = () => {
    if (reportType === 'COURSE_ENROLLMENT') {
      const totalEnrolled = reportData.reduce((sum, c) => sum + (c.enrolledCount || 0), 0);
      const totalCapacity = reportData.reduce((sum, c) => sum + (c.capacity || 0), 0);
      const avgUtil = totalCapacity > 0 ? Math.round((totalEnrolled / totalCapacity) * 100) : 0;
      return [
        { label: 'Total Listed Courses', value: reportData.length },
        { label: 'Total Registered Seats', value: totalEnrolled },
        { label: 'Total Seat Capacity', value: totalCapacity },
        { label: 'Overall Seat Utilization', value: `${avgUtil}%` },
      ];
    }
    if (reportType === 'STUDENT_REGISTRATION') {
      const uniqueStudents = new Set(reportData.map((r) => r.studentId)).size;
      const totalCredits = reportData.reduce((sum, r) => sum + (r.credits || 0), 0);
      return [
        { label: 'Total Registrations', value: reportData.length },
        { label: 'Unique Students Enrolled', value: uniqueStudents },
        { label: 'Total Credit Hours Locked', value: totalCredits },
        { label: 'Avg. Registrations/Student', value: uniqueStudents ? (reportData.length / uniqueStudents).toFixed(1) : 0 },
      ];
    }
    if (reportType === 'DEPARTMENT_SUMMARY') {
      const totalStuds = reportData.reduce((sum, d) => sum + (d.totalStudents || 0), 0);
      const totalCourses = reportData.reduce((sum, d) => sum + (d.totalCourses || 0), 0);
      return [
        { label: 'Active Academic Depts', value: reportData.length },
        { label: 'Total Students Across Depts', value: totalStuds },
        { label: 'Total Catalog Courses', value: totalCourses },
        { label: 'Departments Tracked', value: '100%' },
      ];
    }
    if (reportType === 'FACULTY_WORKLOAD') {
      const totalAssigned = reportData.reduce((sum, f) => sum + (f.assignedCoursesCount || 0), 0);
      const totalStudents = reportData.reduce((sum, f) => sum + (f.totalStudentsTaught || 0), 0);
      return [
        { label: 'Total Faculty Members', value: reportData.length },
        { label: 'Total Sections Instructed', value: totalAssigned },
        { label: 'Total Students Mentored', value: totalStudents },
        { label: 'Avg Courses / Faculty', value: reportData.length ? (totalAssigned / reportData.length).toFixed(1) : 0 },
      ];
    }
    return [
      { label: 'Total Records Found', value: reportData.length },
    ];
  };

  // Chart data preparation
  const getChartData = () => {
    if (reportType === 'COURSE_ENROLLMENT') {
      return reportData.slice(0, 8).map((c) => ({
        name: c.courseCode,
        enrolled: c.enrolledCount,
        capacity: c.capacity,
      }));
    }
    if (reportType === 'DEPARTMENT_SUMMARY') {
      return reportData.map((d) => ({
        name: d.departmentCode,
        students: d.totalStudents,
        courses: d.totalCourses,
      }));
    }
    if (reportType === 'FACULTY_WORKLOAD') {
      return reportData.slice(0, 8).map((f) => ({
        name: f.name.replace('Prof. ', '').replace('Dr. ', ''),
        courses: f.assignedCoursesCount,
        students: f.totalStudentsTaught,
      }));
    }
    return [];
  };

  const chartData = getChartData();

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FileSpreadsheet color="#2563eb" size={28} />
            Institutional Reports & Analytics
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Export comprehensive enrollment statistics, faculty workloads, and department breakdowns to CSV.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={exporting || loading || reportData.length === 0}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#10b981',
            color: '#ffffff',
            padding: '0.625rem 1.25rem',
            borderRadius: '0.5rem',
            border: 'none',
            fontWeight: 700,
            fontSize: '0.875rem',
            cursor: exporting || loading || reportData.length === 0 ? 'not-allowed' : 'pointer',
            opacity: exporting || loading || reportData.length === 0 ? 0.6 : 1,
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.15s ease',
          }}
        >
          <Download size={18} />
          {exporting ? 'Generating CSV...' : 'Export to CSV'}
        </button>
      </div>

      {/* Report Type Selector Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          backgroundColor: '#f1f5f9',
          padding: '0.375rem',
          borderRadius: '0.75rem',
          marginBottom: '1.5rem',
          overflowX: 'auto',
        }}
      >
        {[
          { id: 'COURSE_ENROLLMENT', label: 'Course Enrollment', icon: Layers },
          { id: 'STUDENT_REGISTRATION', label: 'Student Registrations', icon: Users },
          { id: 'DEPARTMENT_SUMMARY', label: 'Department Summary', icon: Building2 },
          { id: 'FACULTY_WORKLOAD', label: 'Faculty Workload', icon: BarChart3 },
          { id: 'REGISTRATION_HISTORY', label: 'Registration Logs', icon: Calendar },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = reportType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setReportType(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.625rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                backgroundColor: isActive ? '#ffffff' : 'transparent',
                color: isActive ? '#2563eb' : '#64748b',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.875rem',
                cursor: 'pointer',
                boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* KPI Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        {getSummaryMetrics().map((metric, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.75rem',
              padding: '1.25rem',
              border: '1px solid #e2e8f0',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {metric.label}
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginTop: '0.375rem' }}>
              {metric.value}
            </div>
          </div>
        ))}
      </div>

      {/* Visual Analytics Chart (when applicable) */}
      {chartData.length > 0 && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            border: '1px solid #e2e8f0',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '1.5rem',
          }}
        >
          <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
            Visual Breakdown
          </h3>
          <div style={{ height: '260px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '0.5rem',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '0.8125rem',
                  }}
                />
                <Legend />
                {reportType === 'COURSE_ENROLLMENT' && (
                  <>
                    <Bar dataKey="enrolled" name="Enrolled Seats" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="capacity" name="Max Capacity" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                  </>
                )}
                {reportType === 'DEPARTMENT_SUMMARY' && (
                  <>
                    <Bar dataKey="students" name="Students" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="courses" name="Courses" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </>
                )}
                {reportType === 'FACULTY_WORKLOAD' && (
                  <>
                    <Bar dataKey="students" name="Students Instructed" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="courses" name="Sections Taught" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </>
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Filter Bar & Search */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '0.75rem',
          padding: '1rem 1.25rem',
          border: '1px solid #e2e8f0',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '0.5rem',
              padding: '0.375rem 0.75rem',
              width: '240px',
            }}
          >
            <Search size={16} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search table rows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: 'none',
                background: 'none',
                outline: 'none',
                paddingLeft: '0.5rem',
                fontSize: '0.8125rem',
                width: '100%',
              }}
            />
          </div>

          {/* Department Filter (if applicable) */}
          {(reportType === 'COURSE_ENROLLMENT' || reportType === 'STUDENT_REGISTRATION') && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600 }}>Dept:</span>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                style={{
                  padding: '0.375rem 0.625rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.8125rem',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                }}
              >
                <option value="ALL">All Departments</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.code} - {d.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Semester Filter */}
          {(reportType === 'COURSE_ENROLLMENT' || reportType === 'STUDENT_REGISTRATION') && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600 }}>Sem:</span>
              <select
                value={semesterFilter}
                onChange={(e) => setSemesterFilter(e.target.value)}
                style={{
                  padding: '0.375rem 0.625rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.8125rem',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                }}
              >
                <option value="ALL">All Semesters</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <button
          onClick={fetchReport}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            padding: '0.375rem 0.75rem',
            borderRadius: '0.375rem',
            border: '1px solid #cbd5e1',
            backgroundColor: '#ffffff',
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: '#475569',
            cursor: 'pointer',
          }}
        >
          <RefreshCw size={14} /> Refresh Data
        </button>
      </div>

      {/* Data Table */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '0.75rem',
          border: '1px solid #e2e8f0',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden',
        }}
      >
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            Compiling and processing analytical data...
          </div>
        ) : error ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#e11d48' }}>{error}</div>
        ) : filteredData.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
            No records match the current filter criteria.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  {reportType === 'COURSE_ENROLLMENT' && (
                    <>
                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>COURSE</th>
                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>DEPARTMENT</th>
                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>FACULTY</th>
                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>CREDITS</th>
                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>SEATS (ENROLLED/CAP)</th>
                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>UTILIZATION</th>
                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>STATUS</th>
                    </>
                  )}
                  {reportType === 'STUDENT_REGISTRATION' && (
                    <>
                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>REG ID</th>
                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>STUDENT</th>
                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>DEPARTMENT</th>
                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>COURSE</th>
                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>CREDITS</th>
                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>SEM</th>
                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>ENROLLED DATE</th>
                    </>
                  )}
                  {reportType === 'DEPARTMENT_SUMMARY' && (
                    <>
                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>CODE</th>
                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>DEPARTMENT NAME</th>
                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>HEAD OF DEPARTMENT</th>
                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>TOTAL STUDENTS</th>
                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>COURSES</th>
                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>SEAT FILL RATE</th>
                    </>
                  )}
                  {reportType === 'FACULTY_WORKLOAD' && (
                    <>
                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>FACULTY ID</th>
                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>PROFESSOR</th>
                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>DEPARTMENT</th>
                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>SPECIALIZATION</th>
                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>COURSES TAUGHT</th>
                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>TEACHING CREDITS</th>
                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>STUDENTS TAUGHT</th>
                    </>
                  )}
                  {reportType === 'REGISTRATION_HISTORY' && (
                    <>
                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>REG ID</th>
                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>STUDENT</th>
                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>COURSE</th>
                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>STATUS</th>
                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>REG DATE</th>
                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>DROP DATE</th>
                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>DROP REASON</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, i) => (
                  <tr
                    key={i}
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      backgroundColor: i % 2 === 0 ? '#ffffff' : '#fafafa',
                      fontSize: '0.8125rem',
                      color: '#334155',
                    }}
                  >
                    {reportType === 'COURSE_ENROLLMENT' && (
                      <>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>{row.courseCode}</div>
                          <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{row.courseName}</div>
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>{row.department}</td>
                        <td style={{ padding: '0.75rem 1rem' }}>{row.faculty}</td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{row.credits} Cr</td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          {row.enrolledCount} / {row.capacity}
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div
                              style={{
                                width: '60px',
                                height: '6px',
                                backgroundColor: '#e2e8f0',
                                borderRadius: '3px',
                                overflow: 'hidden',
                              }}
                            >
                              <div
                                style={{
                                  width: row.utilizationRate,
                                  height: '100%',
                                  backgroundColor:
                                    parseInt(row.utilizationRate) > 90
                                      ? '#e11d48'
                                      : parseInt(row.utilizationRate) > 60
                                      ? '#2563eb'
                                      : '#10b981',
                                }}
                              />
                            </div>
                            <span style={{ fontWeight: 600 }}>{row.utilizationRate}</span>
                          </div>
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span
                            style={{
                              padding: '0.25rem 0.5rem',
                              borderRadius: '9999px',
                              fontSize: '0.6875rem',
                              fontWeight: 700,
                              backgroundColor: row.status === 'Active' ? '#ecfdf5' : '#f1f5f9',
                              color: row.status === 'Active' ? '#047857' : '#64748b',
                            }}
                          >
                            {row.status}
                          </span>
                        </td>
                      </>
                    )}

                    {reportType === 'STUDENT_REGISTRATION' && (
                      <>
                        <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: 600 }}>
                          {row.registrationId}
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>{row.studentName}</div>
                          <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{row.studentId}</div>
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>{row.department}</td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span style={{ fontWeight: 700, color: '#2563eb' }}>{row.courseCode}</span> - {row.courseName}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{row.credits} Cr</td>
                        <td style={{ padding: '0.75rem 1rem' }}>Sem {row.semester}</td>
                        <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>{row.registrationDate}</td>
                      </>
                    )}

                    {reportType === 'DEPARTMENT_SUMMARY' && (
                      <>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#2563eb' }}>
                          {row.departmentCode}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#0f172a' }}>
                          {row.departmentName}
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>{row.headOfDepartment}</td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>{row.totalStudents}</td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{row.totalCourses}</td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span
                            style={{
                              padding: '0.25rem 0.5rem',
                              borderRadius: '0.25rem',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              backgroundColor: '#eff6ff',
                              color: '#2563eb',
                            }}
                          >
                            {row.seatUtilization} ({row.totalEnrolled}/{row.totalCapacity})
                          </span>
                        </td>
                      </>
                    )}

                    {reportType === 'FACULTY_WORKLOAD' && (
                      <>
                        <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: 600 }}>
                          {row.facultyId}
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>{row.name}</div>
                          <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{row.email}</div>
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>{row.department}</td>
                        <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>{row.specialization}</td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>{row.assignedCoursesCount}</td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{row.totalTeachingCredits} Cr</td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#047857' }}>
                          {row.totalStudentsTaught}
                        </td>
                      </>
                    )}

                    {reportType === 'REGISTRATION_HISTORY' && (
                      <>
                        <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: 600 }}>
                          {row.registrationId}
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>{row.studentName}</div>
                          <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{row.studentId}</div>
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span style={{ fontWeight: 700, color: '#2563eb' }}>{row.courseCode}</span> - {row.courseName}
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span
                            style={{
                              padding: '0.25rem 0.5rem',
                              borderRadius: '9999px',
                              fontSize: '0.6875rem',
                              fontWeight: 700,
                              backgroundColor: row.status === 'Registered' ? '#ecfdf5' : '#fff1f2',
                              color: row.status === 'Registered' ? '#047857' : '#be123c',
                            }}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>{row.registrationDate}</td>
                        <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>{row.dropDate}</td>
                        <td style={{ padding: '0.75rem 1rem', color: '#64748b', fontStyle: row.dropReason !== '-' ? 'italic' : 'normal' }}>
                          {row.dropReason}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsAnalytics;
