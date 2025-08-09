import React from 'react';

const PerfumeCard = ({ perfume }) => {
  return (
    <div className="perfume-card p-6 max-w-sm mx-auto">
      <div className="text-center">
        <img 
          src={perfume.image} 
          alt={`${perfume.brand} ${perfume.name}`}
          className="w-32 h-32 mx-auto mb-4 rounded-lg object-cover shadow-sm"
        />
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">
            {perfume.brand}
          </h3>
          
          <p className="text-gray-600 font-medium">
            {perfume.name}
          </p>
          
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            #{perfume.number}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfumeCard;
