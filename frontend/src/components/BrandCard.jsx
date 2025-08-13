import React, { useState } from 'react';
import { fileUploadService } from '../services/fileUploadService';
import { getImageUrl } from '../utils/imageUtils';

const BrandCard = ({ brand }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
      {/* Brand Header */}
      <div className="relative">
        {brand.imageUrl && !imageError ? (
          <img 
            src={getImageUrl(brand.imageUrl)} 
            alt={brand.name}
            className="w-full h-48 object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 text-sm">No Image</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h2 className="text-3xl font-bold text-white text-center">
            {brand.name}
          </h2>
        </div>
      </div>

      {/* Brand Description */}
      <div className="p-6">
        <p className="text-gray-600 text-center mb-4">
          {brand.description}
        </p>
        
        {/* Perfumes Count */}
        <div className="text-center mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {brand.perfumes.length} Perfumes
          </span>
        </div>

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          {isExpanded ? 'Hide Perfumes' : 'Show Perfumes'}
          <svg 
            className={`ml-2 w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Perfumes List */}
        {isExpanded && (
          <div className="mt-4 space-y-2">
            <h3 className="font-semibold text-gray-800 text-center mb-3">
              Perfumes Collection
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {brand.perfumes.map(perfume => (
                <div 
                  key={perfume.id} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <span className="font-medium text-gray-800">
                    {perfume.name}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    #{perfume.number}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandCard;
