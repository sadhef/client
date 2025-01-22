import axios from 'axios';

const API_CONFIG = {
  API_URL: process.env.REACT_APP_API_URL || 'https://bladerunner.greenjets.com/api',
  DASH_URL: process.env.REACT_APP_DASH_URL || 'https://bladerunner.greenjets.com/dash',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_CONFIG.API_URL,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Request interceptor to add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    console.error('[Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor with enhanced error handling and retry logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('isAdmin');
      window.location.href = '/login';
      return Promise.reject({
        message: 'Session expired. Please login again.',
      });
    }

    // Handle network errors with retry logic
    if (!error.response && !originalRequest._retry) {
      originalRequest._retry = true;
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

      if (originalRequest._retryCount <= API_CONFIG.RETRY_ATTEMPTS) {
        console.log(`Retrying request (${originalRequest._retryCount}/${API_CONFIG.RETRY_ATTEMPTS})`);
        try {
          return await api(originalRequest);
        } catch (retryError) {
          return Promise.reject({
            message: 'Network error persisted after retries.',
            originalError: retryError,
          });
        }
      }
    }

    // Handle other response errors
    if (error.response) {
      return Promise.reject(error.response.data);
    }

    // Handle request errors
    if (error.request) {
      console.error('[Network Error]', error.request);
      return Promise.reject({
        message: 'Network error occurred. Please check your connection.',
        originalError: error.request,
      });
    }

    // Handle other errors
    console.error('[Error]', error.message);
    return Promise.reject({
      message: 'An unexpected error occurred.',
      originalError: error,
    });
  }
);

// API Endpoints
export const apiEndpoints = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    adminLogin: '/api/auth/admin/login',
    verify: '/api/auth/verify',
  },
  users: {
    getAll: '/api/users',
    approve: (id) => `/api/users/${id}/approve`,
    delete: (id) => `/api/users/${id}`,
  },
  dashboard: {
    url: API_CONFIG.DASH_URL,
  },
};

export default api;
