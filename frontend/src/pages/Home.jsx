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
      <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-20 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating Perfume Bottles */}
          <div className="absolute top-20 left-10 animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}}>
            <svg className="w-12 h-12 text-white/20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C10.9 2 10 2.9 10 4V6H8C7.45 6 7 6.45 7 7V21C7 21.55 7.45 22 8 22H16C16.55 22 17 21.55 17 21V7C17 6.45 16.55 6 16 6H14V4C14 2.9 13.1 2 12 2M12 4V6H12V4M9 8H15V20H9V8Z"/>
            </svg>
          </div>

          {/* Floating AromaLuxe Logos - Left Side */}
          <div className="absolute top-32 left-16 animate-bounce" style={{animationDelay: '2.5s', animationDuration: '4.5s'}}>
            <img 
              src="/aromaluxe-logo-white.svg" 
              alt="AromaLuxe" 
              className="w-12 h-12 opacity-10 drop-shadow-md"
            />
          </div>

          <div className="absolute bottom-32 left-8 animate-bounce" style={{animationDelay: '4s', animationDuration: '3.5s'}}>
            <img 
              src="/aromaluxe-logo-white.svg" 
              alt="AromaLuxe" 
              className="w-8 h-8 opacity-10 drop-shadow-sm"
            />
          </div>
          
          <div className="absolute top-32 right-16 animate-bounce" style={{animationDelay: '1s', animationDuration: '4s'}}>
            <svg className="w-16 h-16 text-white/15" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C10.9 2 10 2.9 10 4V6H8C7.45 6 7 6.45 7 7V21C7 21.55 7.45 22 8 22H16C16.55 22 17 21.55 17 21V7C17 6.45 16.55 6 16 6H14V4C14 2.9 13.1 2 12 2M12 4V6H12V4M9 8H15V20H9V8Z"/>
            </svg>
          </div>

          <div className="absolute bottom-20 left-20 animate-bounce" style={{animationDelay: '2s', animationDuration: '3.5s'}}>
            <svg className="w-10 h-10 text-white/25" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C10.9 2 10 2.9 10 4V6H8C7.45 6 7 6.45 7 7V21C7 21.55 7.45 22 8 22H16C16.55 22 17 21.55 17 21V7C17 6.45 16.55 6 16 6H14V4C14 2.9 13.1 2 12 2M12 4V6H12V4M9 8H15V20H9V8Z"/>
            </svg>
          </div>

          {/* Floating AromaLuxe Logo */}
          <div className="absolute top-16 right-20 animate-bounce" style={{animationDelay: '1.5s', animationDuration: '5s'}}>
            <img 
              src="/aromaluxe-logo-white.svg" 
              alt="AromaLuxe" 
              className="w-14 h-14 opacity-20 drop-shadow-lg"
            />
          </div>

          <div className="absolute bottom-24 right-12 animate-bounce" style={{animationDelay: '3s', animationDuration: '4s'}}>
            <img 
              src="/aromaluxe-logo-white.svg" 
              alt="AromaLuxe" 
              className="w-10 h-10 opacity-15 drop-shadow-md"
            />
          </div>

          {/* Floating Sparkles */}
          <div className="absolute top-16 right-32 animate-ping" style={{animationDelay: '0.5s'}}>
            <div className="w-2 h-2 bg-white/30 rounded-full"></div>
          </div>
          
          <div className="absolute top-40 left-32 animate-ping" style={{animationDelay: '1.5s'}}>
            <div className="w-3 h-3 bg-white/20 rounded-full"></div>
          </div>
          
          <div className="absolute bottom-32 right-24 animate-ping" style={{animationDelay: '2.5s'}}>
            <div className="w-2 h-2 bg-white/40 rounded-full"></div>
          </div>

          {/* Floating Fragrance Waves */}
          <div className="absolute top-24 left-1/4 animate-pulse" style={{animationDelay: '0s', animationDuration: '4s'}}>
            <svg className="w-20 h-20 text-white/10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C12.55 2 13 2.45 13 3S12.55 4 12 4 11 3.55 11 3 11.45 2 12 2M12 5C12.55 5 13 5.45 13 6S12.55 7 12 7 11 6.55 11 6 11.45 5 12 5M12 8C12.55 8 13 8.45 13 9S12.55 10 12 10 11 9.55 11 9 11.45 8 12 8M9 11C9.55 11 10 11.45 10 12S9.55 13 9 13 8 12.55 8 12 8.45 11 9 11M15 11C15.55 11 16 11.45 16 12S15.55 13 15 13 14 12.55 14 12 14.45 11 15 11M6 14C6.55 14 7 14.45 7 15S6.55 16 6 16 5 15.55 5 15 5.45 14 6 14M18 14C18.55 14 19 14.45 19 15S18.55 16 18 16 17 15.55 17 15 17.45 14 18 14M3 17C3.55 17 4 17.45 4 18S3.55 19 3 19 2 18.55 2 18 2.45 17 3 17M21 17C21.55 17 22 17.45 22 18S21.55 19 21 19 20 18.55 20 18 20.45 17 21 17"/>
            </svg>
          </div>

          <div className="absolute bottom-16 right-1/3 animate-pulse" style={{animationDelay: '2s', animationDuration: '3s'}}>
            <svg className="w-16 h-16 text-white/8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C12.55 2 13 2.45 13 3S12.55 4 12 4 11 3.55 11 3 11.45 2 12 2M12 5C12.55 5 13 5.45 13 6S12.55 7 12 7 11 6.55 11 6 11.45 5 12 5M12 8C12.55 8 13 8.45 13 9S12.55 10 12 10 11 9.55 11 9 11.45 8 12 8M9 11C9.55 11 10 11.45 10 12S9.55 13 9 13 8 12.55 8 12 8.45 11 9 11M15 11C15.55 11 16 11.45 16 12S15.55 13 15 13 14 12.55 14 12 14.45 11 15 11M6 14C6.55 14 7 14.45 7 15S6.55 16 6 16 5 15.55 5 15 5.45 14 6 14M18 14C18.55 14 19 14.45 19 15S18.55 16 18 16 17 15.55 17 15 17.45 14 18 14M3 17C3.55 17 4 17.45 4 18S3.55 19 3 19 2 18.55 2 18 2.45 17 3 17M21 17C21.55 17 22 17.45 22 18S21.55 19 21 19 20 18.55 20 18 20.45 17 21 17"/>
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
              Discover Your Signature Scent
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto drop-shadow-md">
              Explore our curated collection of luxury fragrances organized by categories and brands.
            </p>
            
            {/* Call to Action Button */}
            <div className="mt-8">
              <button 
                onClick={() => document.getElementById('men')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-purple-600 bg-white hover:bg-gray-50 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Explore Collection
              </button>
            </div>
          </div>
        </div>

        {/* Custom CSS Animation */}
        <style>{`
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fade-in-up {
            animation: fade-in-up 1s ease-out;
          }
        `}</style>
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
