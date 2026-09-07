import axios from 'axios';

// Normalize the baseURL so it is completely resilient in both local dev and production:
// - If VITE_API_URL is unset: returns '/api' (leverages Vite dev proxy)
// - If VITE_API_URL is 'https://pulse-api.onrender.com': returns 'https://pulse-api.onrender.com/api'
// - If VITE_API_URL is 'https://pulse-api.onrender.com/api': returns 'https://pulse-api.onrender.com/api'
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

api.interceptors.request.use((config) => {
  const user = localStorage.getItem('pulse_user');
  if (user) {
    try {
      const parsed = JSON.parse(user);
      if (parsed.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`;
      }
    } catch (e) {}
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message || err.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;
