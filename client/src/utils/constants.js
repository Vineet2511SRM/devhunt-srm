// ================================================
// DevHunt SRM — App Constants
// ================================================

// Tech stack options for project filters
export const TECH_STACK_OPTIONS = [
  'React', 'Next.js', 'Vue', 'Angular', 'Svelte',
  'Node.js', 'Express', 'Django', 'Flask', 'FastAPI',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Firebase', 'Supabase',
  'Python', 'JavaScript', 'TypeScript', 'Java', 'C++',
  'TailwindCSS', 'Bootstrap', 'Material UI',
  'Docker', 'AWS', 'GCP', 'Vercel',
];

// Sort options for project listing
export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'trending', label: 'Trending' },
  { value: 'topRated', label: 'Top Rated' },
  { value: 'mostUpvoted', label: 'Most Upvoted' },
];

// Review category labels
export const REVIEW_CATEGORIES = [
  { key: 'uiux', label: 'UI / UX Design' },
  { key: 'codeQuality', label: 'Code Quality' },
  { key: 'idea', label: 'Innovation / Idea' },
];

// XP thresholds for leveling up
export const XP_THRESHOLDS = [
  0, 50, 150, 300, 500, 800, 1200, 1800, 2500, 3500,
];

// Notification type icons
export const NOTIFICATION_ICONS = {
  review_received: '📝',
  upvote_received: '⬆️',
  badge_earned: '🏅',
  level_up: '🎉',
};

// Items per page for pagination
export const ITEMS_PER_PAGE = 12;
