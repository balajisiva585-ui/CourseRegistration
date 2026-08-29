import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  BookOpen,
  GraduationCap,
  Building2,
  Layers,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  PieChart as PieIcon,
  BarChart3,
  Calendar,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import api from '../../services/api';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

export const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const res = await api.get('/dashboard/admin');
        if (res.data?.success) {
          setDashboard(res.data.data);
        }
      } catch (err) {
        setError(err.userMessage || 'Failed to load admin analytics.');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading administrative analytics...</div>;
  }

  if (error || !dashboard) {
    return (
      <div className="page-body">
        <div style={{ padding: '2rem', backgroundColor: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '0.75rem', color: '#e11d48' }}>
          {error || 'Unable to load admin dashboard.'}
        </div>
      </div>
    );
  }

  const { summary, charts, recentRegistrations } = dashboard;

  return (
    <div className="page-body">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
            Registrar & Admin Dashboard
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Real-time enrollment metrics, seat utilization, and departmental analytics.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/admin/courses" className="btn btn-primary btn-sm">
            <BookOpen size={14} /> Manage Courses
          </Link>
          <Link to="/admin/reports" className="btn btn-secondary btn-sm">
            <BarChart3 size={14} /> View Reports
          </Link>
        </div>
      </div>

      {/* Summary Stat Grid */}
      <div className="stat-grid">
        <StatCard
          title="Total Students"
          value={summary.totalStudents}
          subtitle="Enrolled undergraduates"
          icon={GraduationCap}
          variant="blue"
        />
        <StatCard
          title="Faculty Members"
          value={summary.totalFaculty}
          subtitle="Active instructors"
          icon={Users}
          variant="indigo"
        />
        <StatCard
          title="Active Courses"
          value={summary.totalCourses}
          subtitle={`${summary.fullCoursesCount} full capacity`}
          icon={BookOpen}
          variant="emerald"
        />
        <StatCard
          title="Seat Utilization"
          value={`${summary.overallUtilizationRate}%`}
          subtitle={`${summary.totalEnrolled} / ${summary.totalCapacity} seats`}
          icon={TrendingUp}
          variant="amber"
        />
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.75rem', marginBottom: '2rem' }}>
        {/* Chart 1: Department Registrations Bar Chart */}
        <div className="academic-card">
          <div className="academic-card-header">
            <h3 className="academic-card-title">
              <BarChart3 size={18} color="#2563eb" /> Department Course & Enrollment Distribution
            </h3>
          </div>

          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.departmentChartData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Legend />
                <Bar dataKey="enrolled" name="Enrolled Students" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="capacity" name="Max Capacity" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Seat Utilization Donut Chart */}
        <div className="academic-card">
          <div className="academic-card-header">
            <h3 className="academic-card-title">
              <PieIcon size={18} color="#10b981" /> University Seat Utilization
            </h3>
          </div>

          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.seatUtilizationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {charts.seatUtilizationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Most Popular Courses Table & Recent Registrations */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.75rem' }}>
        {/* Popular Courses */}
        <div className="academic-card">
          <div className="academic-card-header">
            <h3 className="academic-card-title">
              <TrendingUp size={18} color="#2563eb" /> Highest Demand Courses
            </h3>
            <Link to="/admin/courses" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
              All Courses →
            </Link>
          </div>

          <div className="table-container">
            <table className="academic-table">
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Course Name</th>
                  <th>Enrolled / Cap</th>
                  <th>Fill Rate</th>
                </tr>
              </thead>
              <tbody>
                {charts.popularCourses.map((c, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 800, color: '#2563eb' }}>{c.code}</td>
                    <td style={{ fontWeight: 600, color: '#0f172a' }}>{c.name}</td>
                    <td>
                      {c.enrolled} / {c.capacity}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          c.fillRate >= 100
                            ? 'badge-rose'
                            : c.fillRate > 75
                            ? 'badge-amber'
                            : 'badge-emerald'
                        }`}
                      >
                        {c.fillRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Registrations Feed */}
        <div className="academic-card">
          <div className="academic-card-header">
            <h3 className="academic-card-title">
              <Layers size={18} color="#2563eb" /> Live Registration Stream
            </h3>
            <Link to="/admin/registrations" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
              Monitor All →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentRegistrations.slice(0, 5).map((reg) => (
              <div
                key={reg._id}
                style={{
                  padding: '0.75rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '0.5rem',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.8125rem', color: '#0f172a' }}>
                    {reg.student?.name} ({reg.student?.studentId})
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 600 }}>
                    {reg.course?.courseCode} - {reg.course?.courseName}
                  </div>
                </div>
                <span className="badge badge-emerald">Enrolled</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
