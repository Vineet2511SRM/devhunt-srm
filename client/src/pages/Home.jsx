import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import HeartbeatECG from '../components/HeartbeatECG.jsx';
import { getProjects } from '../services/projectService.js';
import { FiCompass, FiZap, FiMessageSquare, FiTrendingUp } from 'react-icons/fi';
import '../styles/Home.css';

const Home = () => {
  const [trendingProjects, setTrendingProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'DEVHUNT SRM — PRECISION SHIPPING';
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    try {
      const { data } = await getProjects({ sort: 'trending', limit: 3 });
      setTrendingProjects(data.projects || []);
    } catch {
      setTrendingProjects([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="noise-overlay" />

      <div className="page" style={{ paddingTop: 0 }}>
        {/* ---- Kinetic Hero Section ---- */}
        <section className="hero-kinetic-bg text-center" style={{ paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-16)' }}>
          <div className="container">
            <h1 className="hero-kinetic-title animate-slide-up">
              WHERE CAMPUS DEVELOPERS <br />
              <span style={{ 
                color: 'var(--color-accent)', 
                textShadow: '0 0 25px rgba(223, 225, 4, 0.45), 0 0 50px rgba(223, 225, 4, 0.2)' 
              }}>
                SHIP &amp; SHINE
              </span>
            </h1>

            <p className="hero-description-kinetic animate-slide-up">
              THE PREMIER STUDENT ECOSYSTEM FOR BUILDING, LAUNCHING, AND ITERATING. JOIN TOP ENGINEERING TALENT TURNING LATE-NIGHT COMMITS INTO PRODUCTION-READY PRODUCTS.
            </p>

            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/explore" className="acid-btn">
                EXPLORE PROJECTS
              </Link>
              <Link to="/submit" className="acid-outline-btn">
                SUBMIT YOURS
              </Link>
            </div>
          </div>
        </section>

        {/* ---- Infinite Yellow Marquee Bar ---- */}
        <div className="marquee-container">
          <div className="marquee-content">
            SHIP &amp; SHINE // 150+ PROJECTS SHIPPED // 500+ REVIEWS // 200+ ACTIVE DEVS // SHIP &amp; SHINE // 150+ PROJECTS SHIPPED // 500+ REVIEWS // 200+ ACTIVE DEVS //
          </div>
        </div>

        {/* ---- Medical ECG Heart Monitor Pulse Line Banner ---- */}
        <div className="container" style={{ margin: '16px auto 32px' }}>
          <div className="brutal-border" style={{ padding: '12px 24px', background: '#09090b', boxShadow: '0 0 20px rgba(223, 225, 4, 0.15)' }}>
            <HeartbeatECG height={36} color="#dfe104" label="CAMPUS COMMITS PULSE: 78 BPM // ACTIVE" />
          </div>
        </div>

        {/* ---- Trending Projects Grid ---- */}
        <section className="container" style={{ margin: 'var(--space-12) auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-8)' }}>
            <div>
              <h2 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.04em' }}>
                TRENDING PROJECTS
              </h2>
              <p className="text-muted" style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 4 }}>
                THE MOST UPVOTED TOOLS ON CAMPUS THIS WEEK.
              </p>
            </div>
            <Link
              to="/explore"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                color: 'var(--color-accent)',
                textTransform: 'uppercase',
                borderBottom: '2px solid var(--color-accent)',
                paddingBottom: 2,
                fontSize: 'var(--font-size-xs)',
              }}
            >
              VIEW ALL →
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
              {[1, 2, 3].map((n) => (
                <div key={n} className="brutal-border skeleton" style={{ height: 320 }} />
              ))}
            </div>
          ) : trendingProjects.length === 0 ? (
            <div className="brutal-border text-center" style={{ padding: 'var(--space-12)', background: 'var(--color-bg-secondary)' }}>
              <p className="text-muted" style={{ textTransform: 'uppercase' }}>NO PROJECTS UPLOADED YET. BE THE FIRST TO SHIP!</p>
              <Link to="/submit" className="acid-btn" style={{ marginTop: 'var(--space-4)', display: 'inline-block', padding: '10px 20px' }}>
                SHIP PROJECT
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
              {trendingProjects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          )}
        </section>

        {/* ---- Product Launch Feature Banner ---- */}
        <section className="container" style={{ margin: '48px auto' }}>
          <div className="brutal-border" style={{ 
            position: 'relative', 
            overflow: 'hidden', 
            background: '#09090b', 
            minHeight: 280, 
            display: 'flex', 
            alignItems: 'center',
            boxShadow: '0 0 40px rgba(223, 225, 4, 0.25), inset 0 0 30px rgba(223, 225, 4, 0.1)'
          }}>
            <img 
              src="/launch-graphic.png" 
              alt="Launch Trajectory" 
              style={{ position: 'absolute', right: 0, top: 0, width: '50%', height: '100%', objectFit: 'cover', opacity: 0.6, pointerEvents: 'none' }} 
            />
            <div style={{ position: 'relative', zIndex: 2, padding: '48px 36px', maxWidth: '600px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 800, color: '#dfe104', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                // NEXT GEN LAUNCHPAD
              </span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, textTransform: 'uppercase', color: '#fafafa', margin: '12px 0' }}>
                READY TO SHIP YOUR PROJECT?
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#a1a1aa', textTransform: 'uppercase', marginBottom: 24, lineHeight: 1.5 }}>
                GET FEATURED ON THE SRM CAMPUS LEADERBOARD. COLLECT REAL USER REVIEWS, RECRUIT COLLABORATORS, AND LEVEL UP YOUR XP.
              </p>
              <Link to="/submit" className="acid-btn" style={{ height: 50, padding: '0 24px', fontSize: '0.85rem' }}>
                INITIALIZE LAUNCH →
              </Link>
            </div>
          </div>
        </section>

        {/* ---- The Shipping Pipeline ---- */}
        <section className="container">
          <div className="pipeline-section">
            <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '-0.04em' }}>
              THE SHIPPING PIPELINE
            </h2>

            <div className="pipeline-grid">
              <div className="pipeline-box">
                <div className="pipeline-icon-box animate-heartbeat">
                  <FiZap />
                </div>
                <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 800, textTransform: 'uppercase' }}>1. SHIP IT</h3>
                <p className="text-muted" style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase' }}>
                  LAUNCH YOUR MVP TO THE CAMPUS ECOSYSTEM WITH A SINGLE CLICK.
                </p>
              </div>

              <div className="pipeline-box">
                <div className="pipeline-icon-box">
                  <FiMessageSquare />
                </div>
                <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 800, textTransform: 'uppercase' }}>2. GET FEEDBACK</h3>
                <p className="text-muted" style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase' }}>
                  RECEIVE BRUTAL, ACTIONABLE CRITIQUE FROM FELLOW DEVELOPERS.
                </p>
              </div>

              <div className="pipeline-box">
                <div className="pipeline-icon-box">
                  <FiTrendingUp />
                </div>
                <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 800, textTransform: 'uppercase' }}>3. LEVEL UP</h3>
                <p className="text-muted" style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase' }}>
                  ITERATE RAPIDLY, GAIN TRACTION, AND BUILD YOUR ENGINEERING PORTFOLIO.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Home;
