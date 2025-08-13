// Utility functions for handling images with cache busting

/**
 * Adds cache-busting timestamp to image URLs
 * @param {string} imageUrl - The image URL
 * @returns {string} - Image URL with cache-busting parameter
 */
export const getCacheBustedImageUrl = (imageUrl) => {
  if (!imageUrl) return '';
  
  // If it's already a full URL, add timestamp
  if (imageUrl.startsWith('http')) {
    const separator = imageUrl.includes('?') ? '&' : '?';
    return `${imageUrl}${separator}_t=${Date.now()}`;
  }
  
  // If it's a relative path, construct full URL
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
  const separator = imageUrl.includes('?') ? '&' : '?';
  return `${baseUrl}/files/${imageUrl}${separator}_t=${Date.now()}`;
};

/**
 * Gets image URL for display with cache busting
 * @param {string} filename - The image filename
 * @returns {string} - Full image URL with cache busting
 */
export const getImageUrl = (filename) => {
  if (!filename) return '';
  
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
  return `${baseUrl}/files/${filename}?_t=${Date.now()}`;
};
