import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import HeroBanner from '../components/HeroBanner';
import ConsultationSection from '../components/ConsultationSection';
import FeaturedCategories from '../components/FeaturedCategories';
import BrandsSection from '../components/BrandsSection';
import ProductSection from '../components/ProductSection';
import { fetchStorefrontData, fetchTopSales } from '../services/api';

import AnimatedLoader from '../components/AnimatedLoader';

// Removed mock feed categories and product data

const Home = () => {
  const [visibleCategories, setVisibleCategories] = useState(3);
  const [storefrontData, setStorefrontData] = useState(null);
  const [topSales, setTopSales] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      setLoading(true);
      try {
        const results = await Promise.allSettled([
          fetchStorefrontData(),
          fetchTopSales(),
          import('../services/api').then(m => m.fetchProducts())
        ]);
        
        // Use fulfilled values or fallback to defaults if a promise was rejected
        setStorefrontData(results[0].status === 'fulfilled' ? (results[0].value || {}) : {});
        setTopSales(results[1].status === 'fulfilled' ? (results[1].value || []) : []);
        setAllProducts(results[2].status === 'fulfilled' ? (results[2].value || []) : []);
      } catch (error) {
        console.error("Failed to load homepage data", error);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  if (loading || !storefrontData) {
    return <AnimatedLoader />;
  }

  // Dynamically generate all unique Category + Subcategory combinations from products
  const uniqueCombosMap = new Map();
  allProducts.forEach(p => {
    if (p.category && p.subcategory) {
      const animal = p.category.trim();
      const sub = p.subcategory.trim();
      const comboKey = `${animal.toLowerCase()}-${sub.toLowerCase()}`;
      if (!uniqueCombosMap.has(comboKey)) {
        // Capitalize words
        const animalCap = animal.charAt(0).toUpperCase() + animal.slice(1).toLowerCase();
        let subCap = sub.charAt(0).toUpperCase() + sub.slice(1).toLowerCase();
        // Handle plurals/grammar nicely if needed, e.g., toys -> Toy
        if (subCap === 'Toys') subCap = 'Toy';
        if (subCap === 'Foods') subCap = 'Food';
        
        uniqueCombosMap.set(comboKey, {
          name: `${animalCap} ${subCap}`,
          animalType: animal.toLowerCase(),
          category: sub.toLowerCase()
        });
      }
    } else if (p.category) {
      // Fallback for products with no subcategory
      const animal = p.category.trim();
      const comboKey = `${animal.toLowerCase()}-all`;
      if (!uniqueCombosMap.has(comboKey)) {
        const animalCap = animal.charAt(0).toUpperCase() + animal.slice(1).toLowerCase();
        uniqueCombosMap.set(comboKey, {
          name: `${animalCap}`,
          animalType: animal.toLowerCase(),
          category: null
        });
      }
    }
  });
  const displayCategories = Array.from(uniqueCombosMap.values()).sort((a, b) => {
    const animalOrder = ['cat', 'dog', 'bird', 'fish', 'rabbit', 'cow', 'goat', 'sheep', 'poultry', 'pigeon'];
    const aIndex = animalOrder.indexOf(a.animalType);
    const bIndex = animalOrder.indexOf(b.animalType);
    
    if (aIndex === -1 && bIndex === -1) return a.animalType.localeCompare(b.animalType);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    if (aIndex !== bIndex) return aIndex - bIndex;
    
    // If same animal, sort alphabetically by subcategory
    const aCat = a.category || '';
    const bCat = b.category || '';
    return aCat.localeCompare(bCat);
  });
  
  const handleViewMore = () => {
    setVisibleCategories(prev => prev + 2);
  };

  return (
    <div className="bg-[#FBF9F6]">
      <HeroBanner banners={storefrontData.heroBanners} />
      <ConsultationSection />
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
          // Get the items specifically for this category combo
          const categoryProducts = allProducts.filter(p => {
            const matchesAnimal = p.category && p.category.toLowerCase() === cat.animalType;
            const matchesSub = cat.category ? (p.subcategory && p.subcategory.toLowerCase() === cat.category) : true;
            return matchesAnimal && matchesSub;
          });
          
          if (categoryProducts.length === 0) return null;
          
          let linkUrl = `/products?animalType=${cat.animalType}`;
          if (cat.category) {
            linkUrl += `&category=${cat.category}`;
          }
          
          return (
            <div key={idx} className="bg-[#FBF9F6]">
              <ProductSection 
                title={`${cat.name} Section`} 
                viewAllText="View All Items"
                headerVariant="left"
                linkUrl={linkUrl}
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
