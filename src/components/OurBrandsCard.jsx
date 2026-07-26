import React from 'react';
import { useNavigate } from 'react-router-dom';

const OurBrandsCard = ({ brand }) => {
  const navigate = useNavigate();
  const brandName = encodeURIComponent((brand.name || '').toLowerCase());

  return (
    <div 
      onClick={() => navigate(`/products?brand=${brandName}`)}
      className="bg-white rounded-md border border-gray-100 w-full h-[70px] sm:h-[90px] lg:h-[100px] flex items-center justify-center cursor-pointer shadow-sm hover:border-gray-200 hover:shadow-md transition-all duration-300 group relative overflow-hidden z-20 pointer-events-auto"
    >
      <img 
        src={brand.image || brand.img} 
        alt={brand.name} 
        className="w-full h-full object-contain opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 relative z-10"
      />
    </div>
  );
};

export default OurBrandsCard;
