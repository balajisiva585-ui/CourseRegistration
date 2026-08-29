import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  ExternalLink,
  Database,
  Building,
  CheckCircle2,
  AlertTriangle,
  Award,
  BookOpen,
  HelpCircle,
  FileCheck,
} from 'lucide-react';
import tneaService from '../../services/tneaService';

export const DataSources = () => {
  const [sourcesData, setSourcesData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const res = await tneaService.getDataSources();
        if (res?.success) {
          setSourcesData(res.data);
        }
      } catch (err) {
        console.error('Failed to load data sources registry', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSources();
  }, []);

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '2rem 0 4rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: '#ecfdf5',
              color: '#059669',
              padding: '0.35rem 0.85rem',
              borderRadius: '999px',
              fontSize: '0.82rem',
              fontWeight: 800,
              marginBottom: '0.75rem',
            }}
          >
            <ShieldCheck size={16} />
            <span>Official Provenance & Verification Policy</span>
          </div>
          <h1 style={{ fontSize: '2.3rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
            Data Sources & Provenance Registry
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#64748b', maxWidth: '760px', margin: '0 auto', lineHeight: 1.6 }}>
            Every college code, closing cutoff, category seat matrix, and institutional profile on this hub is strictly referenced against official Government of Tamil Nadu gazettes, Anna University affiliation portals, and verified institutional disclosures.
          </p>
        </div>

        {/* Integrity Statistics Bar */}
        {sourcesData?.integrityStats && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2.5rem',
            }}
          >
            <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Database Scale</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>{sourcesData.integrityStats.totalColleges}+</div>
              <div style={{ fontSize: '0.78rem', color: '#2563eb', fontWeight: 600 }}>Catalogued Tamil Nadu Institutions</div>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Data Completeness Index</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#059669' }}>{sourcesData.integrityStats.averageCompleteness}%</div>
              <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 600 }}>Average verified field coverage</div>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Official Gazette Compliance</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#7c3aed' }}>100%</div>
              <div style={{ fontSize: '0.78rem', color: '#7c3aed', fontWeight: 600 }}>Zero invented or hallucinated codes</div>
            </div>
          </div>
        )}

        {/* Data Provenance Priority Hierarchy */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem' }}>
            Authoritative Data Hierarchy
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {(sourcesData?.sources || []).map((source) => (
              <div
                key={source.priority}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '14px',
                  border: '1px solid #e2e8f0',
                  padding: '1.5rem',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span
                      style={{
                        backgroundColor: '#2563eb',
                        color: '#ffffff',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.85rem',
                        fontWeight: 800,
                      }}
                    >
                      {source.priority}
                    </span>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                        {source.name}
                      </h3>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{source.organization} • {source.type}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                      style={{
                        backgroundColor: '#ecfdf5',
                        color: '#065f46',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.6rem',
                        borderRadius: '6px',
                      }}
                    >
                      {source.reliabilityTier}
                    </span>
                    {source.website && (
                      <a
                        href={source.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          color: '#2563eb',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          textDecoration: 'none',
                        }}
                      >
                        <span>Official Portal</span>
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                </div>

                <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.6, margin: 0 }}>
                  <strong>Data Covered:</strong> {source.dataCovered}
                </p>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  Last verified sync: <strong>{source.lastUpdated}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verified Data Badges Guide */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '2rem',
            marginBottom: '3rem',
          }}
        >
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
            Understanding Data Status Badges
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <span style={{ display: 'inline-block', backgroundColor: '#ecfdf5', color: '#065f46', fontWeight: 800, fontSize: '0.75rem', padding: '0.2rem 0.55rem', borderRadius: '4px', marginBottom: '0.5rem' }}>
                ✓ OFFICIAL SOURCE
              </span>
              <p style={{ fontSize: '0.82rem', color: '#475569', margin: 0 }}>
                Directly cross-referenced with DOTE TNEA official booklets, Anna University Affiliation Gazette, or National Statutory bodies.
              </p>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <span style={{ display: 'inline-block', backgroundColor: '#eff6ff', color: '#1d4ed8', fontWeight: 800, fontSize: '0.75rem', padding: '0.2rem 0.55rem', borderRadius: '4px', marginBottom: '0.5rem' }}>
                ✓ COLLEGE OFFICIAL
              </span>
              <p style={{ fontSize: '0.82rem', color: '#475569', margin: 0 }}>
                Sourced from the institution’s official web portal, NIRF public report, or AICTE mandatory public disclosures.
              </p>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <span style={{ display: 'inline-block', backgroundColor: '#fef3c7', color: '#92400e', fontWeight: 800, fontSize: '0.75rem', padding: '0.2rem 0.55rem', borderRadius: '4px', marginBottom: '0.5rem' }}>
                ⚠ NOT YET VERIFIED
              </span>
              <p style={{ fontSize: '0.82rem', color: '#475569', margin: 0 }}>
                Data pending confirmation from official release. Displayed explicitly with warnings rather than presenting unverified assumptions.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center' }}>
          <Link
            to="/colleges"
            style={{
              backgroundColor: '#2563eb',
              color: '#ffffff',
              padding: '0.75rem 2rem',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.95rem',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Explore Verified Colleges Directory →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DataSources;
