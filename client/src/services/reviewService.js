import api from './api.js';

// Get all reviews for a project
export const getReviews = (projectId) => api.get(`/reviews/${projectId}`);

// Create a review for a project
export const createReview = (projectId, reviewData) =>
  api.post(`/reviews/${projectId}`, reviewData);

// Update own review
export const updateReview = (reviewId, reviewData) =>
  api.put(`/reviews/${reviewId}`, reviewData);

// Delete own review
export const deleteReview = (reviewId) => api.delete(`/reviews/${reviewId}`);
