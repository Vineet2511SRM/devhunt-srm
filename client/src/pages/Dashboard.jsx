import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import HeartbeatECG from '../components/HeartbeatECG.jsx';
import { getUserProfile, updateProfile } from '../services/userService.js';
import { deleteProject } from '../services/projectService.js';
import { getXPProgress, getInitials, timeAgo } from '../utils/helpers.js';
import { toast } from 'react-hot-toast';
import {
  FiPlus,
  FiTrash2,
  FiEye,
  FiZap,
  FiShield,
  FiAward,
  FiUsers,
  FiStar,
  FiCode,
  FiTrendingUp,
  FiGrid,
  FiBarChart2,
  FiLayers,
  FiTerminal,
  FiCheckCircle,
  FiSettings,
} from 'react-icons/fi';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user, logout, getMe } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [settingsForm, setSettingsForm] = useState({
    name: '',
    profession: '',
    skills: '',
    department: '',
    bio: '',
  });
  const [updatingProfile, setUpdatingProfile] = useState(false);

  useEffect(() => {
    document.title = `DEVHUNT SRM — ${activeTab}`;
    fetchDashboard();
  }, [activeTab]);

  useEffect(() => {
    if (user) {
      setSettingsForm({
        name: user.name || '',
        profession: user.profession || '',
        skills: Array.isArray(user.skills) ? user.skills.join(', ') : (user.skills || ''),
        department: user.department || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const fetchDashboard = async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const { data } = await getUserProfile(user._id);
      setProfileData(data);
    } catch {
      toast.error('FAILED TO LOAD DASHBOARD DATA');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      await updateProfile(settingsForm);
      toast.success('PROFILE UPDATED SUCCESSFULLY!');
      if (getMe) await getMe();
      fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || 'FAILED TO UPDATE PROFILE');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleDelete = async (projectId) => {
    if (window.confirm('ARE YOU SURE YOU WANT TO DELETE THIS PROJECT?')) {
      try {
        await deleteProject(projectId);
        toast.success('PROJECT REMOVED');
        fetchDashboard();
      } catch {
        toast.error('FAILED TO DELETE PROJECT');
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="page">
          <div className="container">
            <div className="brutal-border skeleton" style={{ height: 420 }} />
          </div>
        </div>
      </Layout>
    );
  }

  const { projects = [], reviewsCount = 0 } = profileData || {};
  const xpProgress = getXPProgress(user?.xp || 0);
  const totalUpvotesReceived = projects.reduce((acc, p) => acc + (p.upvoteCount || 0), 0);

  return (
    <Layout>
      <div className="dashboard-layout-kinetic">
        {/* ---- Left Sidebar (Matching Stitch Screenshot) ---- */}
        <aside className="dashboard-sidebar-kinetic">
          {/* User Profile Box */}
          <div className="sidebar-user-header">
            <div className="sidebar-avatar-box brutal-border">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                getInitials(user?.name)
              )}
            </div>

            <div className="sidebar-username">{user?.name}</div>
            <div className="sidebar-level-pill">
              LEVEL {user?.level || 1} / {user?.xp || 0} XP
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="sidebar-nav-list">
            <button
              className={`sidebar-tab-btn ${activeTab === 'DASHBOARD' ? 'active' : ''}`}
              onClick={() => setActiveTab('DASHBOARD')}
            >
              <FiGrid /> DASHBOARD
            </button>

            <button
              className={`sidebar-tab-btn ${activeTab === 'XP TRACKER' ? 'active' : ''}`}
              onClick={() => setActiveTab('XP TRACKER')}
            >
              <FiBarChart2 /> XP TRACKER
            </button>

            <button
              className={`sidebar-tab-btn ${activeTab === 'LEVELS' ? 'active' : ''}`}
              onClick={() => setActiveTab('LEVELS')}
            >
              <FiAward /> LEVELS
            </button>

            <button
              className={`sidebar-tab-btn ${activeTab === 'PROJECTS' ? 'active' : ''}`}
              onClick={() => setActiveTab('PROJECTS')}
            >
              <FiLayers /> PROJECTS
            </button>

            <button
              className={`sidebar-tab-btn ${activeTab === 'TERMINAL' ? 'active' : ''}`}
              onClick={() => setActiveTab('TERMINAL')}
            >
              <FiTerminal /> TERMINAL
            </button>

            <button
              className={`sidebar-tab-btn ${activeTab === 'SETTINGS' ? 'active' : ''}`}
              onClick={() => setActiveTab('SETTINGS')}
            >
              <FiSettings /> SETTINGS
            </button>
          </nav>

          {/* Sidebar Footer Controls (PUSH CODE, SETTINGS, LOGOUT - Matching Stitch Screenshot) */}
          <div style={{ marginTop: 'auto', paddingTop: 32, paddingLeft: 12, paddingRight: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Link to="/submit" className="acid-btn" style={{ height: 42, width: '100%', fontSize: '0.75rem', justifyContent: 'center' }}>
              <FiCode /> PUSH CODE
            </Link>

            <button onClick={() => setActiveTab('SETTINGS')} className="sidebar-tab-btn" style={{ padding: '8px 12px', fontSize: '0.75rem' }}>
              ⚙ PROFILE SETTINGS
            </button>

            <button onClick={logout} className="sidebar-tab-btn" style={{ padding: '8px 12px', fontSize: '0.75rem', color: '#ffb4ab' }}>
              ↳ LOGOUT
            </button>
          </div>
        </aside>

        {/* ---- Main Dashboard Content ---- */}
        <main className="dashboard-content-kinetic">
          {/* Header Title & + NEW PROJECT Button (Matching Stitch Screenshot) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20, marginBottom: 32 }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: '#dfe104', textTransform: 'uppercase', letterSpacing: '-0.04em', lineHeight: 0.9, marginBottom: 8 }}>
                WELCOME BACK, {user?.name?.toUpperCase()}!
              </h1>
              <p style={{ fontSize: '0.85rem', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                READY TO BUILD SOMETHING AMAZING TODAY?
              </p>
            </div>

            <Link to="/submit" className="acid-btn" style={{ height: 48, padding: '0 24px', fontSize: '0.85rem' }}>
              <FiPlus /> NEW PROJECT
            </Link>
          </div>

          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'DASHBOARD' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {/* Dynamic Activity Heartbeat Pulse Monitor Line */}
              <div className="brutal-border" style={{ padding: '12px 20px', background: '#09090b', boxShadow: '0 0 20px rgba(223, 225, 4, 0.15)' }}>
                <HeartbeatECG
                  height={32}
                  projectsCount={projects.length}
                  reviewsCount={reviewsCount}
                  upvotesCount={totalUpvotesReceived}
                />
              </div>

              {/* Level & XP Tracker Banner Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
                {/* XP Tracker Level Progress Box */}
                <div className="xp-tracker-box" style={{ position: 'relative', overflow: 'hidden' }}>
                  <img src="/tech-node.png" alt="Tech Node" style={{ position: 'absolute', right: -10, bottom: -10, width: 90, height: 90, opacity: 0.25, pointerEvents: 'none' }} />
                  <div className="xp-tracker-header">
                    <div className="xp-level-title">LEVEL {user?.level || 1}</div>
                    <div className="xp-fraction">
                      {user?.xp || 0} / {xpProgress.nextLevelXP} XP
                    </div>
                  </div>

                  <div className="xp-progress-bar-container">
                    <div className="xp-progress-fill" style={{ width: `${Math.max(10, xpProgress.progressPercent)}%` }} />
                  </div>

                  <div className="xp-subtext">
                    {xpProgress.nextLevelXP - (user?.xp || 0)} XP TO NEXT LEVEL... KEEP SHIPPING!
                  </div>
                </div>

                {/* Stat Boxes */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="dashboard-stat-box">
                    <FiZap style={{ fontSize: '2.2rem', color: '#dfe104', marginBottom: 6 }} />
                    <div className="dashboard-stat-number">{projects.length}</div>
                    <div className="dashboard-stat-label">ACTIVE PROJECTS</div>
                  </div>

                  <div className="dashboard-stat-box">
                    <FiStar style={{ fontSize: '2.2rem', color: '#fafafa', marginBottom: 6 }} />
                    <div className="dashboard-stat-number">{totalUpvotesReceived}</div>
                    <div className="dashboard-stat-label">REVIEWS &amp; UPVOTES</div>
                  </div>
                </div>
              </div>

              {/* Main Content 2-Column Layout */}
              <div className="dashboard-main-grid" style={{ marginTop: 0 }}>
                {/* My Projects */}
                <div className="dashboard-section-box">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h2 className="dashboard-section-title" style={{ border: 'none', marginBottom: 0, paddingBottom: 0 }}>
                      MY PROJECTS
                    </h2>
                    <Link to="/explore" style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 800, color: '#dfe104', textTransform: 'uppercase', textDecoration: 'underline' }}>
                      VIEW ALL
                    </Link>
                  </div>

                  {projects.length === 0 ? (
                    <div className="brutal-border text-center" style={{ padding: 48, background: '#131315' }}>
                      <p style={{ color: '#a1a1aa', textTransform: 'uppercase', marginBottom: 16 }}>NO PROJECTS SHIPPED YET.</p>
                      <Link to="/submit" className="acid-btn" style={{ padding: '12px 24px' }}>
                        SHIP YOUR FIRST PROJECT
                      </Link>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {projects.map((project) => (
                        <div key={project._id} className="dashboard-project-row">
                          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div className="brutal-border" style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#09090b', color: '#dfe104', fontSize: '1.25rem' }}>
                              <FiCode />
                            </div>
                            <div>
                              <Link to={`/projects/${project._id}`} style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase', color: '#fafafa', textDecoration: 'none' }}>
                                {project.title}
                              </Link>
                              <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                                {project.techStack?.slice(0, 2).map((tech, idx) => (
                                  <span key={idx} className="brutal-border" style={{ fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#dfe104', fontWeight: 800, fontSize: '1.1rem' }}>
                              <FiStar />
                              <span>{project.avgRating ? project.avgRating.toFixed(1) : 'NEW'}</span>
                            </div>

                            <Link to={`/projects/${project._id}`} className="brutal-border" style={{ padding: '8px 12px', background: '#09090b', color: '#fafafa', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 700 }}>
                              <FiEye />
                            </Link>
                            <button onClick={() => handleDelete(project._id)} className="brutal-border" style={{ padding: '8px 12px', background: '#09090b', color: '#ffb4ab', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}>
                              <FiTrash2 />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Achievements Badges */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div className="dashboard-section-box">
                    <h2 className="dashboard-section-title">ACHIEVEMENTS</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div className="brutal-border" style={{ padding: 12, textAlign: 'center', background: '#dfe104', color: '#09090b' }}>
                        <FiZap style={{ fontSize: '1.75rem', marginBottom: 4 }} />
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>HOT STREAK</div>
                      </div>

                      <div className="brutal-border" style={{ padding: 12, textAlign: 'center', background: '#131315', color: '#fafafa' }}>
                        <FiShield style={{ fontSize: '1.75rem', marginBottom: 4, color: '#dfe104' }} />
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>SQUASHER</div>
                      </div>

                      <div className="brutal-border" style={{ padding: 12, textAlign: 'center', background: '#131315', color: '#71717a', opacity: 0.5 }}>
                        <FiAward style={{ fontSize: '1.75rem', marginBottom: 4 }} />
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>CHAMPION</div>
                      </div>

                      <div className="brutal-border" style={{ padding: 12, textAlign: 'center', background: '#131315', color: '#71717a', opacity: 0.5 }}>
                        <FiUsers style={{ fontSize: '1.75rem', marginBottom: 4 }} />
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>SOCIALITE</div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity Timeline */}
                  <div className="dashboard-section-box">
                    <h2 className="dashboard-section-title">RECENT ACTIVITY</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div className="activity-item">
                        <div className="activity-title">SYSTEM STATUS OPTIMAL</div>
                        <div className="activity-time">CONNECTED TO DEVHUNT SRM</div>
                      </div>
                      {projects.slice(0, 2).map((p) => (
                        <div key={p._id} className="activity-item">
                          <div className="activity-title">PROJECT SHIPPED: {p.title.toUpperCase()}</div>
                          <div className="activity-time">{p.createdAt ? timeAgo(p.createdAt) : 'RECENTLY'}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: XP TRACKER BREAKDOWN */}
          {activeTab === 'XP TRACKER' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              <div className="xp-tracker-box">
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: '#dfe104', textTransform: 'uppercase', marginBottom: 8 }}>
                  BUILDER XP MECHANICS
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#a1a1aa', textTransform: 'uppercase', marginBottom: 24 }}>
                  EARN EXPERTISE POINTS (XP) TO LEVEL UP YOUR CAMPUS ENGINEERING RANKING.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div className="xp-rule-card">
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase', color: '#fafafa' }}>
                        1. SHIP A NEW CAMPUS PROJECT
                      </h3>
                      <p style={{ fontSize: '0.75rem', color: '#a1a1aa', textTransform: 'uppercase' }}>
                        LAUNCH AN MVP OR OPEN-SOURCE TOOL TO THE ECOSYSTEM.
                      </p>
                    </div>
                    <div className="xp-rule-points">+10 XP</div>
                  </div>

                  <div className="xp-rule-card">
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase', color: '#fafafa' }}>
                        2. WRITE A STRUCTURED PEER REVIEW
                      </h3>
                      <p style={{ fontSize: '0.75rem', color: '#a1a1aa', textTransform: 'uppercase' }}>
                        PROVIDE CONSTRUCTIVE CRITIQUE &amp; FEATURE FEEDBACK ON FELLOW PROJECTS.
                      </p>
                    </div>
                    <div className="xp-rule-points">+5 XP</div>
                  </div>

                  <div className="xp-rule-card">
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase', color: '#fafafa' }}>
                        3. RECEIVE AN UPVOTE
                      </h3>
                      <p style={{ fontSize: '0.75rem', color: '#a1a1aa', textTransform: 'uppercase' }}>
                        GET COMMUNITY UPVOTES ON YOUR SHIPPED PROJECTS.
                      </p>
                    </div>
                    <div className="xp-rule-points">+2 XP</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LEVELS TIER SYSTEM */}
          {activeTab === 'LEVELS' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div className="dashboard-section-box">
                <h2 className="dashboard-section-title">CAMPUS BUILDER LEVELS</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {[
                    { lvl: 1, title: 'NOVICE BUILDER', xp: '0 - 499 XP' },
                    { lvl: 2, title: 'CAMPUS DEV', xp: '500 - 1,499 XP' },
                    { lvl: 3, title: 'CODE NINJA', xp: '1,500 - 2,999 XP' },
                    { lvl: 4, title: 'SHIP MASTER', xp: '3,000 - 4,999 XP' },
                    { lvl: 5, title: 'CAMPUS LEGEND', xp: '5,000+ XP' },
                  ].map((tier) => (
                    <div
                      key={tier.lvl}
                      className="brutal-border"
                      style={{
                        padding: '16px 24px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: (user?.level || 1) === tier.lvl ? '#dfe104' : '#131315',
                        color: (user?.level || 1) === tier.lvl ? '#09090b' : '#fafafa',
                      }}
                    >
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', textTransform: 'uppercase' }}>
                        LEVEL {tier.lvl}: {tier.title}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '0.9rem' }}>
                        {tier.xp}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PROJECTS */}
          {activeTab === 'PROJECTS' && (
            <div className="dashboard-section-box">
              <h2 className="dashboard-section-title">ALL SHIPPED PROJECTS ({projects.length})</h2>
              {projects.map((project) => (
                <div key={project._id} className="dashboard-project-row">
                  <div>
                    <Link to={`/projects/${project._id}`} style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase', color: '#fafafa', textDecoration: 'none' }}>
                      {project.title}
                    </Link>
                    <p style={{ fontSize: '0.75rem', color: '#a1a1aa', textTransform: 'uppercase', marginTop: 2 }}>
                      {project.category} • {project.upvoteCount || 0} UPVOTES
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <Link to={`/projects/${project._id}`} className="brutal-border" style={{ padding: '8px 12px', background: '#09090b', color: '#fafafa', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 700 }}>
                      <FiEye /> VIEW
                    </Link>
                    <button onClick={() => handleDelete(project._id)} className="brutal-border" style={{ padding: '8px 12px', background: '#09090b', color: '#ffb4ab', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}>
                      <FiTrash2 /> DELETE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === 'SETTINGS' && (
            <div className="dashboard-section-box" style={{ background: '#09090b' }}>
              <h2 className="dashboard-section-title">PROFILE &amp; DEVELOPER CREDENTIALS SETTINGS</h2>
              <form onSubmit={handleUpdateSettings} style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 640 }}>
                <div>
                  <label style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#fafafa', display: 'block', marginBottom: 6 }}>
                    FULL NAME *
                  </label>
                  <input
                    type="text"
                    className="kinetic-input"
                    value={settingsForm.name}
                    onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#fafafa', display: 'block', marginBottom: 6 }}>
                    PROFESSION / ROLE (DISPLAYED ON PROFILE)
                  </label>
                  <input
                    type="text"
                    className="kinetic-input"
                    placeholder="E.G. FRONTEND DEVELOPER, AI RESEARCHER, UI DESIGNER"
                    value={settingsForm.profession}
                    onChange={(e) => setSettingsForm({ ...settingsForm, profession: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#fafafa', display: 'block', marginBottom: 6 }}>
                    SKILLS (COMMA SEPARATED)
                  </label>
                  <input
                    type="text"
                    className="kinetic-input"
                    placeholder="E.G. REACT, NODE.JS, PYTHON, MONGO DB"
                    value={settingsForm.skills}
                    onChange={(e) => setSettingsForm({ ...settingsForm, skills: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#fafafa', display: 'block', marginBottom: 6 }}>
                    DEPARTMENT / BRANCH
                  </label>
                  <input
                    type="text"
                    className="kinetic-input"
                    placeholder="E.G. COMPUTER SCIENCE & ENGINEERING"
                    value={settingsForm.department}
                    onChange={(e) => setSettingsForm({ ...settingsForm, department: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#fafafa', display: 'block', marginBottom: 6 }}>
                    SHORT BIO
                  </label>
                  <textarea
                    className="kinetic-input"
                    rows={3}
                    placeholder="TELL THE COMMUNITY ABOUT YOUR DOMAIN & WHAT YOU ARE BUILDING..."
                    value={settingsForm.bio}
                    onChange={(e) => setSettingsForm({ ...settingsForm, bio: e.target.value })}
                  />
                </div>

                <button type="submit" disabled={updatingProfile} className="acid-btn" style={{ alignSelf: 'flex-start', padding: '12px 24px' }}>
                  {updatingProfile ? 'SAVING...' : 'UPDATE PROFILE'}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* Stitch Dashboard Bottom Bar (Matching Screenshot) */}
      <div style={{ borderTop: '2px solid #3F3F46', background: '#09090b', padding: '12px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#a1a1aa', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
        <div>© DEVHUNT SRM // NO REST FOR THE WICKED</div>
        <div style={{ display: 'flex', gap: 20 }}>
          <span style={{ color: '#dfe104', fontWeight: 800 }}>STATUS: OPERATIONAL</span>
          <Link to="/explore" style={{ color: '#a1a1aa', textDecoration: 'none' }}>API_DOCS</Link>
          <a href="https://github.com" target="_blank" rel="noreferrer" style={{ color: '#a1a1aa', textDecoration: 'none' }}>GH_REPO</a>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
