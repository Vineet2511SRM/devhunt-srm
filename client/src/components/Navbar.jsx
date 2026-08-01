import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import NotificationDropdown from './NotificationDropdown.jsx';
import { FiPlus, FiUser, FiLogOut, FiMenu, FiX, FiCompass, FiAward, FiShield } from 'react-icons/fi';
import { getInitials } from '../utils/helpers.js';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar-kinetic">
      <div className="container navbar-inner">
        {/* Brand Logo */}
        <Link to="/" className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="heartbeat-dot" title="SYSTEM LIVE & OPERATIONAL" />
          <span className="nav-brand-title">DEVHUNT SRM</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="nav-links-kinetic">
          <Link to="/explore" className={`nav-link-kinetic ${isActive('/explore') ? 'active' : ''}`}>
            EXPLORE
          </Link>
          <Link to="/leaderboard" className={`nav-link-kinetic ${isActive('/leaderboard') ? 'active' : ''}`}>
            LEADERBOARD
          </Link>
        </nav>

        {/* Action Buttons & User Menu */}
        <div className="nav-actions-kinetic">
          <Link to="/submit" className="acid-btn" style={{ height: 42, padding: '0 20px', fontSize: '0.85rem' }}>
            <FiPlus />
            <span>SHIP PROJECT</span>
          </Link>

          {isAuthenticated ? (
            <>
              <NotificationDropdown />

              <div style={{ position: 'relative' }}>
                <button
                  className="nav-avatar-btn brutal-border"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} />
                  ) : (
                    <span>{getInitials(user?.name)}</span>
                  )}
                </button>

                {profileDropdownOpen && (
                  <div className="nav-dropdown brutal-border" onClick={() => setProfileDropdownOpen(false)}>
                    <div className="nav-dropdown-header">
                      <p style={{ fontWeight: 800, color: 'var(--color-accent)' }}>{user?.name}</p>
                      <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>LEVEL {user?.level || 1} BUILDER</p>
                    </div>

                    <Link to="/dashboard" className="nav-dropdown-item">
                      <FiUser /> DASHBOARD
                    </Link>

                    {user?.role === 'admin' && (
                      <Link to="/admin" className="nav-dropdown-item" style={{ color: '#dfe104', fontWeight: 'bold' }}>
                        <FiShield /> ADMIN PANEL
                      </Link>
                    )}

                    <Link to={`/profile/${user?._id}`} className="nav-dropdown-item">
                      <FiUser /> PUBLIC PROFILE
                    </Link>

                    <button onClick={logout} className="nav-dropdown-item text-danger">
                      <FiLogOut /> LOGOUT
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <Link to="/login" className="btn-outline" style={{ height: 42, padding: '8px 16px', fontSize: '0.85rem' }}>
                LOGIN
              </Link>
            </div>
          )}

          <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
