import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useNotifications } from '../contexts/NotificationContext';
import { brandService } from '../services/brandService';
import { fileUploadService } from '../services/fileUploadService';
import AdminLayout from '../components/AdminLayout';

const ImageManagement = () => {
  const { categories, getAllBrands, fetchDataFromAPI } = useData();
  const { addNotification } = useNotifications();
  const [editingImageUrl, setEditingImageUrl] = useState('');
  const [editingBrandId, setEditingBrandId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageUploadMethod, setImageUploadMethod] = useState('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Handle file selection
  const handleFileSelect = (e, brandId) => {
    const file = e.target.files[0];
    if (file) {
      try {
        fileUploadService.validateFile(file);
        setImageFile(file);
        uploadAndUpdateBrand(file, brandId);
      } catch (error) {
        addNotification('File Error', error.message, { type: 'error' });
        e.target.value = ''; // Clear the input
      }
    }
  };

  // Upload file and update brand
  const uploadAndUpdateBrand = async (file, brandId) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      addNotification('Upload Status', 'Uploading image...', { type: 'info' });
      const result = await fileUploadService.uploadFile(file);
      setUploadProgress(100);
      
      // Update the brand with the new image filename (not URL)
      await handleImageUpdate(brandId, result.filename);
      addNotification('Upload Success', 'Image uploaded and updated successfully!', { type: 'success' });
    } catch (error) {
      addNotification('Upload Error', error.message, { type: 'error' });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setImageFile(null);
    }
  };

  const handleImageUpdate = async (brandId, newImageUrl) => {
    try {
      // Update via API
      const brand = getAllBrands().find(b => b.id === brandId);
      if (!brand) return;

      const brandData = {
        name: brand.name,
        description: brand.description,
        categoryId: brand.categoryId,
        imageUrl: newImageUrl || null
      };

      await brandService.updateBrand(brandId, brandData);
      
      // Refresh data
      await fetchDataFromAPI();
      
      // Reset editing state
      setEditingBrandId(null);
      setEditingImageUrl('');
      
      addNotification(
        'Update Success',
        newImageUrl ? 'Image updated successfully!' : 'Image removed successfully!', 
        { type: 'success' }
      );
    } catch (error) {
      addNotification('Update Error', error.message || 'Failed to update image', { type: 'error' });
    }
  };

  const isValidImageUrl = (url) => {
    if (!url) return true; // Empty is valid
    try {
      const urlObj = new URL(url);
      return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(urlObj.pathname) || 
             url.includes('unsplash.com') || 
             url.includes('pexels.com') ||
             url.includes('pixabay.com') ||
             url.includes('githubusercontent.com');
    } catch {
      return false;
    }
  };

  const handleImageDelete = async (brandId) => {
    if (window.confirm('Are you sure you want to remove this image?')) {
      await handleImageUpdate(brandId, null);
    }
  };

  const brands = getAllBrands();
  const brandsWithImages = brands.filter(brand => brand.imageUrl);
  const brandsWithoutImages = brands.filter(brand => !brand.imageUrl);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Image Management</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage images for your perfume brands. Upload, organize, and maintain brand visual identity.
          </p>
        </div>

        {/* Image Management Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Image Management</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>Manage brand images by adding or updating image URLs. Use high-quality images from Unsplash, Pexels, or direct URLs to JPG, PNG, GIF, WebP, or SVG files.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Brands with Images */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Brands with Images ({brandsWithImages.length})
            </h3>
            {brandsWithImages.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No images uploaded</h3>
                <p className="mt-1 text-sm text-gray-500">Start by uploading images for your brands.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {brandsWithImages.map((brand) => (
                  <div key={brand.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{brand.name}</h4>
                        <p className="text-sm text-gray-500">{brand.categoryName}</p>
                      </div>
                      <button
                        onClick={() => handleImageDelete(brand.id)}
                        className="p-1 text-red-400 hover:text-red-600 transition-colors"
                        title="Delete image"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <div className="aspect-w-1 aspect-h-1 mb-3">
                      <img
                        src={fileUploadService.getFileUrl(brand.imageUrl)}
                        alt={`${brand.name} logo`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        <p>Image uploaded successfully</p>
                      </div>
                      <label className="cursor-pointer inline-flex items-center px-2 py-1 border border-blue-300 rounded text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        📁 Upload New
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileSelect(e, brand.id)}
                          className="hidden"
                          disabled={isUploading}
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Brands without Images */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Brands without Images ({brandsWithoutImages.length})
            </h3>
            {brandsWithoutImages.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-sm text-gray-500">
                  <p>All brands have images uploaded! 🎉</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {brandsWithoutImages.map((brand) => (
                  <div key={brand.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{brand.name}</h4>
                        <p className="text-sm text-gray-500">{brand.categoryName}</p>
                      </div>
                      <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="text-sm text-gray-600">
                        <p>{brand.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className="cursor-pointer inline-flex items-center px-3 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          📁 Upload Image
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileSelect(e, brand.id)}
                            className="hidden"
                            disabled={isUploading}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Image Guidelines */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Image Upload Guidelines</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Recommended format: PNG, JPG, or SVG</li>
                  <li>Optimal size: 300x300 pixels or larger</li>
                  <li>File size: Maximum 5MB</li>
                  <li>Transparent backgrounds work best for logos</li>
                  <li>High resolution images will be automatically optimized</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Upload Progress */}
        {isUploading && (
          <div className="fixed bottom-4 right-4 bg-blue-100 rounded-lg p-4 shadow-lg border border-blue-200">
            <div className="flex items-center justify-between text-sm text-blue-800 mb-2">
              <span>Uploading image...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-64 bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ImageManagement;
