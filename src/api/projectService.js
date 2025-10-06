import { apiClient, API_ENDPOINTS } from '../Context';

/**
 * Project Service
 * Contains all project-related API calls
 */

export const projectService = {
  /**
   * Get list of projects for current user
   * @param {Object} params - Query parameters
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.size=50] - Page size
   * @param {string} [params.search] - Search query
   * @returns {Promise} ProjectListResponse with projects array
   */
  listProjects: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.PROJECTS, { params });
    return response.data;
  },

  /**
   * Create a new project
   * @param {Object} projectData - Project creation data
   * @param {string} projectData.name - Project name (required)
   * @param {string} [projectData.description] - Project description
   * @returns {Promise} Created project object
   */
  createProject: async (projectData) => {
    const response = await apiClient.post(API_ENDPOINTS.PROJECTS, projectData);
    return response.data;
  },

  /**
   * Get project by ID
   * @param {string} projectId - Project UUID
   * @returns {Promise} Project object
   */
  getProjectById: async (projectId) => {
    const response = await apiClient.get(API_ENDPOINTS.PROJECT_BY_ID(projectId));
    return response.data;
  },

  /**
   * Update project
   * @param {string} projectId - Project UUID
   * @param {Object} projectData - Project update data
   * @returns {Promise} Updated project object
   */
  updateProject: async (projectId, projectData) => {
    const response = await apiClient.patch(API_ENDPOINTS.PROJECT_BY_ID(projectId), projectData);
    return response.data;
  },

  /**
   * Delete project
   * @param {string} projectId - Project UUID
   * @returns {Promise}
   */
  deleteProject: async (projectId) => {
    const response = await apiClient.delete(API_ENDPOINTS.PROJECT_BY_ID(projectId));
    return response.data;
  },

  /**
   * Get project statistics
   * @param {string} projectId - Project UUID
   * @returns {Promise} Project statistics
   */
  getProjectStats: async (projectId) => {
    const response = await apiClient.get(API_ENDPOINTS.PROJECT_STATS(projectId));
    return response.data;
  },
};

export default projectService;

