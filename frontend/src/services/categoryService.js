import api from './api';

export const categoryService = {
  // Get all categories
  async getAllCategories() {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch categories');
    }
  },

  // Get category by ID
  async getCategoryById(id) {
    try {
      const response = await api.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch category');
    }
  },

  // Create new category
  async createCategory(categoryData) {
    try {
      const response = await api.post('/categories', categoryData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create category');
    }
  },

  // Update category
  async updateCategory(id, categoryData) {
    try {
      const response = await api.put(`/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update category');
    }
  },

  // Delete category
  async deleteCategory(id) {
    try {
      await api.delete(`/categories/${id}`);
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete category');
    }
  }
};
