import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import CategorySection from '../components/CategorySection';
import SearchAndFilter from '../components/SearchAndFilter';
import SearchResults from '../components/SearchResults';
import { sampleData, getAllPerfumes } from '../data/sampleData';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ brand: '', numberRange: { min: '', max: '' } });
  const [isSearching, setIsSearching] = useState(false);

  // Get all brands for filter dropdown
  const allBrands = useMemo(() => {
    return sampleData.categories.flatMap(category => category.brands);
  }, []);

  // Filter and search perfumes
  const filteredPerfumes = useMemo(() => {
    let results = getAllPerfumes();

    // Apply search
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      results = results.filter(perfume => 
        perfume.name.toLowerCase().includes(searchLower) ||
        perfume.brandName.toLowerCase().includes(searchLower) ||
        perfume.number.includes(searchTerm)
      );
    }

    // Apply brand filter
    if (filters.brand) {
      results = results.filter(perfume => perfume.brandName === filters.brand);
    }

    // Apply number range filter
    if (filters.numberRange.min || filters.numberRange.max) {
      results = results.filter(perfume => {
        const number = parseInt(perfume.number);
        const min = filters.numberRange.min ? parseInt(filters.numberRange.min) : 0;
        const max = filters.numberRange.max ? parseInt(filters.numberRange.max) : Infinity;
        return number >= min && number <= max;
      });
    }

    return results;
  }, [searchTerm, filters]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setIsSearching(term.trim().length > 0 || Object.values(filters).some(f => 
      typeof f === 'string' ? f : Object.values(f).some(v => v)
    ));
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setIsSearching(searchTerm.trim().length > 0 || Object.values(newFilters).some(f => 
      typeof f === 'string' ? f : Object.values(f).some(v => v)
    ));
  };

  const handleBackToCategories = () => {
    setSearchTerm('');
    setFilters({ brand: '', numberRange: { min: '', max: '' } });
    setIsSearching(false);
  };

  const totalPerfumes = getAllPerfumes().length;

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
              {sampleData.categories.map(category => (
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
            <h3 className="text-2xl font-bold mb-4">Parfum Catalog</h3>
            <p className="text-gray-400 mb-6">
              Your destination for luxury fragrances
            </p>
            <div className="text-sm text-gray-500">
              © 2024 Parfum Catalog. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
