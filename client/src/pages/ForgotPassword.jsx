import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPasswordUser } from '../services/authService.js';
import { toast } from 'react-hot-toast';
import MetaTags from '../components/MetaTags.jsx';
import AuthSidebar from '../components/AuthSidebar.jsx';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import '../styles/Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('PLEASE PROVIDE YOUR REGISTERED EMAIL');
      return;
    }

    setLoading(true);
    try {
      const { data } = await forgotPasswordUser(email);
      setSubmitted(true);
      if (data.resetUrl) {
        setDevResetUrl(data.resetUrl);
      }
      toast.success('RESET AUTHORIZATION DISPATCHED VIA SMTP');
    } catch (err) {
      toast.error(err.response?.data?.message || 'FAILED TO DISPATCH RESET EMAIL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-kinetic">
      <MetaTags
        title="Password Reset — DevHunt SRM"
        description="Request a secure password reset key via SMTP to recover access to your DevHunt SRM campus developer account."
      />

      {/* Top Branding Header */}
      <header style={{ borderBottom: '2px solid #3F3F46', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#09090b' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: '#dfe104', textTransform: 'uppercase', letterSpacing: '-0.04em' }}>
          DEVHUNT SRM
        </div>
        <Link to="/login" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700, color: '#fafafa', textTransform: 'uppercase', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
          <FiArrowLeft /> BACK TO LOGIN
        </Link>
      </header>

      {/* Marquee Banner */}
      <div className="marquee-container" style={{ margin: 0 }}>
        <div className="marquee-content" style={{ fontSize: '0.8rem', color: '#a1a1aa', fontFamily: 'var(--font-mono)' }}>
          SECURE SMTP PROTOCOL /// PASSWORD RECOVERY NODE /// ENCRYPTED TOKEN DISPATCH /// SECURE SMTP PROTOCOL /// PASSWORD RECOVERY NODE ///
        </div>
      </div>

      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Stroke Hero Title */}
        <div style={{ borderBottom: '2px solid #3F3F46', padding: '36px 16px', display: 'flex', justifyContent: 'center', background: '#09090b', overflow: 'hidden' }}>
          <h1 className="kinetic-stroke-title" style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)' }}>
            RECOVER ACCESS
          </h1>
        </div>

        {/* 2-Column Grid with Left Portion (AuthSidebar) */}
        <div className="tribe-grid">
          <AuthSidebar
            title="RECOVERY NODE"
            subtitle="REQUEST AN SMTP ENCRYPTED RESET TOKEN TO RECOVER YOUR ACCOUNT."
          />

          <div className="tribe-form-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 450 }}>
            {submitted ? (
              <div style={{ border: '2px solid #dfe104', background: '#131315', padding: 32, textAlign: 'center' }}>
                <FiCheckCircle style={{ fontSize: '3rem', color: '#dfe104', marginBottom: 16 }} />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, color: '#fafafa', textTransform: 'uppercase', marginBottom: 12 }}>
                  DISPATCH CONFIRMED
                </h3>
                <p style={{ color: '#a1a1aa', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', lineHeight: 1.6, marginBottom: 20 }}>
                  We have dispatched a secure password reset link to <strong style={{ color: '#fafafa' }}>{email}</strong> via Nodemailer SMTP.
                </p>

                {devResetUrl && (
                  <div style={{ marginTop: 20, padding: 16, background: '#09090b', border: '1px dashed #dfe104', textAlign: 'left' }}>
                    <span style={{ fontSize: '0.7rem', color: '#dfe104', fontFamily: 'var(--font-mono)', fontWeight: 800, display: 'block', marginBottom: 6 }}>
                      ⚡ DEV MODE QUICK LINK:
                    </span>
                    <a href={devResetUrl} style={{ fontSize: '0.75rem', color: '#3b82f6', wordBreak: 'break-all', fontFamily: 'var(--font-mono)' }}>
                      {devResetUrl}
                    </a>
                  </div>
                )}

                <div style={{ marginTop: 24 }}>
                  <button
                    onClick={() => { setSubmitted(false); setEmail(''); }}
                    className="acid-btn"
                    style={{ padding: '12px 24px', fontSize: '0.85rem' }}
                  >
                    SEND ANOTHER DISPATCH
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ maxWidth: 440, width: '100%', margin: '0 auto' }}>
                <div style={{ marginBottom: 28 }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: '#fafafa', textTransform: 'uppercase', marginBottom: 8 }}>
                    FORGOT PASSWORD?
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#a1a1aa', fontFamily: 'var(--font-mono)' }}>
                    ENTER YOUR REGISTERED EMAIL ADDRESS BELOW TO RECEIVE AN ENCRYPTED RESET LINK.
                  </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div className="step-box">
                    <div className="step-badge">01. IDENTIFIER</div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fafafa', textTransform: 'uppercase', display: 'block', marginBottom: 8, fontFamily: 'var(--font-mono)' }}>
                        EMAIL ADDRESS *
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="email"
                          placeholder="developer@srmist.edu.in"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          autoFocus
                          className="kinetic-input"
                        />
                      </div>
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className="kinetic-button">
                    <FiMail /> {loading ? 'DISPATCHING...' : 'DISPATCH RESET LINK →'}
                  </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: 24, fontSize: '0.75rem', color: '#a1a1aa', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                  REMEMBER YOUR KEY?{' '}
                  <Link to="/login" style={{ color: '#dfe104', textDecoration: 'underline', fontWeight: 800 }}>
                    RETURN TO LOGIN
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '2px solid #3F3F46', background: '#09090b', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#a1a1aa', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
        <div>© 2026 DEVHUNT SRM — SECURE SMTP MAIL RELAY</div>
        <div>NODE VERSION v2.4</div>
      </footer>
    </div>
  );
};

export default ForgotPassword;
