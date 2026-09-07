import axios from 'axios';

// Normalize the baseURL so it is completely resilient in both local dev and production:
// - If VITE_API_URL is unset: returns '/api' (leverages Vite dev proxy)
// - If VITE_API_URL is 'https://shopsphere-backend-00jm.onrender.com': returns 'https://shopsphere-backend-00jm.onrender.com/api'
// - If VITE_API_URL is 'https://shopsphere-backend-00jm.onrender.com/api': returns 'https://shopsphere-backend-00jm.onrender.com/api'
// - Handles any trailing slashes automatically
const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) return '/api';
  const trimmed = envUrl.trim().replace(/\/+$/, '');
  if (!trimmed.endsWith('/api')) {
    return `${trimmed}/api`;
  }
  return trimmed;
};

const api = axios.create({
  baseURL: getBaseURL(),
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
    
    // Auto-logout if token is expired/invalid (except on login/register endpoints)
    if (
      error.response?.status === 401 &&
      !error.config?.url?.includes('auth/login') &&
      !error.config?.url?.includes('auth/register')
    ) {
      localStorage.removeItem('shopsphere_user');
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
