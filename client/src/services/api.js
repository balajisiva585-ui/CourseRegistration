import axios from 'axios';

// Format and normalize base API URL to ensure it always includes '/api' without duplication
export const formatBaseApiUrl = (rawUrl) => {
  // If no environment variable is provided:
  if (!rawUrl || typeof rawUrl !== 'string' || !rawUrl.trim()) {
    if (typeof import.meta !== 'undefined' && import.meta.env?.PROD) {
      return 'https://course-registration-api-gwk0.onrender.com/api';
    }
    return '/api';
  }

  let url = rawUrl.trim();

  // Strip trailing slashes
  url = url.replace(/\/+$/, '');

  // If it's already exactly '/api' or ends with '/api', keep it
  if (url === '/api' || url.endsWith('/api')) {
    return url;
  }

  // If it's relative '/' or empty
  if (url === '') {
    return '/api';
  }

  // If it's an absolute or relative path without '/api', append '/api'
  return `${url}/api`;
};

export const getBaseUrl = () => {
  const envUrl =
    (typeof import.meta !== 'undefined' && (import.meta.env?.VITE_API_URL || import.meta.env?.VITE_API_BASE_URL)) ||
    '';
  return formatBaseApiUrl(envUrl);
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
