import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api.js';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto-load user on mount (check if JWT cookie / token is still valid)
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('devhunt_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get('/auth/me');
        setUser(data.user);
      } catch {
        localStorage.removeItem('devhunt_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  // Register
  const register = async (nameOrPayload, email, password) => {
    const payload = typeof nameOrPayload === 'object'
      ? nameOrPayload
      : { name: nameOrPayload, email, password };
    const { data } = await api.post('/auth/register', payload);
    localStorage.setItem('devhunt_token', data.token);
    setUser(data.user);
    return data;
  };

  // Login
  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('devhunt_token', data.token);
    setUser(data.user);
    return data;
  };

  // Logout
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Logout even if API call fails
    }
    localStorage.removeItem('devhunt_token');
    setUser(null);
  };

  // Google Login
  const googleLogin = async (credential) => {
    const { data } = await api.post('/auth/google', { credential });
    localStorage.setItem('devhunt_token', data.token);
    setUser(data.user);
    return data;
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    googleLogin,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
