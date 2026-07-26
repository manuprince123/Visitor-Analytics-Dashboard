import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // On mount, verify token and fetch admin profile
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const res = await api.get('/auth/me');
          setAdmin(res.data.admin);
        } catch {
          // Token invalid or expired — clear it
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = (adminData, authToken) => {
    setToken(authToken);
    setAdmin(adminData);
    localStorage.setItem('token', authToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  };

  const updateAdmin = (updatedAdmin) => {
    setAdmin((prev) => ({ ...prev, ...updatedAdmin }));
  };

  return (
    <AuthContext.Provider value={{ admin, token, loading, login, logout, updateAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
