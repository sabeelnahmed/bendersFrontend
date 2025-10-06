import axios from 'axios';

// API Configuration
const API_CONFIG = {
  baseURL: 'http://localhost:8000', // Change this to your backend IP and port
  timeout: 10000, // 10 seconds timeout
};

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token if needed
apiClient.interceptors.request.use(
  (config) => {
    // Add authorization token to requests if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors here
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.message);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/api/v1/auth/login',
  REGISTER: '/api/v1/auth/register',
  LOGOUT: '/api/v1/auth/logout',
  FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
  RESET_PASSWORD: '/api/v1/auth/reset-password',
  REQUEST_VERIFY_TOKEN: '/api/v1/auth/request-verify-token',
  VERIFY: '/api/v1/auth/verify',
  
  // Current User
  ME: '/api/v1/auth/me',
  CHANGE_PASSWORD: '/api/v1/auth/me/change-password',
  
  // User Management (Admin)
  USERS: '/api/v1/auth/users',
  USER_BY_ID: (userId) => `/api/v1/auth/users/${userId}`,
  VERIFY_USER: (userId) => `/api/v1/auth/users/${userId}/verify`,
  BAN_USER: (userId) => `/api/v1/auth/users/${userId}/ban`,
  UNBAN_USER: (userId) => `/api/v1/auth/users/${userId}/unban`,
  
  // Projects
  PROJECTS: '/api/v1/projects',
  PROJECT_BY_ID: (projectId) => `/api/v1/projects/${projectId}`,
  PROJECT_STATS: (projectId) => `/api/v1/projects/${projectId}/stats`,
  
  // Health Check
  HEALTH: '/api/v1/health',
  AUTH_HEALTH: '/api/v1/auth/health',
};

// Export the base URL for direct use if needed
export const API_BASE_URL = API_CONFIG.baseURL;

// Helper function to update base URL dynamically if needed
export const updateApiBaseUrl = (newUrl) => {
  apiClient.defaults.baseURL = newUrl;
};

