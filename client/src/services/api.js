import axios from 'axios';

/**
 * Axios instance pre-configured to talk to our Express backend.
 * - Uses the Vite proxy in development (/api → localhost:5000/api)
 * - Sends cookies (HTTP-only JWT) with every request
 * - Intercepts 401 responses to clear stale auth state
 */
const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ---- Request Interceptor ----
// Attach JWT token from localStorage (if available) as Bearer header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('devhunt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---- Response Interceptor ----
// Handle 401 errors globally (expired/invalid token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('devhunt_token');
      // Only redirect if not already on login/register page
      const path = window.location.pathname;
      if (path !== '/login' && path !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
