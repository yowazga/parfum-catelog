import React, { useState } from 'react';

const BrandCard = ({ brand }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
      {/* Brand Header */}
      <div className="relative">
        <img 
          src={brand.imageUrl} 
          alt={brand.name}
          className="w-full h-48 object-cover"
        />
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
