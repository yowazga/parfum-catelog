import api from './api';

export const brandService = {
  // Get all brands
  async getAllBrands() {
    try {
      const response = await api.get('/brands');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch brands');
    }
  },

  // Get brand by ID
  async getBrandById(id) {
    try {
      const response = await api.get(`/brands/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch brand');
    }
  },

  // Create new brand
  async createBrand(brandData) {
    try {
      const response = await api.post('/brands', brandData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create brand');
    }
  },

  // Update brand
  async updateBrand(id, brandData) {
    try {
      const response = await api.put(`/brands/${id}`, brandData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update brand');
    }
  },

  // Delete brand
  async deleteBrand(id) {
    try {
      await api.delete(`/brands/${id}`);
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete brand');
    }
  },

  // Get brands by category
  async getBrandsByCategory(categoryId) {
    try {
      const response = await api.get(`/categories/${categoryId}/brands`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch brands for category');
    }
  }
};
