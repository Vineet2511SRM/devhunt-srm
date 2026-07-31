import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotifications, markAsRead, markAllAsRead } from '../services/userService.js';
import { timeAgo } from '../utils/helpers.js';
import { NOTIFICATION_ICONS } from '../utils/constants.js';

const NotificationDropdown = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
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
    onClose();
    if (notif.relatedProject) {
      navigate(`/projects/${notif.relatedProject._id || notif.relatedProject}`);
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

  return (
    <div className="notif-panel">
      <div className="notif-header">
        <h4>Notifications 🔔</h4>
        {notifications.some((n) => !n.read) && (
          <button
            onClick={handleMarkAllRead}
            style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-accent)', fontWeight: 600 }}
          >
            Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ padding: 'var(--space-4)', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>
          Loading notifications...
        </div>
      ) : notifications.length === 0 ? (
        <div style={{ padding: 'var(--space-4)', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>
          No notifications yet 🚀
        </div>
      ) : (
        <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
          {notifications.slice(0, 5).map((notif) => (
            <div
              key={notif._id}
              onClick={() => handleNotificationClick(notif)}
              className={`notif-item ${!notif.read ? 'unread' : ''}`}
              style={{
                cursor: 'pointer',
                padding: 'var(--space-2) var(--space-2)',
                borderRadius: 'var(--radius-sm)',
                transition: 'background var(--transition-fast)',
                display: 'flex',
                gap: 'var(--space-2)',
                alignItems: 'flex-start',
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>
                {NOTIFICATION_ICONS[notif.type] || '🔔'}
              </span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 'var(--font-size-xs)', margin: 0 }}>{notif.message}</p>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                  {timeAgo(notif.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
