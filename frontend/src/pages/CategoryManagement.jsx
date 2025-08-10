import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { categoryService } from '../services/categoryService';
import AdminLayout from '../components/AdminLayout';

const CategoryManagement = () => {
  const { categories, updateData } = useData();
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editingId) {
        // Update existing category
        const updatedCategory = await categoryService.updateCategory(editingId, formData);
        
        // Update local state
        const updatedCategories = categories.map(cat => 
          cat.id === editingId ? { ...cat, ...updatedCategory } : cat
        );
        updateData({ categories: updatedCategories });
        
        setEditingId(null);
      } else {
        // Create new category
        const newCategory = await categoryService.createCategory(formData);
        
        // Update local state
        const updatedCategories = [...categories, newCategory];
        updateData({ categories: updatedCategories });
      }
      
      setFormData({ name: '', description: '' });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      description: category.description || ''
    });
    setEditingId(category.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? This will also delete all associated brands and perfumes.')) {
      try {
        await categoryService.deleteCategory(id);
        
        // Update local state
        const updatedCategories = categories.filter(cat => cat.id !== id);
        updateData({ categories: updatedCategories });
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', description: '' });
    setEditingId(null);
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Category Management
            </h1>
            <p className="text-gray-600">
              Manage perfume categories. Each category can contain multiple brands.
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {editingId ? 'Edit Category' : 'Add New Category'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., Men's Fragrances"
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Brief description of the category"
                  />
                </div>
              </div>
              
              {error && (
                <div className="text-red-600 text-sm">
                  {error}
                </div>
              )}
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (editingId ? 'Update Category' : 'Add Category')}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Categories List */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Existing Categories ({categories.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {categories.map((category) => (
                <div key={category.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                    {category.description && (
                      <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                    )}
                    <p className="text-sm text-gray-400 mt-1">
                      {category.brands?.length || 0} brands
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {categories.length === 0 && (
                <div className="px-6 py-8 text-center text-gray-500">
                  No categories found. Add your first category above.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CategoryManagement;
