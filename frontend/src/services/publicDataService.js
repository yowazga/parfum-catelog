import axios from 'axios';

// Create axios instance for public endpoints (no auth required)
const publicApi = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const publicDataService = {
  // Get public categories for home page
  async getPublicCategories() {
    try {
      const response = await publicApi.get('/public/categories');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch categories');
    }
  },

  // Get public brands for home page
  async getPublicBrands() {
    try {
      const response = await publicApi.get('/public/brands');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch brands');
    }
  },

  // Get public perfumes for home page
  async getPublicPerfumes() {
    try {
      const response = await publicApi.get('/public/perfumes');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch perfumes');
    }
  }
};
