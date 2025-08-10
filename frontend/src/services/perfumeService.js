import api from './api';

export const perfumeService = {
  // Get all perfumes
  async getAllPerfumes() {
    try {
      const response = await api.get('/perfumes');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch perfumes');
    }
  },

  // Get perfume by ID
  async getPerfumeById(id) {
    try {
      const response = await api.get(`/perfumes/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch perfume');
    }
  },

  // Create new perfume
  async createPerfume(perfumeData) {
    try {
      const response = await api.post('/perfumes', perfumeData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create perfume');
    }
  },

  // Update perfume
  async updatePerfume(id, perfumeData) {
    try {
      const response = await api.put(`/perfumes/${id}`, perfumeData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update perfume');
    }
  },

  // Delete perfume
  async deletePerfume(id) {
    try {
      await api.delete(`/perfumes/${id}`);
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete perfume');
    }
  },

  // Get perfumes by brand
  async getPerfumesByBrand(brandId) {
    try {
      const response = await api.get(`/brands/${brandId}/perfumes`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch perfumes for brand');
    }
  },

  // Search perfumes
  async searchPerfumes(query) {
    try {
      const response = await api.get('/perfumes/search', { params: { q: query } });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search perfumes');
    }
  }
};
