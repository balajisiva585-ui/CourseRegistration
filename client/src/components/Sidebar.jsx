import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  Sparkles,
  History,
  UserCheck,
  Building2,
  Users,
  GraduationCap,
  FileSpreadsheet,
  Settings,
  ShieldCheck,
  CheckSquare,
  Award,
  Layers,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ isOpen }) => {
  const { role } = useAuth();

  const studentLinks = [
    { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/student/courses', icon: BookOpen, label: 'Course Catalog' },
    { to: '/student/my-courses', icon: CheckSquare, label: 'My Enrolled Courses' },
    { to: '/student/timetable', icon: Calendar, label: 'Weekly Timetable' },
    { to: '/student/progress', icon: Award, label: 'Academic Progress' },
    { to: '/student/recommendations', icon: Sparkles, label: 'Course Recommendations' },
    { to: '/student/history', icon: History, label: 'Registration History' },
    { to: '/student/profile', icon: UserCheck, label: 'My Profile' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Admin Dashboard' },
    { to: '/admin/courses', icon: BookOpen, label: 'Courses Management' },
    { to: '/admin/students', icon: GraduationCap, label: 'Students Directory' },
    { to: '/admin/faculty', icon: Users, label: 'Faculty Directory' },
    { to: '/admin/departments', icon: Building2, label: 'Departments' },
    { to: '/admin/registrations', icon: Layers, label: 'Registration Monitor' },
    { to: '/admin/reports', icon: FileSpreadsheet, label: 'Reports & CSV Export' },
    { to: '/admin/settings', icon: Settings, label: 'Semester Settings' },
    { to: '/admin/audit-logs', icon: ShieldCheck, label: 'Audit Logs' },
  ];

  const facultyLinks = [
    { to: '/faculty/dashboard', icon: LayoutDashboard, label: 'Assigned Courses' },
    { to: '/faculty/rosters', icon: Users, label: 'Class Rosters' },
  ];

  let links = studentLinks;
  if (role === 'ADMIN') links = adminLinks;
  if (role === 'FACULTY') links = facultyLinks;

  if (!isOpen) return null;

  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        minHeight: '100vh',
        borderRight: '1px solid #1e293b',
      }}
    >
      <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid #1e293b' }}>
        <div style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', fontWeight: 700 }}>
          {role} PORTAL
        </div>
        <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.25rem', fontWeight: 500 }}>
          Academic Term: Fall 2026
        </div>
      </div>

      <nav style={{ padding: '1rem 0.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.625rem 0.875rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: isActive ? '#ffffff' : '#94a3b8',
                backgroundColor: isActive ? '#2563eb' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              })}
            >
              <Icon size={18} />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div style={{ padding: '1rem', borderTop: '1px solid #1e293b', fontSize: '0.75rem', color: '#64748b' }}>
        <div>Campus Registration v1.0</div>
        <div style={{ fontSize: '0.6875rem', color: '#475569', marginTop: '0.125rem' }}>
          Secure JWT Node & Mongo
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
