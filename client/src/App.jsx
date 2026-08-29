import React, { useState } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { CompareProvider } from './context/CompareContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Hub Navigation & Layout Components
import HubNavbar from './components/hub/HubNavbar';
import HubFooter from './components/hub/HubFooter';

// Hub Pages
import HubHome from './pages/hub/HubHome';
import CollegeSearch from './pages/hub/CollegeSearch';
import CollegeProfile from './pages/hub/CollegeProfile';
import CutoffExplorer from './pages/hub/CutoffExplorer';
import CutoffPredictor from './pages/hub/CutoffPredictor';
import TneaSimulator from './pages/hub/TneaSimulator';
import SeatMatrixExplorer from './pages/hub/SeatMatrixExplorer';
import CollegeCompare from './pages/hub/CollegeCompare';
import ApplicationsHub from './pages/hub/ApplicationsHub';
import FeesHub from './pages/hub/FeesHub';
import MyColleges from './pages/hub/MyColleges';
import AboutHub from './pages/hub/AboutHub';
import DataSources from './pages/hub/DataSources';

// Admin Hub Dashboard
import AdminHubDashboard from './pages/admin/AdminHubDashboard';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Academic Management Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import CourseCatalog from './pages/student/CourseCatalog';
import CourseDetails from './pages/student/CourseDetails';
import MyCourses from './pages/student/MyCourses';
import StudentTimetable from './pages/student/StudentTimetable';
import AcademicProgress from './pages/student/AcademicProgress';
import Recommendations from './pages/student/Recommendations';
import RegistrationHistory from './pages/student/RegistrationHistory';
import StudentProfile from './pages/student/StudentProfile';

// Academic Management Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import CourseManagement from './pages/admin/CourseManagement';
import StudentManagement from './pages/admin/StudentManagement';
import FacultyManagement from './pages/admin/FacultyManagement';
import DepartmentManagement from './pages/admin/DepartmentManagement';
import RegistrationMonitor from './pages/admin/RegistrationMonitor';
import ReportsAnalytics from './pages/admin/ReportsAnalytics';
import AuditLogs from './pages/admin/AuditLogs';
import SystemSettings from './pages/admin/SystemSettings';

// Academic Management Faculty Pages
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import CourseRoster from './pages/faculty/CourseRoster';

// Common Pages
import NotFound from './pages/NotFound';

// Public Hub Layout with Header & Footer
const HubLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <HubNavbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <HubFooter />
    </div>
  );
};

// Academic Portal Layout with Sidebar and Navbar
const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Sidebar isOpen={sidebarOpen} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Navbar onToggleSidebar={toggleSidebar} />
        <main style={{ flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export const App = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <CompareProvider>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Tamil Nadu Engineering College Central Hub Layout & Routes */}
            <Route element={<HubLayout />}>
              <Route path="/" element={<HubHome />} />
              <Route path="/colleges" element={<CollegeSearch />} />
              <Route path="/colleges/:codeOrId" element={<CollegeProfile />} />
              <Route path="/cutoffs" element={<CutoffExplorer />} />
              <Route path="/predictor" element={<CutoffPredictor />} />
              <Route path="/simulator" element={<TneaSimulator />} />
              <Route path="/seats" element={<SeatMatrixExplorer />} />
              <Route path="/compare" element={<CollegeCompare />} />
              <Route path="/applications" element={<ApplicationsHub />} />
              <Route path="/fees" element={<FeesHub />} />
              <Route path="/my-colleges" element={<MyColleges />} />
              <Route path="/data-sources" element={<DataSources />} />
              <Route path="/about" element={<AboutHub />} />

              {/* Admin Hub Panel */}
              <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                <Route path="/admin/hub" element={<AdminHubDashboard />} />
              </Route>
            </Route>

            {/* Protected Academic Portal Routes inside AppLayout */}
            <Route element={<AppLayout />}>
              {/* Student Portal Routes */}
              <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/courses" element={<CourseCatalog />} />
                <Route path="/student/courses/:id" element={<CourseDetails />} />
                <Route path="/student/my-courses" element={<MyCourses />} />
                <Route path="/student/timetable" element={<StudentTimetable />} />
                <Route path="/student/progress" element={<AcademicProgress />} />
                <Route path="/student/recommendations" element={<Recommendations />} />
                <Route path="/student/history" element={<RegistrationHistory />} />
                <Route path="/student/profile" element={<StudentProfile />} />
              </Route>

              {/* Admin Portal Routes */}
              <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/courses" element={<CourseManagement />} />
                <Route path="/admin/students" element={<StudentManagement />} />
                <Route path="/admin/faculty" element={<FacultyManagement />} />
                <Route path="/admin/departments" element={<DepartmentManagement />} />
                <Route path="/admin/registrations" element={<RegistrationMonitor />} />
                <Route path="/admin/reports" element={<ReportsAnalytics />} />
                <Route path="/admin/audit-logs" element={<AuditLogs />} />
                <Route path="/admin/settings" element={<SystemSettings />} />
              </Route>

              {/* Faculty Portal Routes */}
              <Route element={<ProtectedRoute allowedRoles={['FACULTY']} />}>
                <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
                <Route path="/faculty/rosters" element={<CourseRoster />} />
              </Route>
            </Route>

            {/* Fallback 404 Route */}
            <Route element={<HubLayout />}>
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </CompareProvider>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
