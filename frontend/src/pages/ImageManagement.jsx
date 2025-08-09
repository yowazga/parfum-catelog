import React, { useState } from 'react';
import { sampleData } from '../data/sampleData';
import AdminLayout from '../components/AdminLayout';

const ImageManagement = () => {
  const [categories, setCategories] = useState(sampleData.categories);
  const [uploadingImage, setUploadingImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageUpload = (e, type, id) => {
    const file = e.target.files[0];
    if (file) {
      // Simulate upload progress
      setUploadingImage({ type, id, fileName: file.name });
      setUploadProgress(0);
      
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            // Simulate successful upload
            const imageUrl = URL.createObjectURL(file);
            
            if (type === 'brand') {
              setCategories(prev => prev.map(cat => ({
                ...cat,
                brands: cat.brands.map(brand => 
                  brand.id === id 
                    ? { ...brand, imageUrl }
                    : brand
                )
              })));
            }
            
            setUploadingImage(null);
            setUploadProgress(0);
            return 0;
          }
          return prev + 10;
        });
      }, 100);
    }
  };

  const handleImageDelete = (type, id) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      if (type === 'brand') {
        setCategories(prev => prev.map(cat => ({
          ...cat,
          brands: cat.brands.map(brand => 
            brand.id === id 
              ? { ...brand, imageUrl: null }
              : brand
          )
        })));
      }
    }
  };

  const getAllBrandsWithImages = () => {
    return categories.reduce((acc, category) => {
      const brandsWithContext = category.brands.map(brand => ({
        ...brand,
        categoryName: category.name,
        categoryId: category.id
      }));
      return [...acc, ...brandsWithContext];
    }, []);
  };

  const brands = getAllBrandsWithImages();
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

        {/* Upload Progress */}
        {uploadingImage && (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">
                  Uploading {uploadingImage.fileName}...
                </div>
                <div className="mt-2">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {uploadProgress}%
              </div>
            </div>
          </div>
        )}

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
                        onClick={() => handleImageDelete('brand', brand.id)}
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
                        src={brand.imageUrl}
                        alt={`${brand.name} logo`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                    <div className="text-xs text-gray-500">
                      <p>Image uploaded successfully</p>
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
                        <label className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          Upload Image
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, 'brand', brand.id)}
                            className="hidden"
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
      </div>
    </AdminLayout>
  );
};

export default ImageManagement;
