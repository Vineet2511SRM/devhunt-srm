import api from './api.js';

// Register
export const registerUser = (userData) => api.post('/auth/register', userData);

// Login
export const loginUser = (credentials) => api.post('/auth/login', credentials);

// Logout
export const logoutUser = () => api.post('/auth/logout');

// Get current user
export const getMe = () => api.get('/auth/me');
