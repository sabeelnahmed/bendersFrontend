import { apiClient, API_ENDPOINTS } from '../Context';

/**
 * Authentication Service
 * Contains all authentication-related API calls
 */

export const authService = {
  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} LoginResponse with access_token, token_type, and user
   */
  login: async (email, password) => {
    const formBody = new URLSearchParams();
    formBody.append('username', email);
    formBody.append('password', password);

    const response = await apiClient.post(API_ENDPOINTS.LOGIN, formBody, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @param {string} userData.email - User email (required)
   * @param {string} userData.password - User password (required, min 8 chars)
   * @param {string} [userData.full_name] - User's full name
   * @param {string} [userData.username] - Username (3-50 chars)
   * @param {string} [userData.phone_number] - Phone number
   * @returns {Promise} UserRead object
   */
  register: async (userData) => {
    const response = await apiClient.post(API_ENDPOINTS.REGISTER, userData);
    return response.data;
  },

  /**
   * Logout current user
   * @returns {Promise}
   */
  logout: async () => {
    const response = await apiClient.post(API_ENDPOINTS.LOGOUT);
    return response.data;
  },

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise}
   */
  forgotPassword: async (email) => {
    const response = await apiClient.post(API_ENDPOINTS.FORGOT_PASSWORD, { email });
    return response.data;
  },

  /**
   * Reset password with token
   * @param {string} token - Reset token
   * @param {string} password - New password
   * @returns {Promise}
   */
  resetPassword: async (token, password) => {
    const response = await apiClient.post(API_ENDPOINTS.RESET_PASSWORD, {
      token,
      password,
    });
    return response.data;
  },

  /**
   * Request verification token
   * @param {string} email - User email
   * @returns {Promise}
   */
  requestVerifyToken: async (email) => {
    const response = await apiClient.post(API_ENDPOINTS.REQUEST_VERIFY_TOKEN, { email });
    return response.data;
  },

  /**
   * Verify user with token
   * @param {string} token - Verification token
   * @returns {Promise} UserRead object
   */
  verify: async (token) => {
    const response = await apiClient.post(API_ENDPOINTS.VERIFY, { token });
    return response.data;
  },

  /**
   * Get current user information
   * @returns {Promise} UserMe object
   */
  getCurrentUser: async () => {
    const response = await apiClient.get(API_ENDPOINTS.ME);
    return response.data;
  },

  /**
   * Update current user
   * @param {Object} userData - User update data
   * @returns {Promise} UserRead object
   */
  updateCurrentUser: async (userData) => {
    const response = await apiClient.patch(API_ENDPOINTS.ME, userData);
    return response.data;
  },

  /**
   * Delete current user account
   * @returns {Promise}
   */
  deleteCurrentUser: async () => {
    const response = await apiClient.delete(API_ENDPOINTS.ME);
    return response.data;
  },

  /**
   * Change current user's password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password (min 8 chars)
   * @returns {Promise}
   */
  changePassword: async (currentPassword, newPassword) => {
    const response = await apiClient.post(API_ENDPOINTS.CHANGE_PASSWORD, {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return response.data;
  },

  /**
   * Get list of users (admin only)
   * @param {Object} params - Query parameters
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.size=10] - Page size (1-100)
   * @param {string} [params.search] - Search query
   * @param {boolean} [params.is_active] - Filter by active status
   * @param {boolean} [params.is_verified] - Filter by verified status
   * @returns {Promise} UserListResponse with users array and pagination info
   */
  listUsers: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.USERS, { params });
    return response.data;
  },

  /**
   * Get user by ID (admin only)
   * @param {string} userId - User UUID
   * @returns {Promise} UserRead object
   */
  getUserById: async (userId) => {
    const response = await apiClient.get(API_ENDPOINTS.USER_BY_ID(userId));
    return response.data;
  },

  /**
   * Update user (admin only)
   * @param {string} userId - User UUID
   * @param {Object} userData - User update data
   * @returns {Promise} UserRead object
   */
  updateUser: async (userId, userData) => {
    const response = await apiClient.patch(API_ENDPOINTS.USER_BY_ID(userId), userData);
    return response.data;
  },

  /**
   * Delete user (admin only)
   * @param {string} userId - User UUID
   * @returns {Promise}
   */
  deleteUser: async (userId) => {
    const response = await apiClient.delete(API_ENDPOINTS.USER_BY_ID(userId));
    return response.data;
  },

  /**
   * Manually verify user (admin only)
   * @param {string} userId - User UUID
   * @returns {Promise}
   */
  verifyUser: async (userId) => {
    const response = await apiClient.post(API_ENDPOINTS.VERIFY_USER(userId));
    return response.data;
  },

  /**
   * Ban user (admin only)
   * @param {string} userId - User UUID
   * @returns {Promise}
   */
  banUser: async (userId) => {
    const response = await apiClient.post(API_ENDPOINTS.BAN_USER(userId));
    return response.data;
  },

  /**
   * Unban user (admin only)
   * @param {string} userId - User UUID
   * @returns {Promise}
   */
  unbanUser: async (userId) => {
    const response = await apiClient.post(API_ENDPOINTS.UNBAN_USER(userId));
    return response.data;
  },

  /**
   * Health check for authentication service
   * @returns {Promise}
   */
  healthCheck: async () => {
    const response = await apiClient.get(API_ENDPOINTS.AUTH_HEALTH);
    return response.data;
  },
};

export default authService;

