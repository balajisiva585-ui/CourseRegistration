import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  Clock,
  Sparkles,
  ShieldCheck,
  Building,
  CheckCircle2,
  Bell,
  ArrowRight,
  Calculator,
  Lock,
} from 'lucide-react';
import DisclaimerBanner from '../../components/hub/DisclaimerBanner';

export const FeesHub = () => {
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailInput) {
      setSubscribed(true);
    }
  };

  const feeModules = [
    {
      title: 'TNEA Government Quota Fees',
      description: 'Standardized annual tuition caps approved by the Government of Tamil Nadu Fee Fixation Committee for Govt, Govt-Aided & Self-Financing institutions.',
      icon: ShieldCheck,
      color: '#059669',
      bgColor: '#ecfdf5',
    },
    {
      title: 'Management Quota Fee Structures',
      description: 'Transparent breakdowns of tuition, institutional development, and special laboratory charges across self-financing autonomous engineering colleges.',
      icon: Building,
      color: '#2563eb',
      bgColor: '#eff6ff',
    },
    {
      title: 'Hostel & Mess Charges',
      description: 'Room-wise tariffs (AC, Non-AC, 2/3/4 sharing), caution deposits, and monthly mess subscription rates across all engineering campuses.',
      icon: DollarSign,
      color: '#7c3aed',
      bgColor: '#f5f3ff',
    },
    {
      title: 'Transport & Bus Slabs',
      description: 'Route-wise annual transportation charges, pickup points, and bus fleet coverage across urban and rural zones.',
      icon: Calculator,
      color: '#d97706',
      bgColor: '#fffbeb',
    },
  ];

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '1.5rem 0 4rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Top Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', padding: '0.35rem 0.85rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 800, marginBottom: '1rem' }}>
            <Clock size={15} />
            <span>FEATURE IN ACTIVE DEVELOPMENT – COMING SOON</span>
          </div>

          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: '0.75rem' }}>
            Engineering College Fees & Cost Intelligence Engine
          </h1>

          <p style={{ fontSize: '1rem', color: '#64748b', lineHeight: 1.6 }}>
            We are designing a comprehensive fee breakdown portal that will provide verified annual tuition, hostel, transport, and quota cost comparisons across all Tamil Nadu engineering colleges without hidden charges.
          </p>
        </div>

        {/* Disclaimer */}
        <DisclaimerBanner customText="Fee structures vary by autonomous status, accreditation tier, and official Fee Fixation Committee revisions. To preserve high data integrity, live fee queries will be unlocked in the upcoming release." />

        {/* Preview of Upcoming Fee Matrix Modules */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
          {feeModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.title}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '14px',
                  border: '1px solid #e2e8f0',
                  padding: '1.5rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', color: '#cbd5e1' }}>
                  <Lock size={18} />
                </div>

                <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: mod.bgColor, color: mod.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <Icon size={22} />
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                  {mod.title}
                </h3>

                <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                  {mod.description}
                </p>

                <div style={{ marginTop: '1.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700 }}>
                  <span>Schema Ready</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Early Access Notification Box */}
        <div
          style={{
            backgroundColor: '#0f172a',
            borderRadius: '16px',
            color: '#ffffff',
            padding: '2.5rem',
            textAlign: 'center',
            maxWidth: '720px',
            margin: '0 auto 3rem',
            boxShadow: '0 10px 25px rgba(15,23,42,0.15)',
          }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(56,189,248,0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Bell size={24} />
          </div>

          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem', color: '#ffffff' }}>
            Get Notified When Fees Module Goes Live
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8', maxWidth: '500px', margin: '0 auto 1.5rem', lineHeight: 1.5 }}>
            Be the first to access verified fee calculators, scholarship estimators (First Graduate, 7.5% Govt School Quota, PMSS), and fee comparison metrics.
          </p>

          {subscribed ? (
            <div style={{ backgroundColor: '#10b981', color: '#ffffff', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} />
              <span>You are on the early access priority list!</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} style={{ display: 'flex', maxWidth: '420px', margin: '0 auto', gap: '0.5rem' }}>
              <input
                type="email"
                placeholder="Enter your email address..."
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
                style={{
                  flex: 1,
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #334155',
                  backgroundColor: '#1e293b',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.65rem 1.25rem',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Notify Me
              </button>
            </form>
          )}
        </div>

        {/* Explore Other Features CTA */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.75rem' }}>Meanwhile, explore live TNEA tools:</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/colleges" style={{ backgroundColor: '#ffffff', color: '#1e293b', border: '1px solid #cbd5e1', padding: '0.6rem 1.25rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none' }}>
              Search Colleges
            </Link>
            <Link to="/cutoffs" style={{ backgroundColor: '#ffffff', color: '#1e293b', border: '1px solid #cbd5e1', padding: '0.6rem 1.25rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none' }}>
              Explore Cutoffs
            </Link>
            <Link to="/predictor" style={{ backgroundColor: '#2563eb', color: '#ffffff', padding: '0.6rem 1.25rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none' }}>
              Cutoff Predictor →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeesHub;
