import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { publicDataService } from '../services/publicDataService';

const initialData = {
  categories: []
};

const DataContext = createContext();

const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export { useData };

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDataFromAPI = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [categories, brands, perfumes] = await Promise.all([
        publicDataService.getPublicCategories(),
        publicDataService.getPublicBrands(),
        publicDataService.getPublicPerfumes()
      ]);

      const organizedCategories = categories.map(category => ({
        ...category,
        brands: brands
          .filter(brand => brand.categoryId === category.id)
          .map(brand => ({
            ...brand,
            perfumes: perfumes.filter(perfume => perfume.brandId === brand.id)
          }))
      }));

      const newData = { categories: organizedCategories };
      setData(newData);
      localStorage.setItem('perfumeCatalogData', JSON.stringify(newData));
    } catch (error) {
      console.error('API fetch failed:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedData = localStorage.getItem('perfumeCatalogData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Check if we have valid data
        if (parsedData && parsedData.categories && parsedData.categories.length > 0) {
          setData(parsedData);
        } else {
          // No valid saved data, fetch from API
          fetchDataFromAPI();
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
        // If there's an error parsing saved data, fetch fresh data
        fetchDataFromAPI();
      }
    } else {
      // No saved data, fetch from API
      fetchDataFromAPI();
    }
  }, [fetchDataFromAPI]);

  useEffect(() => {
    localStorage.setItem('perfumeCatalogData', JSON.stringify(data));
  }, [data]);

  const getCategoryById = (id) => {
    return data.categories.find(category => category.id === id);
  };

  const getBrandById = (id) => {
    for (const category of data.categories) {
      const brand = category.brands.find(brand => brand.id === id);
      if (brand) return brand;
    }
    return null;
  };

  const getAllPerfumes = () => {
    return data.categories.flatMap(category => 
      category.brands.flatMap(brand => 
        brand.perfumes.map(perfume => ({
          ...perfume,
          brandName: brand.name,
          categoryName: category.name,
          brandId: brand.id,
          categoryId: category.id
        }))
      )
    );
  };

  const getAllBrands = () => {
    return data.categories.flatMap(category => 
      category.brands.map(brand => ({
        ...brand,
        categoryName: category.name,
        categoryId: category.id
      }))
    );
  };

  const getAllBrandsWithImages = () => {
    return data.categories.flatMap(category => 
      category.brands.map(brand => ({
        ...brand,
        categoryName: category.name,
        categoryId: category.id
      }))
    );
  };

  const updateData = (newData) => {
    setData(newData);
  };

  const value = {
    data,
    categories: data.categories,
    loading,
    error,
    updateData,
    fetchDataFromAPI,
    getCategoryById,
    getBrandById,
    getAllPerfumes,
    getAllBrands,
    getAllBrandsWithImages
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};