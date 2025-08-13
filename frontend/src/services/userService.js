import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Create axios instance with auth token
const createAuthAxios = () => {
  const token = localStorage.getItem('authToken');
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    }
  });
};

export const userService = {
  // Get current user profile
  getCurrentUser: async () => {
    try {
      const authAxios = createAuthAxios();
      const response = await authAxios.get('/admin/users/profile');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get user profile');
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const authAxios = createAuthAxios();
      const response = await authAxios.put('/admin/users/profile', profileData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const authAxios = createAuthAxios();
      const response = await authAxios.put('/admin/users/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to change password');
    }
  },

  // Get all users (admin only)
  getAllUsers: async () => {
    try {
      const authAxios = createAuthAxios();
      const response = await authAxios.get('/admin/users');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get users');
    }
  },

  // Create new user (admin only)
  createUser: async (userData) => {
    try {
      console.log('userService.createUser called with:', userData);
      const authAxios = createAuthAxios();
      console.log('Making POST request to /admin/users');
      
      const response = await authAxios.post('/admin/users', userData);
      console.log('API response received:', response);
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('userService.createUser error:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      throw new Error(error.response?.data?.message || 'Failed to create user');
    }
  },

  // Update user (admin only)
  updateUser: async (userId, userData) => {
    try {
      const authAxios = createAuthAxios();
      const response = await authAxios.put(`/admin/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update user');
    }
  },

  // Delete user (admin only)
  deleteUser: async (userId) => {
    try {
      const authAxios = createAuthAxios();
      const response = await authAxios.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
  }
};

export default userService;
