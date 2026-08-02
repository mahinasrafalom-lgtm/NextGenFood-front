import React, { createContext, useContext, useState, useCallback } from 'react';

const HomeDataContext = createContext();

export const useHomeData = () => {
  const context = useContext(HomeDataContext);
  if (!context) {
    throw new Error('useHomeData must be used within HomeDataProvider');
  }
  return context;
};

export const HomeDataProvider = ({ children }) => {
  const [storefrontData, setStorefrontData] = useState(null);
  const [topSales, setTopSales] = useState(null);
  const [allProducts, setAllProducts] = useState(null);
  const [cacheTimestamp, setCacheTimestamp] = useState(null);

  // Cache expiry time: 5 minutes
  const CACHE_EXPIRY_MS = 5 * 60 * 1000;

  const isCacheValid = useCallback(() => {
    if (!cacheTimestamp || !storefrontData || !topSales || !allProducts) {
      return false;
    }
    const now = Date.now();
    return (now - cacheTimestamp) < CACHE_EXPIRY_MS;
  }, [cacheTimestamp, storefrontData, topSales, allProducts]);

  const updateCache = useCallback((storefront, sales, products) => {
    setStorefrontData(storefront);
    setTopSales(sales);
    setAllProducts(products);
    setCacheTimestamp(Date.now());
  }, []);

  const clearCache = useCallback(() => {
    setStorefrontData(null);
    setTopSales(null);
    setAllProducts(null);
    setCacheTimestamp(null);
  }, []);

  const value = {
    storefrontData,
    topSales,
    allProducts,
    isCacheValid,
    updateCache,
    clearCache
  };

  return (
    <HomeDataContext.Provider value={value}>
      {children}
    </HomeDataContext.Provider>
  );
};
