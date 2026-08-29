import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bookmark,
  Building,
  Scale,
  Trash2,
  MapPin,
  Briefcase,
  ArrowRight,
  Sparkles,
  Lock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCompare } from '../../context/CompareContext';
import tneaService from '../../services/tneaService';
import CollegeCard from '../../components/hub/CollegeCard';
import DisclaimerBanner from '../../components/hub/DisclaimerBanner';

export const MyColleges = () => {
  const { isAuthenticated, user } = useAuth();
  const { comparedColleges, removeCollegeFromCompare, clearComparison } = useCompare();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFavs = async () => {
      if (!isAuthenticated) return;
      setLoading(true);
      try {
        const res = await tneaService.getFavorites();
        if (res?.success) {
          setFavorites(res.data);
        }
      } catch (err) {
        console.error('Failed to load favorites', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavs();
  }, [isAuthenticated]);

  const handleFavoriteRemoved = (collegeId) => {
    setFavorites((prev) => prev.filter((f) => (f.college?._id || f.college) !== collegeId));
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '1.5rem 0 4rem' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#059669', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
            <Bookmark size={18} />
            <span>Personal Counselling Portfolio</span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
            My Saved Colleges & Shortlist
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '0.25rem' }}>
            Manage your bookmarked institutions, tracked comparison slots, and preferred counselling choices.
          </p>
        </div>

        {/* Disclaimer */}
        <DisclaimerBanner />

        {/* Authentication Notice if not logged in */}
        {!isAuthenticated && (
          <div
            style={{
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Lock size={24} color="#2563eb" />
              <div>
                <strong style={{ fontSize: '0.95rem', color: '#1e40af' }}>Sign In to Sync Your Favorites Across Devices</strong>
                <p style={{ fontSize: '0.82rem', color: '#3b82f6', margin: 0 }}>
                  Create an account or sign in to permanently bookmark engineering colleges, save department choices, and track cutoffs.
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" style={{ backgroundColor: '#ffffff', color: '#1e40af', border: '1px solid #bfdbfe', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none' }}>
                Sign In
              </Link>
              <Link to="/register" style={{ backgroundColor: '#2563eb', color: '#ffffff', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none' }}>
                Create Account
              </Link>
            </div>
          </div>
        )}

        {/* 1. Bookmarked Favorites Section */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Bookmarked Colleges ({favorites.length})
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>Institutions you have saved for counselling review.</p>
            </div>
            <Link to="/colleges" style={{ color: '#2563eb', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none' }}>
              + Add More Colleges
            </Link>
          </div>

          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
              Loading your bookmarked colleges...
            </div>
          ) : favorites.length === 0 ? (
            <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '3rem', textAlign: 'center' }}>
              <Bookmark size={40} color="#94a3b8" style={{ margin: '0 auto 0.75rem' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>No Colleges Bookmarked Yet</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>Click the bookmark icon on any college card to pin it here.</p>
              <Link to="/colleges" style={{ backgroundColor: '#2563eb', color: '#ffffff', padding: '0.55rem 1.25rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none' }}>
                Explore College Directory
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {favorites.map((fav) => {
                if (!fav.college) return null;
                return (
                  <CollegeCard
                    key={fav._id}
                    college={fav.college}
                    isFavorited={true}
                    onFavoriteToggle={handleFavoriteRemoved}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* 2. Active Compared Colleges Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Active Comparison Shortlist ({comparedColleges.length}/4)
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>Colleges currently queued in your comparison matrix.</p>
            </div>

            {comparedColleges.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={clearComparison}
                  style={{
                    backgroundColor: '#fee2e2',
                    color: '#dc2626',
                    border: '1px solid #fca5a5',
                    padding: '0.4rem 0.85rem',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Clear Queue
                </button>
                <Link
                  to="/compare"
                  style={{
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    padding: '0.4rem 0.85rem',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  <Scale size={13} />
                  <span>Open Comparison Table</span>
                </Link>
              </div>
            )}
          </div>

          {comparedColleges.length === 0 ? (
            <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '2.5rem', textAlign: 'center' }}>
              <Scale size={36} color="#94a3b8" style={{ margin: '0 auto 0.5rem' }} />
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>No colleges added to comparison. Click "Compare" on any college profile.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {comparedColleges.map((col) => (
                <div
                  key={col.code}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    padding: '1.15rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <div>
                    <span style={{ backgroundColor: '#1e293b', color: '#ffffff', fontSize: '0.72rem', fontWeight: 800, padding: '0.15rem 0.45rem', borderRadius: '4px', display: 'inline-block', marginBottom: '0.35rem' }}>
                      Code: {col.code}
                    </span>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>
                      {col.name}
                    </h4>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{col.district}</div>
                  </div>

                  <button
                    onClick={() => removeCollegeFromCompare(col.code)}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: '#dc2626',
                      cursor: 'pointer',
                      padding: '0.2rem',
                    }}
                    title="Remove from compare"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyColleges;
