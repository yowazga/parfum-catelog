import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900">
                Parfum Catalog
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#men" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
              Men
            </a>
            <a href="#women" className="text-gray-700 hover:text-pink-600 px-3 py-2 text-sm font-medium transition-colors">
              Women
            </a>
            <a href="#unisex" className="text-gray-700 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors">
              Unisex
            </a>
            <Link to="/admin/login" className="admin-button">
              Admin
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-gray-900 focus:outline-none focus:text-gray-900"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              <a href="#men" className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium">
                Men
              </a>
              <a href="#women" className="text-gray-700 hover:text-pink-600 block px-3 py-2 text-base font-medium">
                Women
              </a>
              <a href="#unisex" className="text-gray-700 hover:text-purple-600 block px-3 py-2 text-base font-medium">
                Unisex
              </a>
              <Link to="/admin/login" className="admin-button block text-center mt-4">
                Admin
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
