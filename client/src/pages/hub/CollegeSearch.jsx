import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  Building2,
  Grid,
  List,
  MapPin,
  Briefcase,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import tneaService from '../../services/tneaService';
import CollegeCard from '../../components/hub/CollegeCard';
import DisclaimerBanner from '../../components/hub/DisclaimerBanner';

export const CollegeSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [district, setDistrict] = useState(searchParams.get('district') || 'All');
  const [collegeType, setCollegeType] = useState(searchParams.get('type') || 'All');
  const [department, setDepartment] = useState(searchParams.get('department') || 'All');
  const [isAutonomous, setIsAutonomous] = useState(searchParams.get('autonomous') || '');
  const [hasHostel, setHasHostel] = useState(searchParams.get('hostel') || '');
  const [minPlacement, setMinPlacement] = useState(searchParams.get('placement') || '');
  const [accreditation, setAccreditation] = useState(searchParams.get('naac') || 'All');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');

  // Data States
  const [colleges, setColleges] = useState([]);
  const [departmentsList, setDepartmentsList] = useState([]);
  const [districtsList, setDistrictsList] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, page: 1, limit: 12 });
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Load Metadata (districts & departments)
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const [distRes, deptRes] = await Promise.all([
          tneaService.getDistricts(),
          tneaService.getDepartments(),
        ]);
        if (distRes?.success) setDistrictsList(distRes.data);
        if (deptRes?.success) setDepartmentsList(deptRes.data);
      } catch (err) {
        console.error('Failed to load metadata', err);
      }
    };
    loadMetadata();
  }, []);

  // Fetch Colleges based on filters
  useEffect(() => {
    const fetchCollegesData = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: 12,
          sortBy,
          sortOrder,
        };

        if (search.trim()) params.search = search.trim();
        if (district !== 'All') params.district = district;
        if (collegeType !== 'All') params.collegeType = collegeType;
        if (department !== 'All') params.department = department;
        if (isAutonomous !== '') params.isAutonomous = isAutonomous;
        if (hasHostel !== '') params.hasHostel = hasHostel;
        if (minPlacement !== '') params.minPlacement = minPlacement;
        if (accreditation !== 'All') params.accreditation = accreditation;

        const res = await tneaService.getColleges(params);
        if (res?.success) {
          setColleges(res.data);
          if (res.pagination) setPagination(res.pagination);
        }
      } catch (err) {
        console.error('Failed to fetch colleges', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollegesData();
  }, [search, district, collegeType, department, isAutonomous, hasHostel, minPlacement, accreditation, sortBy, sortOrder, page]);

  const resetFilters = () => {
    setSearch('');
    setDistrict('All');
    setCollegeType('All');
    setDepartment('All');
    setIsAutonomous('');
    setHasHostel('');
    setMinPlacement('');
    setAccreditation('All');
    setSortBy('name');
    setSortOrder('asc');
    setPage(1);
    setSearchParams({});
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '1.5rem 0 4rem' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Header Title */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2563eb', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
            <GraduationCap size={18} />
            <span>Tamil Nadu Engineering Institutions Directory</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
                Explore Engineering Colleges
              </h1>
              <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '0.25rem' }}>
                Showing <strong>{pagination.total}</strong> colleges matching your filters across Tamil Nadu.
              </p>
            </div>

            {/* Quick Predictor & Compare Callout */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link
                to="/predictor"
                style={{
                  backgroundColor: '#eff6ff',
                  color: '#1d4ed8',
                  border: '1px solid #bfdbfe',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <Sparkles size={14} />
                <span>Cutoff Predictor</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Disclaimer Notice */}
        <DisclaimerBanner />

        {/* Main Content Layout (Sidebar + Results) */}
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem', alignItems: 'flex-start' }} className="hub-search-layout">
          {/* Filters Sidebar */}
          <aside
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '1.25rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              position: 'sticky',
              top: '80px',
            }}
            className="hub-filter-sidebar"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>
                <SlidersHorizontal size={16} />
                <span>Filter Colleges</span>
              </div>
              <button
                onClick={resetFilters}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#dc2626',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                }}
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              {/* Keyword Search */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>Keyword / Code</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Search name, code, city..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem 0.5rem 2rem',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.85rem',
                    }}
                  />
                  <Search size={14} style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                </div>
              </div>

              {/* District Filter */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>District</label>
                <select
                  value={district}
                  onChange={(e) => {
                    setDistrict(e.target.value);
                    setPage(1);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <option value="All">All Districts</option>
                  {districtsList.map((d) => (
                    <option key={d.name} value={d.name}>
                      {d.name} ({d.collegeCount})
                    </option>
                  ))}
                </select>
              </div>

              {/* College Type */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>College Type</label>
                <select
                  value={collegeType}
                  onChange={(e) => {
                    setCollegeType(e.target.value);
                    setPage(1);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <option value="All">All College Types</option>
                  <option value="Government">Government</option>
                  <option value="Government Aided">Government Aided</option>
                  <option value="University">University</option>
                  <option value="Autonomous">Autonomous</option>
                  <option value="Private">Private</option>
                  <option value="Deemed University">Deemed University</option>
                </select>
              </div>

              {/* Department */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>Branch / Department</label>
                <select
                  value={department}
                  onChange={(e) => {
                    setDepartment(e.target.value);
                    setPage(1);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <option value="All">All Departments</option>
                  {departmentsList.map((dept) => (
                    <option key={dept.code} value={dept.code}>
                      {dept.code} - {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Autonomous Status */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>Autonomous Status</label>
                <select
                  value={isAutonomous}
                  onChange={(e) => {
                    setIsAutonomous(e.target.value);
                    setPage(1);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <option value="">Any Status</option>
                  <option value="true">Autonomous Only</option>
                  <option value="false">Non-Autonomous (Affiliated)</option>
                </select>
              </div>

              {/* Accreditation Filter */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>NAAC Accreditation</label>
                <select
                  value={accreditation}
                  onChange={(e) => {
                    setAccreditation(e.target.value);
                    setPage(1);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <option value="All">Any Grade</option>
                  <option value="A++">NAAC A++</option>
                  <option value="A+">NAAC A+</option>
                  <option value="A">NAAC A</option>
                </select>
              </div>

              {/* Placement Minimum Filter */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Min Placement: {minPlacement ? `${minPlacement}%` : 'Any'}
                </label>
                <input
                  type="range"
                  min="60"
                  max="95"
                  step="5"
                  value={minPlacement || 60}
                  onChange={(e) => {
                    setMinPlacement(e.target.value);
                    setPage(1);
                  }}
                  style={{ width: '100%' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8' }}>
                  <span>60%</span>
                  <span>80%</span>
                  <span>95%</span>
                </div>
              </div>

              {/* Hostel Checkbox */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="hostelCheck"
                  checked={hasHostel === 'true'}
                  onChange={(e) => {
                    setHasHostel(e.target.checked ? 'true' : '');
                    setPage(1);
                  }}
                  style={{ cursor: 'pointer' }}
                />
                <label htmlFor="hostelCheck" style={{ fontSize: '0.82rem', color: '#334155', cursor: 'pointer', fontWeight: 600 }}>
                  Hostel Accommodation Available
                </label>
              </div>
            </form>
          </aside>

          {/* Results Area */}
          <div>
            {/* Top Toolbar (Sort + View Switcher) */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                padding: '0.75rem 1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '1.25rem',
              }}
            >
              {/* Sort By Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748b', fontWeight: 600 }}>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(1);
                  }}
                  style={{
                    padding: '0.35rem 0.65rem',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.82rem',
                    backgroundColor: '#ffffff',
                    fontWeight: 600,
                  }}
                >
                  <option value="name">College Name (A - Z)</option>
                  <option value="completeness">Data Completeness Score</option>
                  <option value="code">TNEA Code</option>
                  <option value="cutoff">Placement Percentage (High to Low)</option>
                  <option value="established">Established Year</option>
                  <option value="nirf">NIRF Ranking (Top First)</option>
                  <option value="code">College Code</option>
                </select>
              </div>

              {/* View Switcher */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <button
                  onClick={() => setViewMode('grid')}
                  style={{
                    backgroundColor: viewMode === 'grid' ? '#2563eb' : '#f1f5f9',
                    color: viewMode === 'grid' ? '#ffffff' : '#64748b',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.4rem',
                    cursor: 'pointer',
                  }}
                  title="Grid View"
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  style={{
                    backgroundColor: viewMode === 'list' ? '#2563eb' : '#f1f5f9',
                    color: viewMode === 'list' ? '#ffffff' : '#64748b',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.4rem',
                    cursor: 'pointer',
                  }}
                  title="List View"
                >
                  <List size={16} />
                </button>
              </div>
            </div>

            {/* Colleges Results Grid */}
            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      padding: '1.5rem',
                      height: '240px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#94a3b8',
                      fontSize: '0.88rem',
                    }}
                  >
                    Loading colleges...
                  </div>
                ))}
              </div>
            ) : colleges.length === 0 ? (
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  padding: '3.5rem 1.5rem',
                  textAlign: 'center',
                }}
              >
                <Building2 size={48} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>No Colleges Found</h3>
                <p style={{ fontSize: '0.88rem', color: '#64748b', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                  No colleges matched your active search query or filter combination. Try clearing some filters.
                </p>
                <button
                  onClick={resetFilters}
                  style={{
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.6rem 1.25rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(320px, 1fr))' : '1fr',
                  gap: '1.25rem',
                }}
              >
                {colleges.map((college) => (
                  <CollegeCard key={college.code} college={college} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '2.5rem' }}>
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  style={{
                    padding: '0.5rem 0.85rem',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: page === 1 ? '#f8fafc' : '#ffffff',
                    color: page === 1 ? '#94a3b8' : '#334155',
                    cursor: page === 1 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                  }}
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>

                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      onClick={() => setPage(num)}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '6px',
                        border: '1px solid',
                        borderColor: page === num ? '#2563eb' : '#cbd5e1',
                        backgroundColor: page === num ? '#2563eb' : '#ffffff',
                        color: page === num ? '#ffffff' : '#334155',
                        fontWeight: page === num ? 700 : 500,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                      }}
                    >
                      {num}
                    </button>
                  ))}
                </div>

                <button
                  disabled={page === pagination.totalPages}
                  onClick={() => setPage(page + 1)}
                  style={{
                    padding: '0.5rem 0.85rem',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: page === pagination.totalPages ? '#f8fafc' : '#ffffff',
                    color: page === pagination.totalPages ? '#94a3b8' : '#334155',
                    cursor: page === pagination.totalPages ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                  }}
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeSearch;
