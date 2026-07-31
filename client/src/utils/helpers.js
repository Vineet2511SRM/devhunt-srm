// ================================================
// DevHunt SRM — Helper Utilities
// ================================================

/**
 * Format a date string into a readable "time ago" format.
 * e.g., "2 hours ago", "3 days ago"
 */
export const timeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }
  return 'just now';
};

/**
 * Truncate a string to a given length and add ellipsis.
 */
export const truncate = (str, maxLength = 100) => {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength).trim() + '…';
};

/**
 * Calculate the level from XP using thresholds.
 */
export const getLevelFromXP = (xp) => {
  const thresholds = [0, 50, 150, 300, 500, 800, 1200, 1800, 2500, 3500];
  let level = 1;
  for (let i = 1; i < thresholds.length; i++) {
    if (xp >= thresholds[i]) level = i + 1;
    else break;
  }
  return level;
};

/**
 * Get XP progress percentage toward the next level.
 */
export const getXPProgress = (xp) => {
  const thresholds = [0, 50, 150, 300, 500, 800, 1200, 1800, 2500, 3500];
  const level = getLevelFromXP(xp);
  if (level >= thresholds.length) return 100;
  const current = thresholds[level - 1];
  const next = thresholds[level];
  return Math.round(((xp - current) / (next - current)) * 100);
};

/**
 * Format a number with commas (e.g., 1234 → "1,234").
 */
export const formatNumber = (num) => {
  return num?.toLocaleString() || '0';
};

/**
 * Generate initials from a name (e.g., "John Doe" → "JD").
 */
export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
