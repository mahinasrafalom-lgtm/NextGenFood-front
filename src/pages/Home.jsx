import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import HeroBanner from '../components/HeroBanner';

import FeaturedCategories from '../components/FeaturedCategories';
import BrandsSection from '../components/BrandsSection';
import ProductSection from '../components/ProductSection';
import { fetchStorefrontData, fetchTopSales } from '../services/api';

// Removed mock feed categories and product data

const Home = () => {
  const [visibleCategories, setVisibleCategories] = useState(1);
  const [storefrontData, setStorefrontData] = useState(null);
  const [topSales, setTopSales] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      setLoading(true);
      try {
        const [storefront, sales, products] = await Promise.all([
          fetchStorefrontData(),
          fetchTopSales(),
          import('../services/api').then(m => m.fetchProducts())
        ]);
        setStorefrontData(storefront);
        setTopSales(sales);
        setAllProducts(products || []);
      } catch (error) {
        console.error("Failed to load homepage data", error);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  if (loading || !storefrontData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-brand-primary mb-4" />
        <p className="text-gray-500 font-medium">Loading store experience...</p>
      </div>
    );
  }

  // Use featuredCategories from API, fallback to dynamically generating categories from products
  const displayCategories = storefrontData.featuredCategories?.length > 0 
    ? storefrontData.featuredCategories.map(cat => ({ name: cat.title })) 
    : Array.from(new Set(allProducts.map(p => p.category))).filter(Boolean).map(cat => ({ name: cat }));
  
  const handleViewMore = () => {
    setVisibleCategories(prev => prev + 1);
  };

  return (
    <div className="bg-[#FBF9F6]">
      <HeroBanner banners={storefrontData.heroBanners} />
      <div className="hidden sm:block">

      </div>
      <FeaturedCategories categories={storefrontData.featuredCategories} />
      <div className="bg-[#FBF9F6]">
        <ProductSection title="Top Selling Products" products={topSales} />
      </div>
      
      <BrandsSection brands={storefrontData.brands} />
      
      {/* Category Sections loaded dynamically */}
      <div className="pb-[30px] bg-[#FBF9F6]">
        {displayCategories.slice(0, visibleCategories).map((cat, idx) => {
          // Get the items specifically for this category
          const categoryProducts = allProducts.filter(p => 
            p.category?.toLowerCase() === cat.name.toLowerCase() || 
            p.subcategory?.toLowerCase() === cat.name.toLowerCase()
          );
          
          if (categoryProducts.length === 0) return null;
          
          return (
            <div key={idx} className="bg-[#FBF9F6]">
              <ProductSection 
                title={`${cat.name} Section`} 
                viewAllText="View All Items"
                headerVariant="left"
                linkUrl={`/products?category=${encodeURIComponent(cat.name.toLowerCase())}`}
                products={categoryProducts} 
              />
            </div>
          );
        })}

        {visibleCategories < displayCategories.length && (
          <div className="flex justify-center bg-[#FBF9F6] pt-[12px]">
            <button 
              onClick={handleViewMore}
              className="bg-[#FBF9F6] border-2 border-brand-mid text-brand-mid px-10 py-3 rounded-xl font-bold text-sm sm:text-base hover:bg-brand-mid hover:text-white hover:shadow-lg transition-all duration-300"
            >
              View More Categories
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
