import api from './api';

export const authService = {
  // Login user
  async login(username, password) {
    try {
      const response = await api.post('/auth/login', { username, password });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  // Register user
  async register(username, password) {
    try {
      const response = await api.post('/auth/register', { username, password });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  // Validate token
  async validateToken() {
    try {
      const response = await api.get('/auth/validate');
      return response.data;
    } catch {
      return false;
    }
  },

  // Logout user
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminUser');
  },

  // Get current auth token
  getToken() {
    return localStorage.getItem('authToken');
  }
};
