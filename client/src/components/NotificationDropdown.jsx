import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotifications, markAsRead, markAllAsRead } from '../services/userService.js';
import { timeAgo } from '../utils/helpers.js';
import { NOTIFICATION_ICONS } from '../utils/constants.js';
import { FiBell } from 'react-icons/fi';

const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await getNotifications();
      setNotifications(data.notifications || []);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.read) {
      try {
        await markAsRead(notif._id);
        setNotifications((prev) =>
          prev.map((n) => (n._id === notif._id ? { ...n, read: true } : n))
        );
      } catch {
        // Continue even if mark as read fails
      }
    }
    setOpen(false);
    if (notif.relatedProject) {
      const projectId = notif.relatedProject._id || notif.relatedProject;
      navigate(`/projects/${projectId}`);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      // Ignore errors
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Notification Bell Icon Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="brutal-border"
        style={{
          width: 42,
          height: 42,
          background: open ? '#dfe104' : '#09090b',
          color: open ? '#09090b' : '#fafafa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative',
          fontSize: '1.2rem',
          transition: 'all 0.15s ease',
        }}
        title="NOTIFICATIONS"
      >
        <FiBell />
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: -4,
              right: -4,
              background: '#dfe104',
              color: '#09090b',
              fontSize: '0.65rem',
              fontWeight: 800,
              width: 18,
              height: 18,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #09090b',
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown Menu */}
      {open && (
        <div
          className="brutal-border"
          style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 12px)',
            width: 320,
            background: '#09090b',
            border: '2px solid #3F3F46',
            zIndex: 1050,
            boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
          }}
        >
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '2px solid #3F3F46',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#131315',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.75rem',
                fontWeight: 800,
                color: '#dfe104',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              NOTIFICATIONS
            </span>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#a1a1aa',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  textDecoration: 'underline',
                }}
              >
                MARK ALL READ
              </button>
            )}
          </div>

          <div style={{ maxHeight: 320, overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: 16, textAlign: 'center', color: '#a1a1aa', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                LOADING NOTIFICATIONS...
              </div>
            ) : notifications.length === 0 ? (
              <div style={{ padding: 16, textAlign: 'center', color: '#a1a1aa', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                NO NEW NOTIFICATIONS
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif._id}
                  onClick={() => handleNotificationClick(notif)}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #27272a',
                    cursor: 'pointer',
                    background: notif.read ? 'transparent' : '#18181b',
                    display: 'flex',
                    gap: 12,
                    alignItems: 'flex-start',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#27272a')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = notif.read ? 'transparent' : '#18181b')}
                >
                  <span style={{ fontSize: '1.1rem', marginTop: 2 }}>
                    {NOTIFICATION_ICONS[notif.type] || '🔔'}
                  </span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.75rem', color: notif.read ? '#a1a1aa' : '#fafafa', margin: 0, textTransform: 'uppercase', fontWeight: notif.read ? 500 : 700 }}>
                      {notif.message}
                    </p>
                    <span style={{ fontSize: '0.65rem', color: '#71717a', fontFamily: 'var(--font-mono)', marginTop: 4, display: 'block' }}>
                      {timeAgo(notif.createdAt)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
