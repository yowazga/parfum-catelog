import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { useNotifications } from '../contexts/NotificationContext';
import { exportToCSV, exportToJSON, exportToExcel } from '../utils/exportUtils';
import { importFromCSV, importFromJSON } from '../utils/importUtils';
import { useData } from '../contexts/DataContext';
import { brandService } from '../services/brandService';
import { fileUploadService } from '../services/fileUploadService';

const BrandManagement = () => {
  const { brandId } = useParams();
  const navigate = useNavigate();
  const { data, updateData, fetchDataFromAPI } = useData();
  const [brandsList, setBrandsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    imageUrl: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imageUploadMethod, setImageUploadMethod] = useState('upload'); // 'upload' or 'url'
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrands, setSelectedBrands] = useState(new Set());
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null); // Used in import modal display
  const [importPreview, setImportPreview] = useState(null);
  const [importErrors, setImportErrors] = useState([]);
  const exportMenuRef = useRef();
  const { addNotification } = useNotifications();

  // If brandId is provided, show perfumes for that specific brand
  const currentBrand = brandId ? (brandsList || []).find(brand => brand.id === brandId) : null;

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getAllBrands = useCallback(() => {
    // Extract brands from all categories and flatten them
    const allBrands = (data.categories || []).flatMap(category => 
      (category.brands || []).map(brand => ({
        ...brand,
        categoryId: category.id,
        categoryName: category.name
      }))
    );
    setBrandsList(allBrands);
  }, [data.categories]);

  useEffect(() => {
    getAllBrands();
    setCategoriesList(data.categories || []);
  }, [data.categories, getAllBrands]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image upload method change
  const handleImageMethodChange = (method) => {
    setImageUploadMethod(method);
    setImageFile(null);
    setFormData(prev => ({ ...prev, imageUrl: '' }));
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      try {
        fileUploadService.validateFile(file);
        setImageFile(file);
        
        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setFormData(prev => ({ ...prev, imageUrl: previewUrl }));
        
        addNotification('File Selected', `File "${file.name}" selected successfully!`, { type: 'success' });
      } catch (error) {
        addNotification('File Error', error.message, { type: 'error' });
        e.target.value = ''; // Clear the input
      }
    }
  };

  // Handle URL input
  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({
      ...prev,
      imageUrl: url
    }));
  };

  // Validate image URL
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

  // Upload file and get URL
  const uploadImageFile = async () => {
    if (!imageFile) return null;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      addNotification('Upload Status', 'Uploading image...', { type: 'info' });
      const result = await fileUploadService.uploadFile(imageFile);
      setUploadProgress(100);
      addNotification('Upload Success', 'Image uploaded successfully!', { type: 'success' });
      // Store only the filename in the database, not the full path
      return result.filename; // Return just the filename for storage
    } catch (error) {
      addNotification('Upload Error', error.message, { type: 'error' });
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    
    if (!formData.name || !formData.description || !formData.categoryId) {
      addNotification('Validation Error', 'Please fill in all required fields', { type: 'error' });
      return;
    }

    // Validate based on upload method
    if (imageUploadMethod === 'url' && formData.imageUrl && !isValidImageUrl(formData.imageUrl)) {
      addNotification('URL Error', 'Please enter a valid image URL', { type: 'error' });
      return;
    }

    let finalImageUrl = formData.imageUrl;

    // Handle file upload if a file is selected
    if (imageUploadMethod === 'upload' && imageFile) {
      try {
        finalImageUrl = await uploadImageFile();
      } catch (error) {
        return; // Error already handled in uploadImageFile
      }
    }

    try {
      const brandData = {
        ...formData,
        imageUrl: finalImageUrl
      };
      
      if (editingBrand) {
        // Update existing brand via API
        const updatedBrand = await brandService.updateBrand(editingBrand.id, brandData);
        
        // Update local state
        const updatedBrands = brandsList.map(brand => 
          brand.id === editingBrand.id 
            ? { 
                ...updatedBrand,
                categoryName: (categoriesList || []).find(cat => cat.id === updatedBrand.categoryId)?.name || 'Unknown'
              }
            : brand
        );
        setBrandsList(updatedBrands);
        
        addNotification('Brand Updated', 'Brand updated successfully!', { type: 'success' });
      } else {
        // Create new brand via API
        const newBrand = await brandService.createBrand(brandData);
        
        // Add to local state
        const brandWithCategoryName = {
          ...newBrand,
          categoryName: (categoriesList || []).find(cat => cat.id === newBrand.categoryId)?.name || 'Unknown'
        };
        setBrandsList(prev => [...prev, brandWithCategoryName]);
        
        addNotification('Brand Created', 'Brand created successfully!', { type: 'success' });
      }

      // Refresh data from API to ensure consistency
      await fetchDataFromAPI();
      
    } catch (error) {
      addNotification('Save Error', error.message || 'Failed to save brand', { type: 'error' });
    }

    handleCloseForm();
  };

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      description: brand.description,
      categoryId: brand.categoryId,
      imageUrl: brand.imageUrl || ''
    });
    // Reset file upload states when editing
    setImageFile(null);
    setImageUploadMethod(brand.imageUrl ? 'url' : 'upload');
    setUploadProgress(0);
    setIsUploading(false);
    setShowAddForm(true);
  };

  const handleDelete = async (brandId) => {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      try {
        // Delete via API
        await brandService.deleteBrand(brandId);
        
        // Update local state
        setBrandsList(prev => prev.filter(brand => brand.id !== brandId));
        setSelectedBrands(prev => {
          const newSet = new Set(prev);
          newSet.delete(brandId);
          return newSet;
        });
        
        // Refresh data from API to ensure consistency
        await fetchDataFromAPI();
        
        addNotification('Brand Deleted', 'Brand deleted successfully!', { type: 'success' });
      } catch (error) {
        addNotification('Delete Error', error.message || 'Failed to delete brand', { type: 'error' });
      }
    }
  };

  const handleCancel = () => {
    handleCloseForm();
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditingBrand(null);
    setFormData({
      name: '',
      description: '',
      categoryId: '',
      imageUrl: ''
    });
    setImageFile(null);
    setImageUploadMethod('upload');
    setUploadProgress(0);
    setIsUploading(false);
  };

  const handleBulkSelect = (brandId) => {
    setSelectedBrands(prev => {
      const newSet = new Set(prev);
      if (newSet.has(brandId)) {
        newSet.delete(brandId);
      } else {
        newSet.add(brandId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedBrands.size === filteredBrands.length) {
      setSelectedBrands(new Set());
    } else {
      setSelectedBrands(new Set(filteredBrands.map(brand => brand.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedBrands.size === 0) {
              addNotification('Selection Required', 'Please select brands to delete', { type: 'warning' });
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedBrands.size} brands?`)) {
      try {
        // Delete all selected brands via API
        const deletePromises = Array.from(selectedBrands).map(brandId => 
          brandService.deleteBrand(brandId)
        );
        await Promise.all(deletePromises);
        
        // Update local state
        setBrandsList(prev => prev.filter(brand => !selectedBrands.has(brand.id)));
        setSelectedBrands(new Set());
        
        // Refresh data from API to ensure consistency
        await fetchDataFromAPI();
        
        addNotification('Bulk Delete Success', `${selectedBrands.size} brands deleted successfully!`, { type: 'success' });
      } catch (error) {
        addNotification('Bulk Delete Error', error.message || 'Failed to delete some brands', { type: 'error' });
      }
    }
  };

  const handleBulkMove = (newCategoryId) => {
    if (selectedBrands.size === 0) {
              addNotification('Selection Required', 'Please select brands to move', { type: 'warning' });
      return;
    }

    const newCategory = (categoriesList || []).find(cat => cat.id === newCategoryId);
    if (!newCategory) {
              addNotification('Category Error', 'Invalid category selected', { type: 'error' });
      return;
    }

    setBrandsList(prev => prev.map(brand => 
      selectedBrands.has(brand.id) 
        ? { ...brand, categoryId: newCategoryId, categoryName: newCategory.name }
        : brand
    ));
    setSelectedBrands(new Set());
            addNotification('Move Success', `${selectedBrands.size} brands moved to ${newCategory.name}!`, { type: 'success' });
  };

  const handleExport = (format) => {
    try {
      const data = filteredBrands.map(brand => ({
        id: brand.id,
        name: brand.name,
        description: brand.description,
        category: brand.categoryName,
        imageUrl: brand.imageUrl,
        perfumesCount: (brand.perfumes || []).length
      }));

      switch (format) {
        case 'csv':
          exportToCSV(data, 'brands');
          break;
        case 'json':
          exportToJSON(data, 'brands');
          break;
        case 'excel':
          exportToExcel(data, 'brands');
          break;
        default:
          addNotification('Export Error', 'Invalid export format', { type: 'error' });
          return;
      }

              addNotification('Export Success', `Brands exported to ${format.toUpperCase()} successfully!`, { type: 'success' });
      setShowExportMenu(false);
    } catch (error) {
              addNotification('Export Error', 'Export failed: ' + error.message, { type: 'error' });
    }
  };

  const handleImport = async (file) => {
    try {
      setImportFile(file);
      setImportErrors([]);
      
      let importedData;
      if (file.name.endsWith('.csv')) {
        importedData = await importFromCSV(file);
      } else if (file.name.endsWith('.json')) {
        importedData = await importFromJSON(file);
      } else {
        addNotification('File Format Error', 'Unsupported file format. Please use CSV or JSON.', { type: 'error' });
        return;
      }

      setImportPreview(importedData);
    } catch (error) {
      addNotification('Import Error', 'Import failed: ' + error.message, { type: 'error' });
    }
  };

  const confirmImport = () => {
    if (!importPreview) return;

    try {
      const newBrands = importPreview.map(item => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: item.name || item.brand || '',
        description: item.description || item.desc || '',
        categoryId: item.categoryId || item.category || '',
        categoryName: item.category || item.categoryName || 'Uncategorized',
        imageUrl: item.imageUrl || item.image || '',
        perfumes: []
      }));

      setBrandsList(prev => [...prev, ...newBrands]);
      setShowImportModal(false);
      setImportFile(null);
      setImportPreview(null);
      setImportErrors([]);
      addNotification('Import Success', `${newBrands.length} brands imported successfully!`, { type: 'success' });
    } catch (error) {
      addNotification('Import Error', 'Import failed: ' + error.message, { type: 'error' });
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleImport(file);
    }
  };



  const getFilteredBrands = () => {
    return (brandsList || []).filter(brand => {
      const matchesSearch = (brand.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (brand.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || brand.categoryId === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  };

  const filteredBrands = getFilteredBrands();



  // If we're viewing a specific brand's perfumes, show that view
  if (currentBrand) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate('/admin/brands')}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Perfumes in {currentBrand.name}</h1>
                  <p className="mt-2 text-sm text-gray-600">
                    Manage perfumes within the {currentBrand.name} brand.
                  </p>
                </div>
              </div>
            </div>
            <Link
              to="/admin/perfumes"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              View All Perfumes
            </Link>
          </div>

          {/* Perfumes List */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Perfumes in {currentBrand.name} ({(currentBrand.perfumes || []).length})
              </h3>
              {(currentBrand.perfumes || []).length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No perfumes in this brand</h3>
                  <p className="mt-1 text-sm text-gray-500">Add some perfumes to get started.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {(currentBrand.perfumes || []).map((perfume) => (
                    <div key={perfume.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-gray-900">{perfume.name}</h4>
                          <p className="text-sm text-gray-600 mb-3">{perfume.description}</p>
                          <div className="flex space-x-4 text-sm text-gray-500">
                            <span>${perfume.price}</span>
                            <span>{perfume.size}ml</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Brand Management</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25 transition-all duration-200"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Brand
          </button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              {editingBrand ? 'Edit Brand' : 'Add New Brand'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                    placeholder="Enter brand name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                    required
                  >
                    <option value="">Select a category</option>
                    {(categoriesList || []).map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                  placeholder="Enter brand description"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Brand Image
                </label>
                
                {/* Upload Method Selection */}
                <div className="flex mb-4 p-1 bg-slate-100 rounded-lg">
                  <button
                    type="button"
                    onClick={() => handleImageMethodChange('upload')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      imageUploadMethod === 'upload'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    📁 Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => handleImageMethodChange('url')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      imageUploadMethod === 'url'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    🔗 Use URL
                  </button>
                </div>

                {/* File Upload */}
                {imageUploadMethod === 'upload' && (
                  <div>
                    <div className="border-2 border-dashed border-blue-300 rounded-xl p-6 text-center bg-blue-50">
                      <div className="text-blue-600 mb-3">
                        📁 <span className="text-lg font-medium">Select Image File</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 cursor-pointer"
                      />
                      {imageFile && (
                        <div className="mt-3 text-green-600 font-medium">
                          ✅ Selected: {imageFile.name}
                        </div>
                      )}
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      Select an image file (JPEG, PNG, GIF, WebP). Max size: 10MB
                    </p>
                    
                    {isUploading && (
                      <div className="mt-3">
                        <div className="bg-blue-100 rounded-lg p-3">
                          <div className="flex items-center justify-between text-sm text-blue-800 mb-2">
                            <span>Uploading...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <div className="w-full bg-blue-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* URL Input */}
                {imageUploadMethod === 'url' && (
                  <div>
                    <input
                      type="url"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleImageUrlChange}
                      placeholder="https://example.com/image.jpg"
                      className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm ${
                        formData.imageUrl && !isValidImageUrl(formData.imageUrl) 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-slate-300'
                      }`}
                    />
                    {formData.imageUrl && !isValidImageUrl(formData.imageUrl) && (
                      <p className="mt-1 text-sm text-red-600">Please enter a valid image URL</p>
                    )}
                    <p className="mt-1 text-xs text-slate-500">
                      Enter a direct link to an image or use free images from Unsplash, Pexels, etc.
                    </p>
                  </div>
                )}

                {/* Image Preview */}
                {formData.imageUrl && (
                  <div className="mt-3">
                    <img 
                      src={formData.imageUrl} 
                      alt="Preview" 
                      className="w-32 h-32 object-cover rounded-xl border border-slate-200 shadow-md"
                      onError={(e) => { e.target.style.display = 'none'; }}
                      onLoad={(e) => { e.target.style.display = 'block'; }}
                    />
                  </div>
                )}
              </div>
              
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25 transition-all duration-200"
                >
                  {editingBrand ? 'Update Brand' : 'Create Brand'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Brands List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20">
          <div className="p-8">
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search brands..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                />
              </div>
              <div className="flex gap-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                >
                  <option value="">All Categories</option>
                  {categoriesList.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                
                {/* Export Menu */}
                <div className="relative" ref={exportMenuRef}>
                  <button
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    className="px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-sm font-semibold hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/25 transition-all duration-200"
                  >
                    Export
                  </button>
                  {showExportMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 z-10">
                      <button
                        onClick={() => handleExport('csv')}
                        className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-t-xl"
                      >
                        Export to CSV
                      </button>
                      <button
                        onClick={() => handleExport('json')}
                        className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        Export to JSON
                      </button>
                      <button
                        onClick={() => handleExport('excel')}
                        className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-b-xl"
                      >
                        Export to Excel
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Import Button */}
                <button
                  onClick={() => setShowImportModal(true)}
                  className="px-4 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl text-sm font-semibold hover:from-orange-700 hover:to-red-700 shadow-lg shadow-orange-500/25 transition-all duration-200"
                >
                  Import
                </button>
              </div>
            </div>

            {/* Bulk Operations */}
            {selectedBrands.size > 0 && (
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-blue-800">
                      {selectedBrands.size} brand{selectedBrands.size !== 1 ? 's' : ''} selected
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <select
                      onChange={(e) => handleBulkMove(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-sm"
                    >
                      <option value="">Move to category...</option>
                      {(categoriesList || []).map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleBulkDelete}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
                    >
                      Delete Selected
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Import Modal */}
            {showImportModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Import Brands</h3>
                  
                                     <div className="mb-6">
                     <input
                       type="file"
                       accept=".csv,.json"
                       onChange={handleFileChange}
                       className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     />
                     {importFile && (
                       <p className="text-sm text-slate-600 mt-2">
                         Selected file: <span className="font-semibold">{importFile.name}</span>
                       </p>
                     )}
                     <p className="text-sm text-slate-600 mt-2">
                       Supported formats: CSV, JSON. Make sure your file has columns for name, description, and category.
                     </p>
                   </div>

                  {importPreview && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-slate-900 mb-2">Preview ({importPreview.length} items):</h4>
                      <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-lg p-3">
                        {importPreview.slice(0, 5).map((item, index) => (
                          <div key={index} className="text-sm text-slate-700 py-1">
                            <strong>{item.name || item.brand || 'No name'}</strong> - {item.description || item.desc || 'No description'}
                          </div>
                        ))}
                        {importPreview.length > 5 && (
                          <div className="text-sm text-slate-500 italic">
                            ... and {importPreview.length - 5} more items
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {importErrors.length > 0 && (
                    <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <h4 className="font-semibold text-red-800 mb-2">Import Errors:</h4>
                      <ul className="text-sm text-red-700 space-y-1">
                        {importErrors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setShowImportModal(false)}
                      className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmImport}
                      disabled={!importPreview || importErrors.length > 0}
                      className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Import Brands
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Brands Grid */}
            {filteredBrands.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                  <svg className="h-10 w-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No brands found</h3>
                <p className="text-slate-600 mb-6">Get started by creating your first brand.</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25 transition-all duration-200"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add First Brand
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Select All Checkbox */}
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <input
                    type="checkbox"
                    checked={selectedBrands.size === filteredBrands.length && filteredBrands.length > 0}
                    onChange={handleSelectAll}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-slate-300 rounded-lg"
                  />
                  <label className="text-sm font-semibold text-slate-700">
                    Select All ({filteredBrands.length} brands)
                  </label>
                </div>

                {/* Brands Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBrands.map(brand => (
                    <div key={brand.id} className="group bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                      <div className="p-6">
                        {/* Brand Selection Checkbox */}
                        <div className="flex items-start justify-between mb-4">
                          <input
                            type="checkbox"
                            checked={selectedBrands.has(brand.id)}
                            onChange={() => handleBulkSelect(brand.id)}
                            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-slate-300 rounded-lg mt-1"
                          />
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button
                              onClick={() => handleEdit(brand)}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(brand.id)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <h4 className="text-xl font-bold text-slate-900">{brand.name}</h4>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200">
                              {brand.categoryName}
                            </span>
                          </div>
                          
                          <p className="text-slate-600 leading-relaxed">{brand.description}</p>
                          
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                              </svg>
                              {(brand.perfumes || []).length} perfumes
                            </span>
                          </div>
                        </div>
                        
                        {brand.imageUrl && (
                          <div className="mt-4">
                            <img 
                              src={fileUploadService.getFileUrl(brand.imageUrl)} 
                              alt={brand.name} 
                              className="w-full h-40 object-cover rounded-xl border border-slate-200 shadow-md"
                            />
                          </div>
                        )}
                      </div>
                      
                      <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-t border-slate-200">
                        <Link
                          to={`/admin/brands/${brand.id}/perfumes`}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          Manage perfumes
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default BrandManagement;
