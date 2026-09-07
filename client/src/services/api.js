import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization Bearer token to every outgoing request if stored
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('shopsphere_user');
    if (userInfo) {
      try {
        const parsed = JSON.parse(userInfo);
        if (parsed.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      } catch (err) {
        console.error('Error parsing token:', err);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to format errors nicely
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred';
    
    // Auto-logout if token is expired/invalid
    if (error.response?.status === 401 && !error.config.url.includes('/auth/login')) {
      localStorage.removeItem('shopsphere_user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        // Option to trigger redirect or let AuthContext handle state
      }
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
