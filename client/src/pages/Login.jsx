import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { toast } from 'react-hot-toast';
import MetaTags from '../components/MetaTags.jsx';
import AuthSidebar from '../components/AuthSidebar.jsx';
import '../styles/Auth.css';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const googleBtnRef = useRef(null);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  // Handle Google credential response
  const handleGoogleResponse = useCallback(async (response) => {
    try {
      await googleLogin(response.credential);
      toast.success('AUTHENTICATED VIA GOOGLE');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'GOOGLE AUTH FAILED');
    }
  }, [googleLogin, navigate]);

  // Load Google Identity Services & render button
  useEffect(() => {
    window.__devhunt_google_cb = handleGoogleResponse;

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google && googleBtnRef.current) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: window.__devhunt_google_cb,
        });
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'filled_black',
          size: 'large',
          width: googleBtnRef.current.offsetWidth,
          text: 'signin_with',
          shape: 'rectangular',
        });
      }
    };
    document.head.appendChild(script);
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [handleGoogleResponse]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('PLEASE FILL IN ALL FIELDS');
      return;
    }
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      toast.success('AUTHENTICATED SUCCESSFULLY');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'INVALID CREDENTIALS');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-kinetic">
      <MetaTags
        title="Login — DevHunt SRM"
        description="Authenticate to access your DevHunt SRM developer account, manage project submissions, and upvote campus innovations."
      />
      {/* Header */}
      <header style={{ borderBottom: '2px solid #3F3F46', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#09090b' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: '#dfe104', textTransform: 'uppercase', letterSpacing: '-0.04em' }}>
          DEVHUNT SRM
        </div>
        <Link to="/" style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 700, color: '#fafafa', textTransform: 'uppercase', textDecoration: 'none' }}>
          ✕ CANCEL
        </Link>
      </header>

      {/* Top Status Marquee Banner */}
      <div className="marquee-container" style={{ margin: 0 }}>
        <div className="marquee-content" style={{ fontSize: '0.75rem', color: '#a1a1aa', fontFamily: 'var(--font-mono)' }}>
          SYSTEM STATUS: OPTIMAL /// DEVHUNT SRM SECURE LOGIN /// NODE ACTIVE /// SYSTEM STATUS: OPTIMAL /// DEVHUNT SRM SECURE LOGIN /// NODE ACTIVE ///
        </div>
      </div>

      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Headline */}
        <div style={{ borderBottom: '2px solid #3F3F46', padding: '36px 16px', display: 'flex', justifyContent: 'center', background: '#09090b', overflow: 'hidden' }}>
          <h1 className="kinetic-stroke-title" style={{ fontSize: 'clamp(3.5rem, 9vw, 7rem)' }}>
            SECURE LOGIN
          </h1>
        </div>

        {/* 2-Column Grid with Left Portion (AuthSidebar) */}
        <div className="tribe-grid">
          <AuthSidebar
            title="SYSTEM CLEARANCE"
            subtitle="AUTHENTICATE TO ACCESS SECURE CAMPUS DEVELOPER NODES."
          />

          <div className="tribe-form-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ maxWidth: 440, width: '100%', margin: '0 auto' }}>
              {/* Google Sign-In Button (rendered by Google SDK) */}
              <div
                ref={googleBtnRef}
                style={{
                  width: '100%',
                  marginBottom: 20,
                  display: 'flex',
                  justifyContent: 'center',
                  minHeight: 44,
                }}
              />

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{ flex: 1, height: 1, background: '#3F3F46' }} />
                <span style={{ fontSize: '0.7rem', color: '#71717a', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', fontWeight: 700 }}>
                  OR USE CREDENTIALS
                </span>
                <div style={{ flex: 1, height: 1, background: '#3F3F46' }} />
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div className="step-box">
                  <div className="step-badge">01. IDENTIFIER</div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fafafa', textTransform: 'uppercase', display: 'block', marginBottom: 8, fontFamily: 'var(--font-mono)' }}>
                      IDENTIFIER [EMAIL] *
                    </label>
                    <input
                      type="email"
                      placeholder="user@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      autoFocus
                      aria-label="Email address"
                      className="kinetic-input"
                    />
                  </div>
                </div>

                <div className="step-box">
                  <div className="step-badge">02. ACCESS KEY</div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fafafa', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                        ACCESS KEY [PASSWORD] *
                      </label>
                      <Link to="/forgot-password" style={{ fontSize: '0.7rem', fontWeight: 800, color: '#dfe104', textTransform: 'uppercase', textDecoration: 'none' }}>
                        RESET VIA SMTP
                      </Link>
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      className="kinetic-input"
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="kinetic-button">
                  {loading ? 'AUTHENTICATING...' : 'ENTER SYSTEM →'}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: 24, fontSize: '0.75rem', color: '#a1a1aa', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                NO CLEARANCE? <Link to="/register" style={{ color: '#dfe104', textDecoration: 'underline', fontWeight: 800, marginLeft: 6 }}>REQUEST ACCESS</Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Footer */}
      <div style={{ borderTop: '2px solid #3F3F46', background: '#09090b', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#a1a1aa', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
        <div>© 2026 DEVHUNT SRM.</div>
        <div style={{ display: 'flex', gap: 20 }}>
          <a href="#" style={{ color: '#a1a1aa', textDecoration: 'none' }}>TERMS</a>
          <a href="#" style={{ color: '#a1a1aa', textDecoration: 'none' }}>PRIVACY</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
