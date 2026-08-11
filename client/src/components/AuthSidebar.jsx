import React, { useState } from 'react';
import { FiShield, FiMail, FiCpu, FiActivity, FiLayers } from 'react-icons/fi';
import { testSmtpApi } from '../services/authService.js';
import { toast } from 'react-hot-toast';

const AuthSidebar = ({ title = "INITIALIZE", subtitle = "ENTER THE ARENA. CONNECT YOUR NODES. SHIP FASTER." }) => {
  const [smtpTesting, setSmtpTesting] = useState(false);
  const [smtpInfo, setSmtpInfo] = useState(null);

  const handleTestSmtp = async () => {
    setSmtpTesting(true);
    try {
      const { data } = await testSmtpApi();
      setSmtpInfo(data.status);
      if (data.status?.connected) {
        toast.success(`SMTP TRANSPORT ONLINE (${data.status.host}:${data.status.port})`);
      } else {
        toast(data.status?.message || 'SMTP RUNNING IN MOCK MODE', { icon: '📧' });
      }
    } catch (err) {
      toast.error('SMTP NODE PING FAILED');
    } finally {
      setSmtpTesting(false);
    }
  };

  return (
    <div className="tribe-sidebar">
      <div>
        {/* Header Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#dfe104', fontSize: '0.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', marginBottom: 12 }}>
          <FiCpu className="spin-slow" /> SYSTEM NODE 01 // SECURE
        </div>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: '#dfe104', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '-0.02em' }}>
          {title}
        </h2>
        <p style={{ fontSize: '0.8rem', color: '#a1a1aa', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', lineHeight: 1.5 }}>
          {subtitle}
        </p>

        {/* Live System & SMTP Status Card */}
        <div style={{ border: '2px solid #3F3F46', background: '#09090b', padding: 16, marginTop: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 800, color: '#dfe104', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="live-status-dot" /> SMTP RELAY GATEWAY
            </span>
            <span style={{ fontSize: '0.65rem', background: 'rgba(223, 225, 4, 0.15)', color: '#dfe104', padding: '2px 6px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
              NODEMAILER v6
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.75rem', color: '#fafafa', fontFamily: 'var(--font-mono)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #27272a', paddingBottom: 6 }}>
              <span style={{ color: '#71717a' }}>TRANSPORT:</span>
              <span style={{ fontWeight: 700 }}>TLS / PORT 587</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #27272a', paddingBottom: 6 }}>
              <span style={{ color: '#71717a' }}>ENCRYPTION:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>RSA-4096 / SHA-256</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#71717a' }}>DISPATCH QUEUE:</span>
              <span style={{ fontWeight: 700, color: '#dfe104' }}>0 QUEUED (READY)</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleTestSmtp}
            disabled={smtpTesting}
            style={{
              width: '100%',
              marginTop: 14,
              padding: '8px 12px',
              backgroundColor: 'transparent',
              border: '1px solid #dfe104',
              color: '#dfe104',
              fontSize: '0.7rem',
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              transition: 'all 0.15s ease',
            }}
          >
            <FiActivity /> {smtpTesting ? 'VERIFYING RELAY...' : 'PING SMTP TRANSPORT'}
          </button>

          {smtpInfo && (
            <div style={{ marginTop: 10, padding: 8, background: '#18181b', border: '1px solid #27272a', fontSize: '0.65rem', color: '#a1a1aa', fontFamily: 'var(--font-mono)' }}>
              <div>MODE: {smtpInfo.mode}</div>
              <div>{smtpInfo.message}</div>
            </div>
          )}
        </div>

        {/* Security & Features Checklist */}
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <FiShield style={{ color: '#dfe104', fontSize: '1rem', marginTop: 2, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fafafa', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                VERIFIED CAMPUS AUTH
              </div>
              <div style={{ fontSize: '0.7rem', color: '#71717a' }}>
                Secure HTTP-Only JWT tokens & automated password reset links.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <FiMail style={{ color: '#dfe104', fontSize: '1rem', marginTop: 2, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fafafa', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                SMTP NOTIFICATIONS
              </div>
              <div style={{ fontSize: '0.7rem', color: '#71717a' }}>
                Instant email dispatch for reviews, upvotes, and password recovery.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <FiLayers style={{ color: '#dfe104', fontSize: '1rem', marginTop: 2, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fafafa', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                GAMIFIED XP ENGINE
              </div>
              <div style={{ fontSize: '0.7rem', color: '#71717a' }}>
                Earn badges and level up as peers test and upvote your code.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer System Metrics Ticker */}
      <div style={{ marginTop: 32, borderTop: '2px solid #3F3F46', paddingTop: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontFamily: 'var(--font-mono)' }}>
          <div>
            <span style={{ fontSize: '0.65rem', color: '#71717a', textTransform: 'uppercase', display: 'block' }}>SHIPPED</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#fafafa' }}>150+ PROJS</span>
          </div>
          <div>
            <span style={{ fontSize: '0.65rem', color: '#71717a', textTransform: 'uppercase', display: 'block' }}>COMMUNITY</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#dfe104' }}>500+ REVIEWS</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSidebar;
