import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import CategorySection from '../components/CategorySection';
import SearchAndFilter from '../components/SearchAndFilter';
import SearchResults from '../components/SearchResults';
import { useData } from '../contexts/DataContext';

const Home = () => {
  const { categories, getAllPerfumes, loading, error } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ brand: '' });
  const [isSearching, setIsSearching] = useState(false);

  // Get all brands for filter dropdown
  const allBrands = useMemo(() => {
    return categories.flatMap(category => category.brands);
  }, [categories]);

  // Filter and search perfumes
  const filteredPerfumes = useMemo(() => {
    let results = getAllPerfumes();

    // Apply search
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      results = results.filter(perfume => 
        perfume.name.toLowerCase().includes(searchLower) ||
        perfume.brandName.toLowerCase().includes(searchLower) ||
        String(perfume.number).includes(searchTerm)
      );
    }

    // Apply brand filter
    if (filters.brand) {
      results = results.filter(perfume => perfume.brandName === filters.brand);
    }

    return results;
  }, [searchTerm, filters, getAllPerfumes]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setIsSearching(term.trim().length > 0 || filters.brand);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setIsSearching(searchTerm.trim().length > 0 || newFilters.brand);
  };

  const handleBackToCategories = () => {
    setSearchTerm('');
    setFilters({ brand: '' });
    setIsSearching(false);
  };

  const totalPerfumes = getAllPerfumes().length;

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading perfume catalog...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="text-red-500 mb-4">
              <svg className="h-16 w-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Catalog</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Your Signature Scent
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Explore our curated collection of luxury fragrances organized by categories and brands.
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <SearchAndFilter 
        onSearch={handleSearch}
        onFilter={handleFilter}
        brands={allBrands}
        totalPerfumes={totalPerfumes}
      />

      {/* Content Section */}
      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {isSearching ? (
            // Show search results
            <SearchResults 
              results={filteredPerfumes} 
              searchTerm={searchTerm}
              onBackToCategories={handleBackToCategories}
            />
          ) : (
            // Show categories
            <>
              {categories.map(category => (
                <CategorySection key={category.id} category={category} />
              ))}
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Aromaluxe Parfum</h3>
            <p className="text-gray-400 mb-6">
              Your destination for luxury fragrances
            </p>
            <div className="text-sm text-gray-500">
              © 2024 AromaLuxe Parfum Catalog. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
