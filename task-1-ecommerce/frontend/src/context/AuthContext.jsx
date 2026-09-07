import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('shopsphere_user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
          // Refresh profile in background
          try {
            const freshProfile = await authService.getProfile();
            const updatedUser = { ...parsed, ...freshProfile };
            setUser(updatedUser);
            localStorage.setItem('shopsphere_user', JSON.stringify(updatedUser));
          } catch (profileErr) {
            console.warn('Could not refresh profile from server:', profileErr.message);
          }
        } catch (err) {
          console.error('Failed to parse saved user:', err);
          localStorage.removeItem('shopsphere_user');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Login handler
  const login = async (credentials) => {
    const userData = await authService.login(credentials);
    setUser(userData);
    localStorage.setItem('shopsphere_user', JSON.stringify(userData));
    return userData;
  };

  // Register handler
  const register = async (userData) => {
    const newUser = await authService.register(userData);
    setUser(newUser);
    localStorage.setItem('shopsphere_user', JSON.stringify(newUser));
    return newUser;
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    localStorage.removeItem('shopsphere_user');
  };

  // Update profile handler
  const updateProfile = async (profileData) => {
    const updated = await authService.updateProfile(profileData);
    const merged = { ...user, ...updated };
    setUser(merged);
    localStorage.setItem('shopsphere_user', JSON.stringify(merged));
    return merged;
  };

  // Change password handler
  const changePassword = async (passwordData) => {
    return await authService.changePassword(passwordData);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
