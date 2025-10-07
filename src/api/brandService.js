import { apiClient, API_ENDPOINTS } from '../Context';

/**
 * Brand Design Service
 * Contains all brand design-related API calls
 */

export const brandService = {
  /**
   * Get brand design configuration
   * @returns {Promise} Brand design data
   */
  getBrandDesign: async () => {
    const response = await apiClient.get(API_ENDPOINTS.GET_BRAND_DESIGN);
    return response.data;
  },

  /**
   * Upload/Update brand design configuration
   * @param {Object} brandData - Brand design data
   * @param {string} brandData.brandName - Brand name
   * @param {string} brandData.logoUrl - Logo URL or base64
   * @param {Object} brandData.colors - Color palette
   * @param {string} brandData.colors.primary - Primary color
   * @param {string} brandData.colors.secondary - Secondary color
   * @param {string} brandData.colors.accent - Accent color
   * @param {string} brandData.colors.background - Background color
   * @param {string} brandData.colors.foreground - Foreground color
   * @param {string} brandData.fontFamily - Font family
   * @param {string} brandData.brandVoice - Brand voice/tagline
   * @param {string} brandData.tone - Brand tone
   * @returns {Promise} Uploaded brand design data
   */
  uploadBrandDesign: async (brandData) => {
    const response = await apiClient.post(API_ENDPOINTS.UPLOAD_BRAND_DESIGN, brandData);
    return response.data;
  },
};

export default brandService;

