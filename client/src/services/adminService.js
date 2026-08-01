import api from './api.js';

/**
 * Fetch platform stats overview
 */
export const getAdminStats = () => {
  return api.get('/admin/stats');
};

/**
 * Fetch paginated list of users with search and role filters
 */
export const getAdminUsers = (params = {}) => {
  return api.get('/admin/users', { params });
};

/**
 * Update user role ('user' | 'admin')
 */
export const updateUserRole = (userId, role) => {
  return api.patch(`/admin/users/${userId}/role`, { role });
};

/**
 * Delete a user account and their associated content
 */
export const deleteUserAdmin = (userId) => {
  return api.delete(`/admin/users/${userId}`);
};

/**
 * Delete any project
 */
export const deleteProjectAdmin = (projectId) => {
  return api.delete(`/admin/projects/${projectId}`);
};

/**
 * Delete any review
 */
export const deleteReviewAdmin = (reviewId) => {
  return api.delete(`/admin/reviews/${reviewId}`);
};
