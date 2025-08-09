import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sampleData } from '../data/sampleData';
import AdminLayout from '../components/AdminLayout';

const PerfumeManagement = () => {
  const [categories, setCategories] = useState(sampleData.categories);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPerfume, setEditingPerfume] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    brandId: '',
    categoryId: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingPerfume) {
      // Update existing perfume
      setCategories(prev => prev.map(cat => ({
        ...cat,
        brands: cat.brands.map(brand => ({
          ...brand,
          perfumes: brand.perfumes.map(perfume => 
            perfume.id === editingPerfume.id 
              ? { ...perfume, ...formData }
              : perfume
          )
        }))
      })));
      setEditingPerfume(null);
    } else {
      // Add new perfume
      const newPerfume = {
        id: Date.now(),
        ...formData
      };
      
      setCategories(prev => prev.map(cat => 
        cat.id === parseInt(formData.categoryId)
          ? {
              ...cat,
              brands: cat.brands.map(brand => 
                brand.id === parseInt(formData.brandId)
                  ? { ...brand, perfumes: [...brand.perfumes, newPerfume] }
                  : brand
              )
            }
          : cat
      ));
    }
    
    // Reset form
    setFormData({ name: '', number: '', brandId: '', categoryId: '' });
    setShowAddForm(false);
  };

  const handleEdit = (perfume) => {
    setEditingPerfume(perfume);
    setFormData({
      name: perfume.name,
      number: perfume.number,
      brandId: perfume.brandId || '',
      categoryId: perfume.categoryId || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = (perfumeId) => {
    if (window.confirm('Are you sure you want to delete this perfume?')) {
      setCategories(prev => prev.map(cat => ({
        ...cat,
        brands: cat.brands.map(brand => ({
          ...brand,
          perfumes: brand.perfumes.filter(perfume => perfume.id !== perfumeId)
        }))
      })));
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingPerfume(null);
    setFormData({ name: '', number: '', brandId: '', categoryId: '' });
  };

  const getAllPerfumes = () => {
    return categories.reduce((acc, category) => {
      const perfumesWithContext = category.brands.reduce((brandAcc, brand) => {
        const perfumesWithBrand = brand.perfumes.map(perfume => ({
          ...perfume,
          brandName: brand.name,
          categoryName: category.name,
          brandId: brand.id,
          categoryId: category.id
        }));
        return [...brandAcc, ...perfumesWithBrand];
      }, []);
      return [...acc, ...perfumesWithContext];
    }, []);
  };

  const getFilteredPerfumes = () => {
    let perfumes = getAllPerfumes();
    
    // Filter by search term
    if (searchTerm) {
      perfumes = perfumes.filter(perfume => 
        perfume.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        perfume.number.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory) {
      perfumes = perfumes.filter(perfume => perfume.categoryId === parseInt(selectedCategory));
    }
    
    // Filter by brand
    if (selectedBrand) {
      perfumes = perfumes.filter(perfume => perfume.brandId === parseInt(selectedBrand));
    }
    
    return perfumes;
  };

  const perfumes = getFilteredPerfumes();

  const getBrandsByCategory = (categoryId) => {
    const category = categories.find(cat => cat.id === parseInt(categoryId));
    return category ? category.brands : [];
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Perfume Management</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage individual perfumes within each brand. Add, edit, or remove perfumes from your catalog.
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Perfume
          </button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {editingPerfume ? 'Edit Perfume' : 'Add New Perfume'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Perfume Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="e.g., Sauvage, N°5, Bloom"
                  />
                </div>
                <div>
                  <label htmlFor="number" className="block text-sm font-medium text-gray-700">
                    Perfume Number
                  </label>
                  <input
                    type="text"
                    id="number"
                    name="number"
                    required
                    value={formData.number}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="e.g., 001, N°5, 100"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    required
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="brandId" className="block text-sm font-medium text-gray-700">
                    Brand
                  </label>
                  <select
                    id="brandId"
                    name="brandId"
                    required
                    value={formData.brandId}
                    onChange={handleInputChange}
                    disabled={!formData.categoryId}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-50 disabled:text-gray-500"
                  >
                    <option value="">Select a brand</option>
                    {formData.categoryId && getBrandsByCategory(formData.categoryId).map(brand => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  {editingPerfume ? 'Update Perfume' : 'Create Perfume'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Perfumes List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">All Perfumes</h3>
              
              {/* Search and Filter Controls */}
              <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search perfumes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedBrand(''); // Reset brand when category changes
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  disabled={!selectedCategory}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="">All Brands</option>
                  {selectedCategory && getBrandsByCategory(selectedCategory).map(brand => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
                
                {(searchTerm || selectedCategory || selectedBrand) && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('');
                      setSelectedBrand('');
                    }}
                    className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
            
            {perfumes.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No perfumes</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new perfume.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Perfume
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Brand
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {perfumes.map((perfume) => (
                      <tr key={perfume.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{perfume.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{perfume.number}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{perfume.brandName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {perfume.categoryName}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEdit(perfume)}
                              className="text-purple-600 hover:text-purple-900 transition-colors"
                              title="Edit perfume"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(perfume.id)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                              title="Delete perfume"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PerfumeManagement;
