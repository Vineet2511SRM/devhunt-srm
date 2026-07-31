import api from './api.js';

// Get public user profile
export const getUserProfile = (id) => api.get(`/users/${id}`);

// Update own profile
export const updateProfile = (profileData) => api.put('/users/profile', profileData);

// Get leaderboard
export const getLeaderboard = (params) => api.get('/users/leaderboard', { params });

// Toggle upvote on a project
export const toggleUpvote = (projectId) => api.post(`/upvotes/${projectId}/toggle`);

// Check if user has upvoted a project
export const checkUpvote = (projectId) => api.get(`/upvotes/${projectId}/check`);

// Get notifications
export const getNotifications = (params) => api.get('/notifications', { params });

// Get unread notification count
export const getUnreadCount = () => api.get('/notifications/unread-count');

// Mark notification as read
export const markAsRead = (id) => api.put(`/notifications/${id}/read`);

// Mark all notifications as read
export const markAllAsRead = () => api.put('/notifications/read-all');
