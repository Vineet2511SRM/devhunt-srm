import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout.jsx';
import MetaTags from '../components/MetaTags.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { SkeletonBlock } from '../components/Skeleton.jsx';
import {
  getAdminStats,
  getAdminUsers,
  updateUserRole,
  deleteUserAdmin,
  deleteProjectAdmin,
} from '../services/adminService.js';
import { testSmtpApi } from '../services/authService.js';
import { toast } from 'react-hot-toast';
import {
  FiUsers,
  FiBox,
  FiMessageSquare,
  FiHeart,
  FiShield,
  FiTrash2,
  FiSearch,
  FiUserCheck,
  FiUserX,
  FiRefreshCw,
  FiMail,
} from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [smtpResult, setSmtpResult] = useState(null);
  const [loadingSmtp, setLoadingSmtp] = useState(false);

  const handleTestSmtpAdmin = async () => {
    setLoadingSmtp(true);
    try {
      const { data } = await testSmtpApi();
      setSmtpResult(data.status);
      toast.success(data.status?.connected ? 'SMTP TRANSPORT VERIFIED ONLINE' : 'SMTP RUNNING IN MOCK CONSOLE MODE');
    } catch (err) {
      toast.error('SMTP TEST FAILED');
    } finally {
      setLoadingSmtp(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'USERS') {
      fetchUsers();
    }
  }, [activeTab, search, roleFilter, page]);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const { data } = await getAdminStats();
      setStats(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load admin stats');
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data } = await getAdminUsers({
        page,
        limit: 10,
        search,
        role: roleFilter,
      });
      setUsers(data.users || []);
      setTotalPages(data.pages || 1);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch user list');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleRoleToggle = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    try {
      await updateUserRole(user._id, newRole);
      toast.success(`Role for ${user.name} updated to ${newRole.toUpperCase()}`);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    }
  };

  const handleDeleteUser = async (user) => {
    if (
      window.confirm(
        `Are you sure you want to delete user "${user.name}"? This action is IRREVERSIBLE and will delete all their projects and reviews!`
      )
    ) {
      try {
        await deleteUserAdmin(user._id);
        toast.success(`User ${user.name} deleted successfully`);
        fetchUsers();
        fetchStats();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const handleDeleteProject = async (projectId, title) => {
    if (window.confirm(`Delete project "${title}" as Admin?`)) {
      try {
        await deleteProjectAdmin(projectId);
        toast.success(`Project "${title}" deleted`);
        fetchStats();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete project');
      }
    }
  };

  return (
    <Layout>
      <MetaTags title="Admin Panel — DevHunt SRM" description="DevHunt SRM Platform Management and Moderation Console." />
      <div className="page" style={{ paddingTop: 0, paddingBottom: 64 }}>
        {/* Header Hero Section */}
        <div style={{ backgroundColor: '#09090b', borderBottom: '2px solid #3F3F46', padding: '36px 0', marginBottom: 32 }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#dfe104', fontSize: '0.8rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                <FiShield /> SECURE ADMIN CONSOLE
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, color: '#fafafa', margin: '4px 0', textTransform: 'uppercase' }}>
                ADMIN CONTROL PANEL
              </h1>
              <p style={{ fontSize: '0.85rem', color: '#a1a1aa', textTransform: 'uppercase' }}>
                Manage campus developers, moderate projects, and monitor platform health.
              </p>
            </div>

            <button
              onClick={() => {
                fetchStats();
                if (activeTab === 'USERS') fetchUsers();
              }}
              className="brutal-border"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 20px',
                backgroundColor: 'transparent',
                color: '#fafafa',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <FiRefreshCw /> REFRESH DATA
            </button>
          </div>
        </div>

        <div className="container">
          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 32, borderBottom: '2px solid #3F3F46', paddingBottom: 16 }}>
            {['OVERVIEW', 'USERS', 'SMTP RELAY'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="brutal-border"
                style={{
                  padding: '10px 24px',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  backgroundColor: activeTab === tab ? '#dfe104' : 'transparent',
                  color: activeTab === tab ? '#09090b' : '#fafafa',
                  borderColor: activeTab === tab ? '#dfe104' : '#3F3F46',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab 1: OVERVIEW & STATS */}
          {activeTab === 'OVERVIEW' && (
            <div>
              {/* Stats Metric Cards */}
              {loadingStats ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 40 }}>
                  {[1, 2, 3, 4].map((n) => (
                    <SkeletonBlock key={n} height="120px" />
                  ))}
                </div>
              ) : stats ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 40 }}>
                  {/* Card 1: Users */}
                  <div className="brutal-border" style={{ backgroundColor: '#09090b', padding: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#a1a1aa', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                        TOTAL USERS
                      </span>
                      <FiUsers style={{ color: '#dfe104', fontSize: '1.25rem' }} />
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: '#fafafa' }}>
                      {stats.overview.totalUsers}
                    </div>
                  </div>

                  {/* Card 2: Projects */}
                  <div className="brutal-border" style={{ backgroundColor: '#09090b', padding: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#a1a1aa', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                        TOTAL PROJECTS
                      </span>
                      <FiBox style={{ color: '#3b82f6', fontSize: '1.25rem' }} />
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: '#fafafa' }}>
                      {stats.overview.totalProjects}
                    </div>
                  </div>

                  {/* Card 3: Reviews */}
                  <div className="brutal-border" style={{ backgroundColor: '#09090b', padding: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#a1a1aa', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                        TOTAL REVIEWS
                      </span>
                      <FiMessageSquare style={{ color: '#10b981', fontSize: '1.25rem' }} />
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: '#fafafa' }}>
                      {stats.overview.totalReviews}
                    </div>
                  </div>

                  {/* Card 4: Upvotes */}
                  <div className="brutal-border" style={{ backgroundColor: '#09090b', padding: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#a1a1aa', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                        TOTAL UPVOTES
                      </span>
                      <FiHeart style={{ color: '#ef4444', fontSize: '1.25rem' }} />
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: '#fafafa' }}>
                      {stats.overview.totalUpvotes}
                    </div>
                  </div>
                </div>
              ) : null}

              {/* 2-Column Overview Tables: Recent Projects & Category Breakdown */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
                {/* Recent Projects Moderate Table */}
                <div className="brutal-border" style={{ backgroundColor: '#09090b', padding: 24 }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase', color: '#dfe104', marginBottom: 16 }}>
                    RECENT PROJECT SUBMISSIONS
                  </h3>
                  {stats?.recentProjects?.length === 0 ? (
                    <p style={{ color: '#a1a1aa', fontSize: '0.85rem' }}>No recent projects.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {stats?.recentProjects?.map((proj) => (
                        <div
                          key={proj._id}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '12px 16px',
                            backgroundColor: '#161b22',
                            border: '1px solid #30363d',
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fafafa' }}>{proj.title}</div>
                            <div style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>
                              By {proj.owner?.name || 'Unknown'} • Category: {proj.category || 'General'}
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteProject(proj._id, proj.title)}
                            style={{
                              backgroundColor: 'rgba(239, 68, 68, 0.15)',
                              color: '#ef4444',
                              border: '1px solid #ef4444',
                              padding: '6px 12px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Category Breakdown */}
                <div className="brutal-border" style={{ backgroundColor: '#09090b', padding: 24 }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase', color: '#dfe104', marginBottom: 16 }}>
                    PROJECTS BY CATEGORY
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {stats?.categoryBreakdown?.map((cat) => (
                      <div
                        key={cat._id || 'Uncategorized'}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '10px 16px',
                          backgroundColor: '#161b22',
                          border: '1px solid #30363d',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.85rem',
                        }}
                      >
                        <span style={{ color: '#fafafa', fontWeight: 700 }}>{cat._id || 'UNCATEGORIZED'}</span>
                        <span style={{ color: '#dfe104', fontWeight: 800 }}>{cat.count} PROJECTS</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: USER MANAGEMENT */}
          {activeTab === 'USERS' && (
            <div>
              {/* Search and Role Filter Bar */}
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
                <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
                  <FiSearch style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#a1a1aa' }} />
                  <input
                    type="text"
                    placeholder="Search users by name, email, department..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 16px 12px 44px',
                      backgroundColor: '#09090b',
                      border: '1px solid #3F3F46',
                      color: '#fafafa',
                      outline: 'none',
                    }}
                  />
                </div>

                <select
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value);
                    setPage(1);
                  }}
                  className="brutal-border"
                  style={{
                    backgroundColor: '#09090b',
                    color: '#fafafa',
                    padding: '0 20px',
                    fontWeight: 700,
                    outline: 'none',
                  }}
                >
                  <option value="">ALL ROLES</option>
                  <option value="user">USER</option>
                  <option value="admin">ADMIN</option>
                </select>
              </div>

              {/* Users Table */}
              {loadingUsers ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <SkeletonBlock key={n} height="60px" />
                  ))}
                </div>
              ) : users.length === 0 ? (
                <EmptyState title="No users found" description="No user accounts matched your search criteria." />
              ) : (
                <div className="brutal-border" style={{ overflowX: 'auto', backgroundColor: '#09090b' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#161b22', borderBottom: '2px solid #3F3F46', fontFamily: 'var(--font-mono)', color: '#dfe104' }}>
                        <th style={{ padding: '14px 16px' }}>USER</th>
                        <th style={{ padding: '14px 16px' }}>EMAIL</th>
                        <th style={{ padding: '14px 16px' }}>DEPARTMENT</th>
                        <th style={{ padding: '14px 16px' }}>ROLE</th>
                        <th style={{ padding: '14px 16px' }}>XP / LEVEL</th>
                        <th style={{ padding: '14px 16px', textAlign: 'right' }}>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u._id} style={{ borderBottom: '1px solid #30363d' }}>
                          <td style={{ padding: '14px 16px', fontWeight: 700, color: '#fafafa' }}>{u.name}</td>
                          <td style={{ padding: '14px 16px', color: '#a1a1aa', fontFamily: 'var(--font-mono)' }}>{u.email}</td>
                          <td style={{ padding: '14px 16px', color: '#a1a1aa' }}>{u.department || 'N/A'}</td>
                          <td style={{ padding: '14px 16px' }}>
                            <span
                              style={{
                                display: 'inline-block',
                                padding: '2px 8px',
                                fontSize: '0.7rem',
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                backgroundColor: u.role === 'admin' ? '#dfe104' : '#27272a',
                                color: u.role === 'admin' ? '#09090b' : '#fafafa',
                              }}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)' }}>
                            {u.xp || 0} XP (Lvl {u.level || 1})
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                              <button
                                onClick={() => handleRoleToggle(u)}
                                title={u.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                                style={{
                                  backgroundColor: u.role === 'admin' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                                  color: u.role === 'admin' ? '#ef4444' : '#10b981',
                                  border: `1px solid ${u.role === 'admin' ? '#ef4444' : '#10b981'}`,
                                  padding: '6px 12px',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 4,
                                }}
                              >
                                {u.role === 'admin' ? <FiUserX /> : <FiUserCheck />}
                                {u.role === 'admin' ? 'Demote' : 'Make Admin'}
                              </button>

                              <button
                                onClick={() => handleDeleteUser(u)}
                                title="Delete User"
                                style={{
                                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                                  color: '#ef4444',
                                  border: '1px solid #ef4444',
                                  padding: '6px 12px',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                }}
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: SMTP & EMAIL SYSTEM */}
          {activeTab === 'SMTP RELAY' && (
            <div>
              <div className="brutal-border" style={{ backgroundColor: '#09090b', padding: 32, marginBottom: 32 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
                  <div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, color: '#dfe104', textTransform: 'uppercase', margin: 0 }}>
                      NODEMAILER SMTP RELAY CONTROL
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: '#a1a1aa', fontFamily: 'var(--font-mono)', marginTop: 6 }}>
                      INSPECT AND VERIFY AUTOMATED EMAIL DISPATCH INFRASTRUCTURE.
                    </p>
                  </div>

                  <button
                    onClick={handleTestSmtpAdmin}
                    disabled={loadingSmtp}
                    className="acid-btn"
                    style={{ padding: '12px 24px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    <FiMail /> {loadingSmtp ? 'TESTING SMTP...' : 'TEST SMTP CONNECTION'}
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 32 }}>
                  <div style={{ border: '1px solid #3F3F46', padding: 20, background: '#131315' }}>
                    <span style={{ fontSize: '0.7rem', color: '#a1a1aa', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                      CONFIGURED TRANSPORT HOST
                    </span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fafafa', fontFamily: 'var(--font-mono)' }}>
                      {import.meta.env.VITE_SMTP_HOST || 'smtp.ethereal.email (Default)'}
                    </span>
                  </div>

                  <div style={{ border: '1px solid #3F3F46', padding: 20, background: '#131315' }}>
                    <span style={{ fontSize: '0.7rem', color: '#a1a1aa', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                      DISPATCH CAPABILITIES
                    </span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                      WELCOME & PASSWORD RESET
                    </span>
                  </div>

                  <div style={{ border: '1px solid #3F3F46', padding: 20, background: '#131315' }}>
                    <span style={{ fontSize: '0.7rem', color: '#a1a1aa', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                      SECURITY PROTOCOL
                    </span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#dfe104', fontFamily: 'var(--font-mono)' }}>
                      STARTTLS / TLS (PORT 587)
                    </span>
                  </div>
                </div>

                {smtpResult && (
                  <div style={{ border: '2px solid #dfe104', background: '#131315', padding: 24, fontFamily: 'var(--font-mono)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#dfe104', fontWeight: 800, marginBottom: 12 }}>
                      <FiMail /> SMTP TEST DIAGNOSTIC REPORT:
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#fafafa', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div>MODE: <span style={{ color: '#dfe104', fontWeight: 800 }}>{smtpResult.mode}</span></div>
                      <div>STATUS: {smtpResult.connected ? <span style={{ color: '#10b981', fontWeight: 800 }}>ONLINE</span> : <span style={{ color: '#ef4444', fontWeight: 800 }}>OFFLINE / MOCK</span>}</div>
                      <div>MESSAGE: {smtpResult.message}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
