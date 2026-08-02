import React, { createContext, useContext, useState, useCallback } from 'react';

const DataCacheContext = createContext();

export const useDataCache = () => {
  const context = useContext(DataCacheContext);
  if (!context) {
    throw new Error('useDataCache must be used within DataCacheProvider');
  }
  return context;
};

export const DataCacheProvider = ({ children }) => {
  const [cache, setCache] = useState({
    storefrontData: null,
    topSales: null,
    allProducts: null,
    lastFetched: null
  });

  const updateCache = useCallback((data) => {
    setCache(prev => ({
      ...prev,
      ...data,
      lastFetched: Date.now()
    }));
  }, []);

  const clearCache = useCallback(() => {
    setCache({
      storefrontData: null,
      topSales: null,
      allProducts: null,
      lastFetched: null
    });
  }, []);

  const isCacheValid = useCallback((maxAge = 5 * 60 * 1000) => {
    // Cache is valid for 5 minutes by default
    if (!cache.lastFetched) return false;
    return Date.now() - cache.lastFetched < maxAge;
  }, [cache.lastFetched]);

  const value = {
    cache,
    updateCache,
    clearCache,
    isCacheValid
  };

  return (
    <DataCacheContext.Provider value={value}>
      {children}
    </DataCacheContext.Provider>
  );
};
