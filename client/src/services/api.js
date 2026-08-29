import axios from 'axios';

// Determine the base API URL:
// 1. If VITE_API_URL is provided, use it.
// 2. Otherwise default to relative '/api' (handled by Vite proxy in dev, and reverse proxy in prod).
const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  return '/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unified error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const customMessage =
      error.response?.data?.message || error.message || 'An unexpected error occurred.';
    return Promise.reject({
      ...error,
      userMessage: customMessage,
      data: error.response?.data,
      status: error.response?.status,
    });
  }
);

export default api;
