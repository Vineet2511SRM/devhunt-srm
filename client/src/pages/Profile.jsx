import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import HeartbeatECG from '../components/HeartbeatECG.jsx';
import { getUserProfile } from '../services/userService.js';
import { getInitials } from '../utils/helpers.js';
import { FiExternalLink, FiLock, FiZap } from 'react-icons/fi';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const targetId = id || currentUser?._id;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (targetId) {
      fetchProfile(targetId);
    } else {
      setLoading(false);
    }
  }, [targetId]);

  const fetchProfile = async (profileId) => {
    setLoading(true);
    try {
      const { data } = await getUserProfile(profileId);
      setProfile(data);
      if (data.user?.name) {
        document.title = `DEVHUNT SRM — ${data.user.name.toUpperCase()}`;
      }
    } catch {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="page">
          <div className="container">
            <div className="brutal-border skeleton" style={{ height: 350 }} />
          </div>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="page text-center" style={{ paddingTop: 80 }}>
          <h2 style={{ textTransform: 'uppercase' }}>USER NOT FOUND</h2>
          <Link to="/" className="acid-btn" style={{ marginTop: 20, display: 'inline-block' }}>
            RETURN HOME
          </Link>
        </div>
      </Layout>
    );
  }

  const { user, projects = [], reviewsCount = 0 } = profile;

  return (
    <Layout>
      <div className="page" style={{ paddingTop: 0 }}>
        {/* Kinetic Hero Profile Header (Exact Replica of Stitch Screenshot) */}
        <div style={{ borderBottom: '2px solid #3F3F46', background: '#09090b', padding: '64px 0', position: 'relative', overflow: 'hidden' }}>
          {/* Repeating Diagonal Linear Pattern Background */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.1,
              pointerEvents: 'none',
              backgroundImage: 'repeating-linear-gradient(45deg, #3F3F46 0, #3F3F46 2px, transparent 2px, transparent 10px)',
            }}
          />

          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 32, position: 'relative', zIndex: 10 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                <div style={{ width: 64, height: 64, border: '2px solid #3F3F46', background: '#09090b', boxShadow: '0 0 20px rgba(223, 225, 4, 0.3)' }}>
                  <img src="/tech-node.png" alt="Tech Node" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 800, color: '#dfe104', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  // PUBLIC DEVELOPER PROFILE
                </span>
              </div>
              {/* Giant Name Headline in Volt Yellow */}
              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(3.5rem, 11vw, 9rem)',
                  fontWeight: 800,
                  color: '#dfe104',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.05em',
                  lineHeight: 0.85,
                  margin: 0,
                  textShadow: '0 0 30px rgba(223, 225, 4, 0.5), 0 0 60px rgba(223, 225, 4, 0.25)',
                }}
              >
                {user.name?.split(' ')[0]}
                {user.name?.split(' ')[1] && <br />}
                {user.name?.split(' ')[1] || ''}
              </h1>

              {/* Badges & Dynamic Heartbeat Below Name */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 20, maxWidth: 480 }}>
                <HeartbeatECG
                  height={32}
                  projectsCount={projects.length}
                  reviewsCount={reviewsCount}
                  level={user?.level || 1}
                />
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span
                    className="brutal-border"
                    style={{
                      background: '#09090b',
                      color: '#fafafa',
                      padding: '6px 14px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {user.profession || user.department || 'DEVELOPER'}
                  </span>
                  <span
                    className="brutal-border"
                    style={{
                      background: '#dfe104',
                      color: '#09090b',
                      borderColor: '#dfe104',
                      padding: '6px 14px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    AVAILABLE
                  </span>
                </div>

                {user.skills && user.skills.length > 0 && (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                    {user.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="brutal-border"
                        style={{
                          background: '#131315',
                          color: '#dfe104',
                          padding: '4px 10px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        ⚡ {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Level & XP Box Stat Cards (Matching Stitch Screenshot) */}
            <div style={{ display: 'flex', gap: 20 }}>
              <div
                className="brutal-border hover-invert"
                style={{
                  width: 128,
                  height: 128,
                  background: '#09090b',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 16,
                }}
              >
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#a1a1aa', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>
                  LEVEL
                </span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 800, color: '#dfe104', lineHeight: 1 }}>
                  {user.level || 1}
                </span>
              </div>

              <div
                className="brutal-border hover-invert"
                style={{
                  width: 128,
                  height: 128,
                  background: '#09090b',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 16,
                }}
              >
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#a1a1aa', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>
                  XP
                </span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 800, color: '#dfe104', lineHeight: 1 }}>
                  {user.xp >= 1000 ? `${(user.xp / 1000).toFixed(1)}K` : user.xp || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Deployed Assets (Projects Grid matching Stitch Screenshot) */}
        <div className="container" style={{ paddingTop: 48, paddingBottom: 64 }}>
          <div style={{ marginBottom: 24, borderBottom: '2px solid #3F3F46', paddingBottom: 12 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.04em' }}>
              DEPLOYED ASSETS
            </h2>
          </div>

          {projects.length === 0 ? (
            <div className="brutal-border text-center" style={{ padding: 48, background: '#131315' }}>
              <p style={{ color: '#a1a1aa', textTransform: 'uppercase' }}>NO DEPLOYED ASSETS YET.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          )}
        </div>

        {/* Review Marquee Banner (Matching Stitch Screenshot) */}
        <div className="marquee-container" style={{ height: 48, display: 'flex', alignItems: 'center', background: '#131315', borderTop: '2px solid #3F3F46', borderBottom: '2px solid #3F3F46' }}>
          <div className="marquee-content" style={{ fontSize: '0.8rem', color: '#fafafa', fontFamily: 'var(--font-mono)' }}>
            <span style={{ color: '#dfe104' }}>"{user.name?.toUpperCase()} SHIPPED PROJECTS 3 WEEKS EARLY." - SR. ENG, DEVHUNT</span>
            {'  ⚡  '}
            <span>"BRUTALLY EFFICIENT CODE." - TECH LEAD</span>
            {'  ⚡  '}
            <span style={{ color: '#dfe104' }}>"REFACTORED THE ENTIRE BACKEND OVER A WEEKEND." - CTO</span>
            {'  ⚡  '}
            <span style={{ color: '#dfe104' }}>"{user.name?.toUpperCase()} SHIPPED PROJECTS 3 WEEKS EARLY." - SR. ENG, DEVHUNT</span>
            {'  ⚡  '}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
