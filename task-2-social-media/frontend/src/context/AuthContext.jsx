import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('pulse_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        // Refresh
        api.get('/auth/me').then(({ data }) => {
          if (data.data) {
            const updated = { ...parsed, ...data.data };
            setUser(updated);
            localStorage.setItem('pulse_user', JSON.stringify(updated));
          }
        }).catch(() => {});
      } catch (e) {
        localStorage.removeItem('pulse_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    setUser(data.data);
    localStorage.setItem('pulse_user', JSON.stringify(data.data));
    return data.data;
  };

  const register = async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    setUser(data.data);
    localStorage.setItem('pulse_user', JSON.stringify(data.data));
    return data.data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pulse_user');
  };

  const updateProfile = async (profileData) => {
    const { data } = await api.put('/auth/profile', profileData);
    const updated = { ...user, ...data.data };
    setUser(updated);
    localStorage.setItem('pulse_user', JSON.stringify(updated));
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
