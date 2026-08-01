import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { toast } from 'react-hot-toast';
import MetaTags from '../components/MetaTags.jsx';
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
    // Store callback globally so the script can find it
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
      {/* Top Status Marquee Banner */}
      <div className="marquee-container" style={{ margin: 0, padding: '8px 0', background: '#09090b', borderBottom: '2px solid #3F3F46' }}>
        <div className="marquee-content" style={{ fontSize: '0.75rem', color: '#a1a1aa', fontFamily: 'var(--font-mono)' }}>
          SYSTEM STATUS: OPTIMAL /// DEVHUNT SRM SECURE LOGIN /// NODE ACTIVE /// SYSTEM STATUS: OPTIMAL /// DEVHUNT SRM SECURE LOGIN /// NODE ACTIVE ///
        </div>
      </div>

      <div className="auth-container-kinetic">
        {/* Background Watermark */}
        <div style={{ position: 'absolute', top: '10%', left: '5%', fontSize: '18vw', fontWeight: 900, opacity: 0.03, color: '#fafafa', pointerEvents: 'none', userSelect: 'none' }}>
          01
        </div>
        <div style={{ position: 'absolute', bottom: '5%', right: '5%', fontSize: '20vw', fontWeight: 900, opacity: 0.03, color: '#dfe104', pointerEvents: 'none', userSelect: 'none' }}>
          XX
        </div>

        {/* Headline */}
        <div className="text-center" style={{ marginBottom: 40, position: 'relative', zIndex: 10 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3.5rem, 9vw, 7rem)', fontWeight: 800, color: '#fafafa', textTransform: 'uppercase', letterSpacing: '-0.04em', lineHeight: 1, margin: 0 }}>
            LOGIN <span style={{ display: 'inline-block', width: 40, height: 12, background: '#dfe104', marginLeft: 8 }} />
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 12, fontFamily: 'var(--font-mono)' }}>
            AUTHENTICATE TO ACCESS SECURE SYSTEMS
          </p>
        </div>

        {/* Form Card */}
        <div className="auth-card-kinetic brutal-border" style={{ maxWidth: 480, margin: '0 auto', background: '#09090b', padding: 36, position: 'relative', zIndex: 10 }}>
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
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fafafa', textTransform: 'uppercase', display: 'block', marginBottom: 8, fontFamily: 'var(--font-mono)' }}>
                IDENTIFIER [EMAIL]
              </label>
              <input
                type="email"
                placeholder="user@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                autoFocus
                aria-label="Email address"
                style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '2px solid #3F3F46', padding: '10px 0', color: '#fafafa', outline: 'none', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fafafa', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                  ACCESS KEY [PASSWORD]
                </label>
                <a href="#" style={{ fontSize: '0.7rem', fontWeight: 800, color: '#dfe104', textTransform: 'uppercase', textDecoration: 'none' }}>
                  RESET
                </a>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '2px solid #3F3F46', padding: '10px 0', color: '#fafafa', outline: 'none', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}
              />
            </div>

            <button type="submit" disabled={loading} className="acid-btn" style={{ width: '100%', padding: '16px 0', fontSize: '1rem', marginTop: 12, justifyContent: 'center' }}>
              {loading ? 'AUTHENTICATING...' : 'ENTER SYSTEM →'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 24, fontSize: '0.75rem', color: '#a1a1aa', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
            NO CLEARANCE? <Link to="/register" style={{ color: '#fafafa', textDecoration: 'underline', fontWeight: 800, marginLeft: 6 }}>REQUEST ACCESS</Link>
          </div>
        </div>
      </div>

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
