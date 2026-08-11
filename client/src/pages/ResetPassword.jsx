import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { resetPasswordUser } from '../services/authService.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { toast } from 'react-hot-toast';
import MetaTags from '../components/MetaTags.jsx';
import AuthSidebar from '../components/AuthSidebar.jsx';
import { FiLock, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import '../styles/Auth.css';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { fetchMe } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error('PLEASE FILL IN ALL FIELDS');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('PASSWORDS DO NOT MATCH');
      return;
    }

    if (password.length < 6) {
      toast.error('PASSWORD MUST BE AT LEAST 6 CHARACTERS');
      return;
    }

    setLoading(true);
    try {
      await resetPasswordUser(token, password);
      toast.success('ACCESS KEY UPDATED! AUTHENTICATED SUCCESSFULLY 🚀');
      if (fetchMe) await fetchMe();
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'INVALID OR EXPIRED RESET TOKEN');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-kinetic">
      <MetaTags
        title="Reset Access Key — DevHunt SRM"
        description="Set a new password for your DevHunt SRM developer account using your secure SMTP reset token."
      />

      {/* Header */}
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
          SECURE OVERWRITE PROTOCOL /// TOKEN VERIFICATION ACTIVE /// OVERWRITE ACCESS KEY /// SECURE OVERWRITE PROTOCOL ///
        </div>
      </div>

      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Stroke Title */}
        <div style={{ borderBottom: '2px solid #3F3F46', padding: '36px 16px', display: 'flex', justifyContent: 'center', background: '#09090b', overflow: 'hidden' }}>
          <h1 className="kinetic-stroke-title" style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)' }}>
            NEW ACCESS KEY
          </h1>
        </div>

        {/* 2-Column Grid with Left Portion (AuthSidebar) */}
        <div className="tribe-grid">
          <AuthSidebar
            title="KEY OVERWRITE"
            subtitle="AUTHORIZE NEW CREDENTIALS TO RESTORE SECURE SYSTEM ACCESS."
          />

          <div className="tribe-form-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 450 }}>
            <div style={{ maxWidth: 440, width: '100%', margin: '0 auto' }}>
              <div style={{ marginBottom: 28 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: '#fafafa', textTransform: 'uppercase', marginBottom: 8 }}>
                  ENTER NEW PASSWORD
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#a1a1aa', fontFamily: 'var(--font-mono)' }}>
                  PROVIDE A MINIMUM 6-CHARACTER PASSWORD TO OVERWRITE YOUR ACCOUNT ACCESS KEY.
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="step-box">
                  <div className="step-badge">01. NEW ACCESS KEY</div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fafafa', textTransform: 'uppercase', display: 'block', marginBottom: 8, fontFamily: 'var(--font-mono)' }}>
                      NEW PASSWORD *
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoFocus
                      className="kinetic-input"
                    />
                  </div>
                </div>

                <div className="step-box">
                  <div className="step-badge">02. CONFIRMATION</div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fafafa', textTransform: 'uppercase', display: 'block', marginBottom: 8, fontFamily: 'var(--font-mono)' }}>
                      CONFIRM NEW PASSWORD *
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="kinetic-input"
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="kinetic-button">
                  <FiLock /> {loading ? 'OVERWRITING...' : 'OVERWRITE ACCESS KEY →'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '2px solid #3F3F46', background: '#09090b', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#a1a1aa', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
        <div>© 2026 DEVHUNT SRM — AUTHENTICATION SYSTEM</div>
        <div>NODE VERSION v2.4</div>
      </footer>
    </div>
  );
};

export default ResetPassword;
