import React from 'react';
import { Link } from 'react-router-dom';
import {
  Info,
  Calculator,
  ShieldCheck,
  Building,
  GraduationCap,
  Layers,
  BookOpen,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import DisclaimerBanner from '../../components/hub/DisclaimerBanner';

export const AboutHub = () => {
  const reservationRules = [
    { category: 'OC (Open Competition)', percentage: '31%', desc: 'Open to all candidates irrespective of community based purely on merit.' },
    { category: 'BC (Backward Class)', percentage: '26.5%', desc: 'Reserved for candidates belonging to non-Muslim Backward Classes.' },
    { category: 'BCM (Backward Class Muslim)', percentage: '3.5%', desc: 'Reserved for candidates belonging to Backward Class Muslims.' },
    { category: 'MBC & DNC', percentage: '20.0%', desc: 'Most Backward Classes and De-notified Communities.' },
    { category: 'SC (Scheduled Caste)', percentage: '15.0%', desc: 'Reserved for candidates belonging to Scheduled Castes.' },
    { category: 'SCA (SC Arunthathiyar)', percentage: '3.0%', desc: 'Sub-quota reservation within Scheduled Castes.' },
    { category: 'ST (Scheduled Tribe)', percentage: '1.0%', desc: 'Reserved for candidates belonging to Scheduled Tribes.' },
  ];

  const futureBranches = [
    { title: 'Engineering & Technology', status: 'Active (v1.0)', desc: 'B.E. & B.Tech. programs across 400+ institutions in Tamil Nadu.' },
    { title: 'Medical & Dental (NEET/TN Health)', status: 'Planned (v2.0)', desc: 'MBBS, BDS, AYUSH, and Allied Health Sciences cutoff analytics.' },
    { title: 'Arts, Science & Commerce', status: 'Planned (v2.0)', desc: 'Autonomous & Government Arts & Science college centralized discovery.' },
    { title: 'Architecture (B.Arch.)', status: 'Planned (v2.0)', desc: 'NATA and TNEA Architecture counselling merit list tracking.' },
    { title: 'Polytechnic & Diploma', status: 'Planned (v3.0)', desc: 'Diploma to B.E. Direct 2nd Year Lateral Entry counselling paths.' },
  ];

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '1.5rem 0 4rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '0.3rem 0.85rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            <GraduationCap size={16} />
            <span>Platform Overview & Methodology</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            About Smart Course Registration & Academic Planning
          </h1>
          <p style={{ fontSize: '1rem', color: '#64748b', maxWidth: '720px', margin: '0 auto', lineHeight: 1.6 }}>
            A modernized, student-centric central information repository designed to demystify TNEA cutoffs, seat matrices, and counselling choices for Tamil Nadu engineering aspirants.
          </p>
        </div>

        {/* Disclaimer */}
        <DisclaimerBanner />

        {/* 1. Cutoff Calculation Formula Box */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calculator size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                TNEA Cutoff Calculation Formula
              </h2>
              <div style={{ fontSize: '0.82rem', color: '#64748b' }}>Standard Tamil Nadu DOTE Normalization Rule</div>
            </div>
          </div>

          <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            The Tamil Nadu Engineering Admissions (TNEA) cutoff is calculated for a maximum of <strong>200 marks</strong> based on the student's marks in +2 Higher Secondary Board examinations (Tamil Nadu State Board, CBSE, ICSE, or equivalent):
          </p>

          <div
            style={{
              backgroundColor: '#0f172a',
              color: '#ffffff',
              borderRadius: '12px',
              padding: '1.5rem',
              textAlign: 'center',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Formula</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.02em' }}>
              Cutoff = Mathematics + (Physics ÷ 2) + (Chemistry ÷ 2)
            </div>
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '0.5rem' }}>
              Max: 100 (Maths) + 50 (Physics) + 50 (Chemistry) = <strong>200 Marks</strong>
            </div>
          </div>

          <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.82rem', color: '#475569' }}>
            <strong>Tie-Breaking Rules:</strong> When two or more candidates obtain identical cutoff marks, inter-se merit is determined sequentially by: (1) Higher marks in Mathematics, (2) Higher marks in Physics, (3) Higher marks in optional subject, (4) Date of Birth (elder candidate given priority), and (5) Random unique number assigned by TNEA.
          </div>
        </div>

        {/* Simulator Methodology Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                How Our TNEA Allotment Simulator Works
              </h2>
              <div style={{ fontSize: '0.82rem', color: '#64748b' }}>Decision-support simulation algorithm based on multi-year data</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#2563eb', marginBottom: '0.25rem' }}>1. Candidate Normalization</div>
              <p style={{ fontSize: '0.8rem', color: '#475569', margin: 0 }}>Computes candidate engineering cutoff out of 200 and matches community reservation (OC, BC, BCM, MBC, SC, SCA, ST) and special quota.</p>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#059669', marginBottom: '0.25rem' }}>2. 5-Year Trend Analysis</div>
              <p style={{ fontSize: '0.8rem', color: '#475569', margin: 0 }}>Indexes multi-year closing scores from 2021 to 2025 to calculate average closing marks and trend momentum.</p>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#7c3aed', marginBottom: '0.25rem' }}>3. Live Seat Matrix Integration</div>
              <p style={{ fontSize: '0.8rem', color: '#475569', margin: 0 }}>Cross-references round-wise vacancy in Government vs Management quotas across reservation categories.</p>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#d97706', marginBottom: '0.25rem' }}>4. Preference Order Simulation</div>
              <p style={{ fontSize: '0.8rem', color: '#475569', margin: 0 }}>Evaluates choices in the candidate's exact prioritized order to return the Highest Recommended choice with full transparency.</p>
            </div>
          </div>

          <div style={{ backgroundColor: '#fffbeb', padding: '0.85rem', borderRadius: '8px', border: '1px solid #fde68a', fontSize: '0.82rem', color: '#92400e' }}>
            <strong>Important Guidance:</strong> The simulator is an educational decision-support tool. Allotment probabilities represent estimates derived from historical closing data and available vacancies, and do not constitute an official seat allotment or guarantee.
          </div>
        </div>

        {/* 2. Tamil Nadu Community Reservation Policy */}
        <div
          id="community-reservations"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Tamil Nadu 69% Reservation Matrix Policy
              </h2>
              <div style={{ fontSize: '0.82rem', color: '#64748b' }}>Statutory quota distribution in Government & Self-Financing Quota Seats</div>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Category</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Reservation %</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Description & Scope</th>
                </tr>
              </thead>
              <tbody>
                {reservationRules.map((rule) => (
                  <tr key={rule.category} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#0f172a' }}>{rule.category}</td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#2563eb' }}>{rule.percentage}</td>
                    <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>{rule.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Future Educational Branches Roadmap */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '2rem',
            marginBottom: '2.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Platform Extensibility & Future Branches
              </h2>
              <div style={{ fontSize: '0.82rem', color: '#64748b' }}>Engineered for modular multi-stream expansion</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {futureBranches.map((b) => (
              <div key={b.title} style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{b.title}</strong>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, backgroundColor: b.status.includes('Active') ? '#ecfdf5' : '#f1f5f9', color: b.status.includes('Active') ? '#059669' : '#64748b', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                    {b.status}
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0, lineHeight: 1.45 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links Footer CTA */}
        <div style={{ textAlign: 'center' }}>
          <Link
            to="/colleges"
            style={{
              backgroundColor: '#2563eb',
              color: '#ffffff',
              padding: '0.75rem 1.75rem',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.95rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <span>Start Exploring Colleges Now</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutHub;
