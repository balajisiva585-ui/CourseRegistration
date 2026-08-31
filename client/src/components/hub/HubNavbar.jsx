import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCompare } from '../../context/CompareContext';
import {
  GraduationCap,
  Search,
  BarChart3,
  Layers,
  Scale,
  Sparkles,
  FileText,
  DollarSign,
  Bookmark,
  Info,
  Shield,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  LayoutDashboard,
} from 'lucide-react';

export const HubNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, role } = useAuth();
  const { compareCount } = useCompare();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [quickSearch, setQuickSearch] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      navigate(`/colleges?search=${encodeURIComponent(quickSearch.trim())}`);
      setQuickSearch('');
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Colleges', path: '/colleges', icon: Search },
    { name: 'Cutoffs', path: '/cutoffs', icon: BarChart3 },
    { name: 'Allotment Simulator', path: '/simulator', icon: Sparkles, badge: 'Simulator', badgeColor: '#059669' },
    { name: 'Seat Matrix', path: '/seats', icon: Layers },
    { name: 'Predictor', path: '/predictor', icon: Sparkles },
    { name: 'Compare', path: '/compare', icon: Scale, count: compareCount },
    { name: 'Applications', path: '/applications', icon: FileText },
    { name: 'Data Sources', path: '/data-sources', icon: Shield },
    { name: 'About', path: '/about', icon: Info },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
      {/* Top Demo Data & Notice Bar */}
      <div style={{ backgroundColor: '#0f172a', color: '#94a3b8', fontSize: '0.75rem', padding: '0.35rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ backgroundColor: '#059669', color: '#ffffff', padding: '0.1rem 0.45rem', borderRadius: '4px', fontWeight: 700, fontSize: '0.68rem', letterSpacing: '0.04em' }}>VERIFIED DATA</span>
          <span style={{ color: '#cbd5e1' }}>Tamil Nadu Engineering College Central Hub – Official Reference & Counselling Portal</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/data-sources" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 600 }}>
            Data Sources & Provenance Registry →
          </Link>
          <span style={{ color: '#94a3b8' }}>TNEA Cycle: <strong>2024 - 2026</strong></span>
          {role === 'ADMIN' && (
            <Link to="/admin/hub" style={{ color: '#60a5fa', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Shield size={12} /> Admin Dashboard
            </Link>
          )}
        </div>
      </div>

      {/* Main Navbar */}
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0.65rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #1d4ed8 0%, #0284c7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', boxShadow: '0 4px 10px rgba(37,99,235,0.3)' }}>
            <GraduationCap size={24} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a', lineHeight: 1.15, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ background: 'linear-gradient(135deg, #2563eb, #0284c7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Smart Course Registration</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>& Academic Planning</div>
          </div>
        </Link>

        {/* Global Quick Search Bar */}
        <form onSubmit={handleSearchSubmit} style={{ flex: '1', maxWidth: '320px', display: 'none', position: 'relative' }} className="hub-nav-search">
          <input
            type="text"
            placeholder="Search college, code, branch..."
            value={quickSearch}
            onChange={(e) => setQuickSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.45rem 0.85rem 0.45rem 2.25rem',
              borderRadius: '20px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#f8fafc',
              fontSize: '0.85rem',
              outline: 'none',
            }}
          />
          <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        </form>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }} className="hub-desktop-nav">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.45rem 0.75rem',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: active ? 700 : 600,
                  color: active ? '#1d4ed8' : '#475569',
                  backgroundColor: active ? '#eff6ff' : 'transparent',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                }}
              >
                <Icon size={15} color={active ? '#2563eb' : '#64748b'} />
                <span>{link.name}</span>
                {link.count !== undefined && link.count > 0 && (
                  <span style={{ backgroundColor: '#2563eb', color: '#ffffff', borderRadius: '10px', padding: '0.1rem 0.4rem', fontSize: '0.7rem', fontWeight: 700 }}>
                    {link.count}
                  </span>
                )}
                {link.badge && (
                  <span style={{ backgroundColor: link.badgeColor || '#3b82f6', color: '#ffffff', borderRadius: '6px', padding: '0.08rem 0.35rem', fontSize: '0.62rem', fontWeight: 700 }}>
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Auth / User Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#1e293b',
                }}
              >
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span style={{ maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name || 'Account'}</span>
                <ChevronDown size={14} />
              </button>

              {userDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '110%',
                    width: '210px',
                    backgroundColor: '#ffffff',
                    borderRadius: '10px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
                    border: '1px solid #e2e8f0',
                    padding: '0.5rem',
                    zIndex: 200,
                  }}
                >
                  <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>{user?.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{user?.email}</div>
                    <span style={{ display: 'inline-block', marginTop: '0.25rem', backgroundColor: '#e0f2fe', color: '#0369a1', fontSize: '0.68rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                      {user?.role}
                    </span>
                  </div>

                  {role === 'ADMIN' && (
                    <Link
                      to="/admin/hub"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', fontSize: '0.82rem', color: '#0f172a', borderRadius: '6px', textDecoration: 'none' }}
                    >
                      <LayoutDashboard size={15} color="#2563eb" />
                      <span>Admin Hub Panel</span>
                    </Link>
                  )}

                  <Link
                    to="/my-colleges"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', fontSize: '0.82rem', color: '#0f172a', borderRadius: '6px', textDecoration: 'none' }}
                  >
                    <Bookmark size={15} color="#059669" />
                    <span>My Saved Colleges</span>
                  </Link>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.82rem',
                      color: '#dc2626',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Link
                to="/login"
                style={{
                  padding: '0.4rem 0.85rem',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#1e293b',
                  borderRadius: '6px',
                  backgroundColor: '#f1f5f9',
                  textDecoration: 'none',
                }}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                style={{
                  padding: '0.4rem 0.85rem',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  borderRadius: '6px',
                  backgroundColor: '#2563eb',
                  textDecoration: 'none',
                }}
              >
                Join Free
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#334155',
              padding: '0.25rem',
            }}
            className="hub-mobile-toggle"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <form onSubmit={handleSearchSubmit} style={{ marginBottom: '0.75rem', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search college, code, branch..."
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 0.85rem 0.6rem 2.25rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#f8fafc',
                fontSize: '0.9rem',
              }}
            />
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          </form>

          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: active ? 700 : 500,
                  color: active ? '#1d4ed8' : '#334155',
                  backgroundColor: active ? '#eff6ff' : '#f8fafc',
                  textDecoration: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Icon size={18} color={active ? '#2563eb' : '#64748b'} />
                  <span>{link.name}</span>
                </div>
                {link.count !== undefined && link.count > 0 && (
                  <span style={{ backgroundColor: '#2563eb', color: '#ffffff', borderRadius: '10px', padding: '0.1rem 0.5rem', fontSize: '0.75rem', fontWeight: 700 }}>
                    {link.count}
                  </span>
                )}
                {link.badge && (
                  <span style={{ backgroundColor: link.badgeColor || '#3b82f6', color: '#ffffff', borderRadius: '4px', padding: '0.1rem 0.4rem', fontSize: '0.68rem', fontWeight: 700 }}>
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};

export default HubNavbar;
