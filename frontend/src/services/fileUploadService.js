import axios from 'axios';
import { authService } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Create axios instance with auth headers
const createAuthenticatedRequest = () => {
  const token = authService.getToken();
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    }
  };
};

export const fileUploadService = {
  // Upload a file and return the file info
  uploadFile: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const config = createAuthenticatedRequest();
      const response = await axios.post(`${API_BASE_URL}/admin/upload`, formData, config);
      
      if (response.data.success) {
        return {
          success: true,
          filename: response.data.filename,
          url: response.data.url,
          fullUrl: `${API_BASE_URL}${response.data.url}` // Full URL for display
        };
      } else {
        throw new Error(response.data.message || 'Upload failed');
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to upload file'
      );
    }
  },

  // Delete a file
  deleteFile: async (filename) => {
    try {
      const token = authService.getToken();
      const response = await axios.delete(`${API_BASE_URL}/admin/files/${filename}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('File delete error:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to delete file'
      );
    }
  },

  // Get full URL for a file
  getFileUrl: (filename) => {
    if (!filename) return null;
    
    // If it's already a full URL (starts with http), return as is
    if (filename.startsWith('http')) {
      return filename;
    }
    
    // Otherwise, construct the full URL (assumes just filename)
    return `${API_BASE_URL}/files/${filename}`;
  },

  // Validate file before upload
  validateFile: (file) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    if (!file) {
      throw new Error('No file selected');
    }
    
    if (file.size > maxSize) {
      throw new Error('File size must be less than 10MB');
    }
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed');
    }
    
    return true;
  }
};
