import React from 'react';
import BrandCard from './BrandCard';

const CategorySection = ({ category }) => {
  const getCategoryColor = (colorName) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200',
      pink: 'bg-pink-50 border-pink-200',
      purple: 'bg-purple-50 border-purple-200'
    };
    return colors[colorName] || 'bg-gray-50 border-gray-200';
  };

  const getCategoryId = (categoryName) => {
    const ids = {
      'Men': 'men',
      'Women': 'women',
      'Unisex': 'unisex'
    };
    return ids[categoryName] || categoryName.toLowerCase();
  };

  return (
    <section id={getCategoryId(category.name)} className={`category-section ${getCategoryColor(category.color)} border-t`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {category.name}
          </h2>
          <p className="text-gray-600 text-lg">
            {category.description}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {category.brands.map(brand => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
