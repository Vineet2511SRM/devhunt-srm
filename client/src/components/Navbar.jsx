import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { getUnreadCount } from '../services/userService.js';
import NotificationDropdown from './NotificationDropdown.jsx';
import { getInitials } from '../utils/helpers.js';
import {
  FiZap,
  FiSearch,
  FiBell,
  FiSun,
  FiMoon,
  FiUser,
  FiLogOut,
  FiPlusCircle,
  FiMenu,
  FiX,
  FiAward,
} from 'react-icons/fi';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotif, setShowNotif] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuRef = useRef(null);

  // Poll for unread notifications when logged in
  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const fetchUnreadCount = async () => {
    try {
      const { data } = await getUnreadCount();
      setUnreadCount(data.count || 0);
    } catch {
      setUnreadCount(0);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="container navbar-container">
        {/* ---- Brand Logo ---- */}
        <Link to="/" className="nav-logo">
          <FiZap className="nav-logo-icon text-gradient" />
          <span>
            DevHunt<span className="text-gradient">SRM</span>
          </span>
          <span className="nav-logo-badge">v2.0</span>
        </Link>

        {/* ---- Navigation Links ---- */}
        <nav className="nav-links">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Home
          </NavLink>
          <NavLink to="/explore" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Explore
          </NavLink>
          <NavLink to="/leaderboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Leaderboard
          </NavLink>
        </nav>

        {/* ---- Search Input ---- */}
        <form onSubmit={handleSearchSubmit} className="nav-search">
          <FiSearch className="nav-search-icon" />
          <input
            type="text"
            className="nav-search-input"
            placeholder="Search projects, tags, tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* ---- Action Buttons ---- */}
        <div className="nav-actions">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="icon-btn"
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Theme"
          >
            {isDark ? <FiSun /> : <FiMoon />}
          </button>

          {isAuthenticated ? (
            <>
              {/* Notification Bell */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => {
                    setShowNotif(!showNotif);
                    setShowUserMenu(false);
                  }}
                  className="icon-btn"
                  title="Notifications"
                >
                  <FiBell />
                  {unreadCount > 0 && <span className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
                </button>

                {showNotif && (
                  <NotificationDropdown onClose={() => setShowNotif(false)} />
                )}
              </div>

              {/* Submit Project CTA */}
              <Link to="/submit" className="btn btn-primary btn-sm" style={{ gap: 'var(--space-1)' }}>
                <FiPlusCircle /> Submit
              </Link>

              {/* User Avatar Menu Trigger */}
              <div style={{ position: 'relative' }} ref={menuRef}>
                <div
                  className="user-menu-trigger"
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowNotif(false);
                  }}
                >
                  <div className="user-avatar">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} />
                    ) : (
                      getInitials(user?.name)
                    )}
                  </div>
                </div>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <div className="dropdown-user-name">{user?.name}</div>
                      <div className="dropdown-user-email">{user?.email}</div>
                      <div
                        style={{
                          fontSize: 'var(--font-size-xs)',
                          color: 'var(--color-accent)',
                          fontWeight: 600,
                          marginTop: '4px',
                        }}
                      >
                        ⚡ Level {user?.level || 1} • {user?.xp || 0} XP
                      </div>
                    </div>

                    <Link
                      to="/dashboard"
                      className="dropdown-item"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <FiAward /> Dashboard
                    </Link>
                    <Link
                      to={`/users/${user?._id}`}
                      className="dropdown-item"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <FiUser /> Public Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="dropdown-item"
                      style={{ color: 'var(--color-error)' }}
                    >
                      <FiLogOut /> Log Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </>
          )}

          {/* Mobile Menu Icon */}
          <button
            className="icon-btn mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
