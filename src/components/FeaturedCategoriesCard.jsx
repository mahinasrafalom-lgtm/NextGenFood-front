import React from 'react';
import { Link } from 'react-router-dom';

const FeaturedCategoriesCard = ({ category }) => {
  const categoryId = category.id || encodeURIComponent((category.title || category.label || '').toLowerCase());
  
  return (
    <Link 
      to={`/products?category=${categoryId}`} 
      className="flex flex-col items-center gap-3 sm:gap-4 flex-shrink-0 group/item snap-start hover:-translate-y-1 transition-transform duration-300"
    >
      <div className="w-[100px] h-[100px] sm:w-[140px] sm:h-[140px] bg-white rounded-2xl sm:rounded-[28px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-50 flex items-center justify-center overflow-hidden group-hover/item:shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-all">
        <img 
          src={category.image || category.img} 
          alt={category.title || category.label} 
          className="w-full h-full object-contain group-hover/item:scale-110 transition-transform duration-500"
        />
      </div>
      <span className="text-[13px] sm:text-[15px] font-semibold text-gray-700 group-hover/item:text-brand-mid transition-colors whitespace-nowrap text-center">
        {category.title || category.label}
      </span>
    </Link>
  );
};

export default FeaturedCategoriesCard;
