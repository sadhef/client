import axios from 'axios';

const API_CONFIG = {
  API_URL: process.env.REACT_APP_API_URL || 'https://bladerunner.greenjets.com/api',
  DASH_URL: process.env.REACT_APP_DASH_URL || 'https://bladerunner.greenjets.com/dash',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};

// Create axios instance with enhanced configuration
const api = axios.create({
  baseURL: API_CONFIG.API_URL,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  }
});

// Enhanced request interceptor
api.interceptors.request.use(
  (config) => {
    // Add CORS headers to every request
    config.headers['Access-Control-Allow-Credentials'] = true;
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    
    // Handle development environment
    if (process.env.NODE_ENV === 'development') {
      config.headers['Origin'] = window.location.origin;
    }
    
    return config;
  },
  (error) => {
    console.error('[Request Error]', error);
    return Promise.reject(error);
  }
);

// Enhanced response interceptor
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

    // Handle CORS errors
    if (error.message === 'Network Error') {
      console.error('CORS or Network Error:', error);
      return Promise.reject({
        message: 'Unable to connect to the server. Please check your connection.',
        originalError: error,
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

    // Handle other errors
    if (error.response) {
      return Promise.reject(error.response.data);
    }

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