import api from './api';

export const authService = {
  // Register user
  register: async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    return data.data;
  },

  // Login user
  login: async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    return data.data;
  },

  // Get current user profile
  getProfile: async () => {
    const { data } = await api.get('/auth/me');
    return data.data;
  },

  // Update profile
  updateProfile: async (profileData) => {
    const { data } = await api.put('/auth/profile', profileData);
    return data.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const { data } = await api.put('/auth/change-password', passwordData);
    return data;
  },
};
