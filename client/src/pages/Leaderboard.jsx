import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import HeartbeatECG from '../components/HeartbeatECG.jsx';
import { getLeaderboard } from '../services/userService.js';
import { getInitials } from '../utils/helpers.js';
import { FiTrendingUp, FiCode, FiShield, FiZap, FiAward, FiUsers } from 'react-icons/fi';
import '../styles/Leaderboard.css';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('ALL TIME');

  useEffect(() => {
    document.title = 'DEVHUNT SRM — LEADERBOARD';
    fetchLeaderboard();
  }, [timeFilter]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const { data } = await getLeaderboard({ limit: 10 });
      setLeaderboardData(data.leaderboard || []);
    } catch {
      setLeaderboardData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="page" style={{ paddingTop: 0, paddingBottom: 64 }}>
        {/* Header Hero Section with Tech Node Image & Volt Glow */}
        <div className="leaderboard-hero-bg">
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                <div className="leaderboard-tech-node-badge">
                  <img src="/tech-node.png" alt="Tech Node" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 800, color: '#dfe104', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  // CAMPUS XP RANKINGS
                </span>
              </div>
              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(3.5rem, 8vw, 7rem)',
                  fontWeight: 800,
                  color: '#fafafa',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.05em',
                  lineHeight: 0.9,
                  margin: 0,
                  textShadow: '0 0 30px rgba(223, 225, 4, 0.4)',
                }}
              >
                LEADERBOARD
              </h1>
              <p style={{ fontSize: '0.85rem', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 12 }}>
                TOP CAMPUS DEVELOPERS RANKED BY SHIPPED CODE, REVIEWS &amp; COMMUNITY XP
              </p>

              <div style={{ marginTop: 16, maxWidth: 500 }}>
                <HeartbeatECG height={28} color="#dfe104" label="LEADERBOARD HEARTBEAT" />
              </div>
            </div>

            {/* THIS WEEK vs ALL TIME Filter Buttons */}
            <div className="brutal-border" style={{ display: 'flex', background: '#09090b', padding: 4, boxShadow: '0 0 25px rgba(223, 225, 4, 0.25)' }}>
              <button
                onClick={() => setTimeFilter('THIS WEEK')}
                style={{
                  padding: '8px 20px',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  border: 'none',
                  cursor: 'pointer',
                  background: timeFilter === 'THIS WEEK' ? '#dfe104' : 'transparent',
                  color: timeFilter === 'THIS WEEK' ? '#09090b' : '#fafafa',
                }}
              >
                THIS WEEK
              </button>
              <button
                onClick={() => setTimeFilter('ALL TIME')}
                style={{
                  padding: '8px 20px',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  border: 'none',
                  cursor: 'pointer',
                  background: timeFilter === 'ALL TIME' ? '#dfe104' : 'transparent',
                  color: timeFilter === 'ALL TIME' ? '#09090b' : '#fafafa',
                }}
              >
                ALL TIME
              </button>
            </div>
          </div>

          {/* Leaderboard Table Column Headers */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '80px 2fr 1fr 2fr 1fr',
              gap: 16,
              padding: '12px 20px',
              borderBottom: '2px solid #3F3F46',
              fontSize: '0.75rem',
              fontWeight: 800,
              color: '#a1a1aa',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-mono)',
            }}
          >
            <div>RANK</div>
            <div>DEVELOPER</div>
            <div>LEVEL</div>
            <div>EXPERIENCE</div>
            <div style={{ textAlign: 'right' }}>BADGES</div>
          </div>

          {/* Leaderboard Rows */}
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#a1a1aa' }}>LOADING LEADERBOARD...</div>
          ) : leaderboardData.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#a1a1aa' }}>NO DEVELOPERS ON LEADERBOARD YET.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {leaderboardData.map((dev, index) => {
                const rank = index + 1;
                const isTop1 = rank === 1;

                return (
                  <div
                    key={dev._id}
                    className="hover-invert"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '80px 2fr 1fr 2fr 1fr',
                      gap: 16,
                      alignItems: 'center',
                      padding: '20px',
                      borderBottom: '2px solid #3F3F46',
                      background: '#09090b',
                    }}
                  >
                    {/* Rank Number */}
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900, color: isTop1 ? '#dfe104' : '#fafafa' }}>
                      #{rank}
                    </div>

                    {/* Developer Avatar & Name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div className="brutal-border" style={{ width: 48, height: 48, background: '#131315', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, overflow: 'hidden', position: 'relative' }}>
                        {dev.avatar ? (
                          <img src={dev.avatar} alt={dev.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          getInitials(dev.name)
                        )}
                        {isTop1 && (
                          <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#dfe104', color: '#09090b', fontSize: '0.55rem', fontWeight: 900, textAlign: 'center' }}>
                            PRO
                          </span>
                        )}
                      </div>

                      <div>
                        <Link to={`/users/${dev._id}`} style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, color: '#fafafa', textTransform: 'uppercase', textDecoration: 'none' }}>
                          {dev.name}
                        </Link>
                        <p style={{ fontSize: '0.75rem', color: '#a1a1aa', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                          @{dev.name?.toLowerCase().replace(/\s+/g, '')}
                        </p>
                      </div>
                    </div>

                    {/* Level */}
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: '#fafafa', textTransform: 'uppercase' }}>
                      LVL {dev.level || 1}
                    </div>

                    {/* Experience XP Progress Bar */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 800, color: '#fafafa', textTransform: 'uppercase', marginBottom: 4, fontFamily: 'var(--font-mono)' }}>
                        <span>{dev.xp?.toLocaleString() || 0} XP</span>
                        <span style={{ color: '#a1a1aa' }}>15K</span>
                      </div>
                      <div style={{ height: 8, border: '2px solid #3F3F46', background: '#131315' }}>
                        <div style={{ height: '100%', width: `${Math.min(100, Math.max(10, ((dev.xp || 0) / 15000) * 100))}%`, background: isTop1 ? '#dfe104' : '#a1a1aa' }} />
                      </div>
                    </div>

                    {/* Badges */}
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', fontSize: '1.25rem', color: isTop1 ? '#dfe104' : '#fafafa' }}>
                      <FiZap />
                      <FiCode />
                      <FiShield />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Load More Button */}
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <button className="acid-outline-btn" style={{ padding: '12px 36px', fontSize: '0.85rem' }}>
              LOAD MORE
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Leaderboard;
