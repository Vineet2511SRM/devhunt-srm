import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { toast } from 'react-hot-toast';
import { FiArrowRight } from 'react-icons/fi';
import '../styles/Auth.css';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    profession: '',
    skills: '',
    department: 'Computer Science & Engineering',
    yearOfStudy: 2,
  });

  const [loading, setLoading] = useState(false);
  const googleBtnRef = useRef(null);
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

  // Handle Google credential response
  const handleGoogleResponse = useCallback(async (response) => {
    try {
      await googleLogin(response.credential);
      toast.success('ACCOUNT INITIALIZED VIA GOOGLE! WELCOME TO THE TRIBE 🚀');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'GOOGLE AUTH FAILED');
    }
  }, [googleLogin, navigate]);

  // Load Google Identity Services & render button
  useEffect(() => {
    document.title = 'JOIN THE TRIBE — DEVHUNT SRM';

    window.__devhunt_google_cb_register = handleGoogleResponse;

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google && googleBtnRef.current) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: window.__devhunt_google_cb_register,
        });
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'filled_black',
          size: 'large',
          width: googleBtnRef.current.offsetWidth,
          text: 'signup_with',
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      return toast.error('PLEASE FILL IN ALL REQUIRED FIELDS');
    }

    if (formData.password !== formData.confirmPassword) {
      return toast.error('PASSWORDS DO NOT MATCH');
    }

    if (formData.password.length < 6) {
      return toast.error('PASSWORD MUST BE AT LEAST 6 CHARACTERS');
    }

    setLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        profession: formData.profession,
        skills: formData.skills,
        department: formData.department,
        yearOfStudy: Number(formData.yearOfStudy),
      });

      toast.success('ACCOUNT INITIALIZED! WELCOME TO THE TRIBE 🚀');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'REGISTRATION FAILED');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-kinetic">
      {/* Top Branding Bar */}
      <header style={{ borderBottom: '2px solid #3F3F46', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#09090b' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: '#dfe104', textTransform: 'uppercase', letterSpacing: '-0.04em' }}>
          DEVHUNT SRM
        </div>
        <Link to="/" style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 700, color: '#fafafa', textTransform: 'uppercase', textDecoration: 'none' }}>
          ✕ CANCEL
        </Link>
      </header>

      {/* Marquee Banner */}
      <div className="marquee-container" style={{ margin: 0 }}>
        <div className="marquee-content" style={{ fontSize: '1.25rem' }}>
          SHIP // SHINE // REPEAT // SHIP // SHINE // REPEAT // SHIP // SHINE // REPEAT // SHIP // SHINE // REPEAT // SHIP // SHINE // REPEAT //
        </div>
      </div>

      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Massive Stroke Hero Title */}
        <div style={{ borderBottom: '2px solid #3F3F46', padding: '48px 16px', display: 'flex', justifyContent: 'center', background: '#09090b', overflow: 'hidden' }}>
          <h1 className="kinetic-stroke-title">
            JOIN THE TRIBE
          </h1>
        </div>

        {/* 2-Column Form Grid */}
        <div className="tribe-grid">
          {/* Sidebar */}
          <div className="tribe-sidebar">
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: '#dfe104', textTransform: 'uppercase', marginBottom: 8 }}>
                INITIALIZE
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#a1a1aa', textTransform: 'uppercase' }}>
                ENTER THE ARENA. CONNECT YOUR NODES. SHIP FASTER.
              </p>
            </div>

            <div style={{ marginTop: 32 }}>
              <div style={{ border: '2px solid #3F3F46', padding: 16, background: '#09090b' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 800, color: '#dfe104', display: 'block', marginBottom: 4 }}>
                  STATUS
                </span>
                <span style={{ fontSize: '0.75rem', color: '#fafafa', fontFamily: 'var(--font-mono)' }}>
                  SYSTEM READY FOR INPUT
                </span>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="tribe-form-container">
            {/* Google Sign-Up Button (rendered by Google SDK) */}
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
                OR CREATE MANUALLY
              </span>
              <div style={{ flex: 1, height: 1, background: '#3F3F46' }} />
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Step 01: Identity */}
              <div className="step-box">
                <div className="step-badge">01. IDENTITY</div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#fafafa', display: 'block', marginBottom: 6 }}>
                      FULL NAME *
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="kinetic-input"
                      placeholder="JOHN DOE"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#fafafa', display: 'block', marginBottom: 6 }}>
                      EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="kinetic-input"
                      placeholder="USER@EMAIL.COM"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#fafafa', display: 'block', marginBottom: 6 }}>
                      PROFESSION / ROLE
                    </label>
                    <input
                      type="text"
                      name="profession"
                      className="kinetic-input"
                      placeholder="E.G. FRONTEND ENGINEER, AI DEVELOPER, DESIGNER"
                      value={formData.profession}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#fafafa', display: 'block', marginBottom: 6 }}>
                      SKILLS (COMMA SEPARATED)
                    </label>
                    <input
                      type="text"
                      name="skills"
                      className="kinetic-input"
                      placeholder="E.G. REACT, NODE.JS, PYTHON, FIGMA"
                      value={formData.skills}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#fafafa', display: 'block', marginBottom: 6 }}>
                      DEPARTMENT
                    </label>
                    <input
                      type="text"
                      name="department"
                      className="kinetic-input"
                      placeholder="COMPUTER SCIENCE & ENGINEERING"
                      value={formData.department}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Step 02: Access */}
              <div className="step-box">
                <div className="step-badge">02. ACCESS</div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                  <div>
                    <label style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#fafafa', display: 'block', marginBottom: 6 }}>
                      PASSWORD *
                    </label>
                    <input
                      type="password"
                      name="password"
                      className="kinetic-input"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#fafafa', display: 'block', marginBottom: 6 }}>
                      CONFIRM PASSWORD *
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="kinetic-input"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Step 03: Action */}
              <div>
                <button type="submit" disabled={loading} className="kinetic-button">
                  {loading ? 'INITIALIZING...' : 'CREATE ACCOUNT'}
                  <FiArrowRight />
                </button>

                <div style={{ marginTop: 16, textAlign: 'center', fontSize: '0.75rem', color: '#a1a1aa', textTransform: 'uppercase' }}>
                  ALREADY HAVE AN ACCOUNT?{' '}
                  <Link to="/login" style={{ color: '#dfe104', fontWeight: 700, textDecoration: 'underline' }}>
                    LOG IN HERE
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '2px solid #3F3F46', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#09090b', fontSize: '0.75rem', color: '#a1a1aa', textTransform: 'uppercase' }}>
        <div>© 2026 DEVHUNT SRM. BUILT FOR CAMPUS EXCELLENCE.</div>
        <div style={{ display: 'flex', gap: 16, fontWeight: 700, color: '#fafafa' }}>
          <Link to="/explore" style={{ color: '#fafafa', textDecoration: 'none' }}>TERMS</Link>
          <Link to="/explore" style={{ color: '#fafafa', textDecoration: 'none' }}>PRIVACY</Link>
        </div>
      </footer>
    </div>
  );
};

export default Register;
