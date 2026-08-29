import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ShieldAlert, ExternalLink, Heart, MapPin, Phone, Mail, FileText } from 'lucide-react';

export const HubFooter = () => {
  return (
    <footer style={{ backgroundColor: '#0f172a', color: '#94a3b8', borderTop: '1px solid #1e293b', paddingTop: '3rem', paddingBottom: '2rem' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Main Columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
          {/* Brand & Purpose */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg, #2563eb, #0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                <GraduationCap size={20} />
              </div>
              <span style={{ color: '#ffffff', fontWeight: 800, fontSize: '1.15rem' }}>TNEA College Hub</span>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: '#94a3b8', marginBottom: '1.25rem' }}>
              Tamil Nadu's modern centralized portal for engineering college exploration, historical TNEA cutoff trends, category seat availability matrices, and student decision support.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#1e293b', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', color: '#38bdf8' }}>
              <ShieldAlert size={14} />
              <span>Independent Educational Resource</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>Quick Navigation</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
              <li><Link to="/colleges" style={{ color: '#cbd5e1', textDecoration: 'none' }}>College Directory & Filters</Link></li>
              <li><Link to="/simulator" style={{ color: '#38bdf8', fontWeight: 700, textDecoration: 'none' }}>🎯 TNEA Allotment Simulator</Link></li>
              <li><Link to="/cutoffs" style={{ color: '#cbd5e1', textDecoration: 'none' }}>TNEA Multi-Year Cutoffs</Link></li>
              <li><Link to="/seats" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Seat Availability Matrix</Link></li>
              <li><Link to="/compare" style={{ color: '#cbd5e1', textDecoration: 'none' }}>4-College Comparison Tool</Link></li>
              <li><Link to="/data-sources" style={{ color: '#34d399', fontWeight: 600, textDecoration: 'none' }}>Data Sources & Provenance Registry</Link></li>
              <li><Link to="/applications" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Application Portals & Deadlines</Link></li>
              <li><Link to="/fees" style={{ color: '#f59e0b', textDecoration: 'none' }}>Fee Structure (Coming Soon)</Link></li>
            </ul>
          </div>

          {/* Popular Districts */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>Explore by District</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
              <li><Link to="/colleges?district=Chennai" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Engineering Colleges in Chennai</Link></li>
              <li><Link to="/colleges?district=Coimbatore" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Engineering Colleges in Coimbatore</Link></li>
              <li><Link to="/colleges?district=Madurai" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Engineering Colleges in Madurai</Link></li>
              <li><Link to="/colleges?district=Salem" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Engineering Colleges in Salem</Link></li>
              <li><Link to="/colleges?district=Erode" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Engineering Colleges in Erode</Link></li>
              <li><Link to="/colleges?district=Tirunelveli" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Engineering Colleges in Tirunelveli</Link></li>
            </ul>
          </div>

          {/* Important Counselling & Official Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>Official Resources</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
              <li>
                <a href="https://www.tneaonline.org" target="_blank" rel="noopener noreferrer" style={{ color: '#cbd5e1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>TNEA Official Portal</span>
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="https://www.annauniv.edu" target="_blank" rel="noopener noreferrer" style={{ color: '#cbd5e1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>Anna University Chennai</span>
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="https://www.dte.tn.gov.in" target="_blank" rel="noopener noreferrer" style={{ color: '#cbd5e1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>Directorate of Technical Education (DOTE)</span>
                  <ExternalLink size={12} />
                </a>
              </li>
              <li><Link to="/about" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Cutoff Calculation Formula (Maths + Physics + Chem)</Link></li>
              <li><Link to="/about#community-reservations" style={{ color: '#cbd5e1', textDecoration: 'none' }}>TN Community Reservation Rules</Link></li>
            </ul>
          </div>
        </div>

        {/* Mandatory Disclaimer Box */}
        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '1.25rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <ShieldAlert size={20} color="#f59e0b" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
            <div>
              <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.35rem' }}>
                Important Educational & Legal Disclaimer
              </div>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                Information provided on this platform is for reference and guidance. Always verify admission, cutoff marks, seat availability, and application details with the official TNEA counselling portal (<a href="https://www.tneaonline.org" target="_blank" rel="noreferrer" style={{ color: '#38bdf8' }}>www.tneaonline.org</a>) or respective college authorities before finalizing admission decisions. Seat availability figures reflect demo/simulated estimates for development.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: '1px solid #1e293b', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: '#64748b' }}>
          <div>
            © {new Date().getFullYear()} Tamil Nadu Engineering College Central Hub. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <Link to="/about" style={{ color: '#94a3b8', textDecoration: 'none' }}>About & Methodology</Link>
            <Link to="/about#privacy" style={{ color: '#94a3b8', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link to="/about#terms" style={{ color: '#94a3b8', textDecoration: 'none' }}>Terms of Reference</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default HubFooter;
