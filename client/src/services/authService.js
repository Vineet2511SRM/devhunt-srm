import api from './api.js';

// Register
export const registerUser = (userData) => api.post('/auth/register', userData);

// Login
export const loginUser = (credentials) => api.post('/auth/login', credentials);

// Logout
export const logoutUser = () => api.post('/auth/logout');

// Get current user
export const getMe = () => api.get('/auth/me');

// Forgot Password (Request Reset Link via SMTP)
export const forgotPasswordUser = (email) => api.post('/auth/forgot-password', { email });

// Reset Password
export const resetPasswordUser = (token, password) => api.post(`/auth/reset-password/${token}`, { password });

// Test SMTP Connection
export const testSmtpApi = () => api.post('/auth/test-smtp');

