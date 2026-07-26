import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Star, SlidersHorizontal, ChevronRight, ArrowLeft, Search, X, Filter, Loader2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../services/api';
const PET_ANIMALS = [
  { id: 'cat', label: 'Cat' },
  { id: 'dog', label: 'Dog' },
  { id: 'bird', label: 'Bird' },
  { id: 'fish', label: 'Fish' },
  { id: 'rabbit', label: 'Rabbit' }
];

const FARM_ANIMALS = [
  { id: 'cow', label: 'Cow (গরু)' },
  { id: 'goat', label: 'Goat (ছাগল)' },
  { id: 'sheep', label: 'Sheep (ভেড়া)' },
  { id: 'poultry', label: 'Poultry (মুরগি)' },
  { id: 'pigeon', label: 'Pigeon (কবুতর)' }
];

const PET_CATEGORIES = [
  { id: 'food', label: 'Food & Treats' },
  { id: 'medicine', label: 'Medicine & Supplements' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'grooming', label: 'Grooming' },
  { id: 'toys', label: 'Toys' },
  { id: 'habitat', label: 'Habitat & Bedding' }
];

const FARM_CATEGORIES = [
  { id: 'feed', label: 'Feed & Fodder' },
  { id: 'vet_med', label: 'Veterinary Medicine' },
  { id: 'vitamins', label: 'Vitamins & Supplements' },
  { id: 'equipment', label: 'Equipment' },
  { id: 'hygiene', label: 'Hygiene & Disinfectant' },
  { id: 'breeding', label: 'Breeding Supplies' }
];

const DEFAULT_CATEGORIES = [
  { id: 'cat', label: 'Cat' },
  { id: 'dog', label: 'Dog' },
  { id: 'bird', label: 'Bird' },
  { id: 'fish', label: 'Fish' }
];

const BRANDS = ['NexGen Veterinary', 'Royal Canin', 'Pedigree', 'Whiskas', 'Purina'];

// ─── FILTER SECTION UI ───
const FilterSection = ({ title, children }) => (
  <div className="border-b border-gray-100 last:border-0 pb-6 mb-6">
    <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-4">{title}</h3>
    {children}
  </div>
);

const ProductListing = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const animalType = searchParams.get('animalType') || '';
  const category = searchParams.get('category') || '';
  const subcategory = searchParams.get('subcategory') || '';
  const brand = searchParams.get('brand') || '';
  const availability = searchParams.get('availability') || '';
  const onSaleOnly = searchParams.get('onSaleOnly') === 'true';
  const priceMax = searchParams.get('priceMax') ? parseInt(searchParams.get('priceMax'), 10) : 5000;
  
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Newest');
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const setFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    
    if (key === 'animalType') {
      params.delete('category');
      params.delete('subcategory');
    }
    if (key === 'category') {
      params.delete('subcategory');
    }
    
    setSearchParams(params);
  };

  const handleClearAll = () => {
    setSearchParams(new URLSearchParams());
    setSearchQuery('');
  };

  const filtered = useMemo(() => {
    let result = [...products];
    // Map UI filters to mock data properties: animalType -> p.category, category -> p.subcategory
    if (animalType) result = result.filter(p => p.category === animalType);
    if (category) result = result.filter(p => p.subcategory === category);
    if (priceMax < 5000) result = result.filter(p => p.priceMin <= priceMax);
    if (onSaleOnly) result = result.filter(p => !!p.discount);
    if (searchQuery) result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Sort logic
    if (sortBy === 'Price: Low to High') result.sort((a, b) => a.priceMin - b.priceMin);
    else if (sortBy === 'Price: High to Low') result.sort((a, b) => b.priceMin - a.priceMin);

    return result;
  }, [animalType, category, subcategory, brand, availability, onSaleOnly, priceMax, searchQuery, sortBy, products]);

  const currentCategories = useMemo(() => {
    if (!animalType) return DEFAULT_CATEGORIES;
    const isFarm = FARM_ANIMALS.some(a => a.id === animalType);
    return isFarm ? FARM_CATEGORIES : PET_CATEGORIES;
  }, [animalType]);

  const pageTitle = animalType 
    ? `${PET_ANIMALS.find(a=>a.id===animalType)?.label || FARM_ANIMALS.find(a=>a.id===animalType)?.label || animalType}` 
    : 'All Products';

  return (
    <div className="min-h-screen bg-brand-light font-sans pb-20 relative">
      
      {/* ─── MOBILE IMMERSIVE HEADER (Daraz Style) ─── */}
      <div className="lg:hidden sticky top-0 z-40 bg-white shadow-sm">
        {/* Row 1: Back & Search */}
        <div className="flex items-center gap-2 px-3 pt-3 pb-2">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0 active:scale-90 transition-transform">
            <ArrowLeft size={18} className="text-gray-800" />
          </button>
          <div className="flex-1 relative">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..." 
              className="w-full bg-gray-100 rounded-full py-2.5 pl-9 pr-8 text-[13px] font-bold text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all"
            />
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full bg-gray-300 text-white active:scale-90 transition-transform">
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Sort & Filter Buttons */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-2 flex-1">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-[12px] font-bold text-gray-900 outline-none focus:border-brand-mid cursor-pointer">
              <option value="Newest">Newest</option>
              <option value="Price: Low to High">Price: Low to High</option>
              <option value="Price: High to Low">Price: High to Low</option>
            </select>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={() => setIsMobileFilterOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-black border transition-all active:scale-95 ${
                category || subcategory || location
                  ? 'bg-brand-mid text-white border-brand-mid shadow-sm'
                  : 'bg-white text-gray-700 border-gray-200'
              }`}
            >
              <Filter size={14} /> Filters
            </button>
          </div>
        </div>

        {/* Row 3: Results Context */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-gray-50/80">
          <span className="text-[11px] font-bold text-gray-500">
            <strong className="text-gray-900">{filtered.length}</strong> Products Found
          </span>
          {(category || subcategory || location || searchQuery) && (
            <button onClick={handleClearAll} className="text-[10px] font-black text-brand-mid active:scale-95 transition-transform">
              Clear All
            </button>
          )}
        </div>
      </div>


      {/* ─── MAIN LAYOUT ─── */}
      <div className="max-w-[1400px] mx-auto px-4 py-6 lg:py-8 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-8 items-start">
        
        {/* Backdrop for Mobile */}
        {isMobileFilterOpen && (
          <div 
            className="fixed inset-0 bg-black/50 transition-opacity z-40 lg:hidden"
            onClick={() => setIsMobileFilterOpen(false)}
          />
        )}

        {/* ─── SIDEBAR FILTERS (Desktop Sticky / Mobile Bottom Sheet) ─── */}
        <aside className={`bg-white max-h-[90vh] overflow-y-auto transition-transform duration-300 transform ${
            `fixed inset-x-0 bottom-0 z-50 rounded-t-[2rem] lg:sticky lg:top-[90px] lg:z-10 lg:h-[calc(100vh-110px)] lg:block lg:rounded-[2rem] lg:border lg:border-gray-100 lg:shadow-[0_4px_20px_rgba(0,0,0,0.04)] lg:p-0 ${isMobileFilterOpen ? "translate-y-0" : "translate-y-full lg:translate-y-0"}`
        }`}>
          {/* Mobile Filter Header */}
          <div className="sticky top-0 bg-white z-20 px-6 pt-4 pb-2 border-b border-gray-50 rounded-t-[2rem] lg:hidden">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-black text-gray-900">Filters</h2>
              <div className="flex items-center gap-2">
                <button onClick={handleClearAll} className="text-[11px] font-black text-brand-mid uppercase tracking-wider px-2 py-1 rounded-md hover:bg-brand-section transition-colors">
                  Clear All
                </button>
                <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 bg-gray-100 rounded-full active:scale-95 transition-transform">
                  <X size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 lg:p-6 lg:h-full lg:overflow-y-auto [&::-webkit-scrollbar]:hidden">
            {/* Desktop Filter Header */}
            <div className="hidden lg:flex justify-between items-center mb-8 border-b-2 border-gray-900 pb-4">
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-wider">Filters</h2>
              <button onClick={handleClearAll} className="text-xs font-black text-brand-mid hover:text-gray-900 uppercase tracking-widest transition-colors border-b-2 border-transparent hover:border-gray-900">
                Clear All
              </button>
            </div>

            {/* Filter: Animal Type */}
            <FilterSection title="Animal Type">
              <div className="grid grid-cols-2 gap-2 mb-4">
                {PET_ANIMALS.map((animal) => {
                  const active = animalType === animal.id;
                  return (
                    <button
                      key={animal.id}
                      onClick={() => setFilter('animalType', active ? '' : animal.id)}
                      className={`py-2 px-2 rounded-xl border-2 text-[11px] font-black transition-all ${
                        active
                          ? "bg-brand-mid text-white border-brand-mid shadow-sm"
                          : "bg-white text-gray-700 border-gray-200 hover:border-brand-mid"
                      }`}
                    >
                      {animal.label}
                    </button>
                  );
                })}
              </div>
              <h4 className="text-[11px] font-black text-gray-500 mb-2">🐄 Farm & Livestock</h4>
              <div className="grid grid-cols-2 gap-2">
                {FARM_ANIMALS.map((animal) => {
                  const active = animalType === animal.id;
                  return (
                    <button
                      key={animal.id}
                      onClick={() => setFilter('animalType', active ? '' : animal.id)}
                      className={`py-2 px-2 rounded-xl border-2 text-[11px] font-black transition-all ${
                        active
                          ? "bg-brand-mid text-white border-brand-mid shadow-sm"
                          : "bg-white text-gray-700 border-gray-200 hover:border-brand-mid"
                      }`}
                    >
                      {animal.label}
                    </button>
                  );
                })}
              </div>
            </FilterSection>

            {/* Filter: Category */}
            <FilterSection title="Category">
              <div className="grid grid-cols-2 gap-2">
                {currentCategories.map((cat) => {
                  const active = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setFilter('category', active ? '' : cat.id)}
                      className={`py-2 px-2 rounded-xl border-2 text-[11px] font-black transition-all ${
                        active
                          ? "bg-brand-mid text-white border-brand-mid shadow-sm"
                          : "bg-white text-gray-700 border-gray-200 hover:border-brand-mid"
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </FilterSection>
            

            {/* Filter: Price Range */}
            <FilterSection title="Price Range">
              <div className="px-1">
                <input 
                  type="range" 
                  min="0" 
                  max="5000" 
                  step="50"
                  value={priceMax}
                  onChange={(e) => setFilter('priceMax', e.target.value)}
                  className="w-full accent-amber-500 mb-2"
                />
                <div className="text-[12px] font-bold text-gray-700 text-center">
                  ৳0 – ৳{priceMax}
                </div>
              </div>
            </FilterSection>

            {/* Filter: Brand */}
            <FilterSection title="Brand">
              <div className="grid grid-cols-2 gap-2">
                {BRANDS.map(b => {
                  const active = brand === b;
                  return (
                    <button
                      key={b}
                      onClick={() => setFilter('brand', active ? '' : b)}
                      className={`py-2 px-2 rounded-xl border-2 text-[11px] font-black transition-all ${
                        active
                          ? "bg-brand-mid text-white border-brand-mid shadow-sm"
                          : "bg-white text-gray-700 border-gray-200 hover:border-brand-mid"
                      }`}
                    >
                      {b}
                    </button>
                  );
                })}
              </div>
            </FilterSection>

            {/* Filter: Availability */}
            <FilterSection title="Availability">
              <div className="grid grid-cols-2 gap-2">
                {['In Stock', 'Pre-Order'].map(av => {
                  const active = availability === av;
                  return (
                    <button
                      key={av}
                      onClick={() => setFilter('availability', active ? '' : av)}
                      className={`py-2 px-2 rounded-xl border-2 text-[11px] font-black transition-all ${
                        active
                          ? "bg-brand-mid text-white border-brand-mid shadow-sm"
                          : "bg-white text-gray-700 border-gray-200 hover:border-brand-mid"
                      }`}
                    >
                      {av}
                    </button>
                  );
                })}
              </div>
            </FilterSection>

            {/* Filter: Discount */}
            <FilterSection title="Discount">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setFilter('onSaleOnly', onSaleOnly ? '' : 'true')}
                  className={`py-2 px-2 rounded-xl border-2 text-[11px] font-black transition-all ${
                    onSaleOnly
                      ? "bg-brand-mid text-white border-brand-mid shadow-sm"
                      : "bg-white text-gray-700 border-gray-200 hover:border-brand-mid"
                  }`}
                >
                  On Sale Only
                </button>
              </div>
            </FilterSection>
          </div>
        </aside>

        {/* ─── PRODUCT GRID ─── */}
        <div className="flex-grow">
          {/* Desktop Breadcrumb / Header */}
          <div className="hidden lg:block mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <Link to="/" className="hover:text-brand-mid transition-colors flex items-center gap-1">
                <ArrowLeft size={14} /> Home
              </Link>
              <ChevronRight size={14} />
              <span className="text-gray-800 font-medium">{pageTitle}</span>
            </div>
            <div className="flex items-end justify-between">
              <h1 className="text-3xl font-bold text-gray-900">{pageTitle}</h1>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-500">Sort by:</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent text-sm font-bold text-gray-900 outline-none cursor-pointer">
                  <option value="Newest">Newest</option>
                  <option value="Price: Low to High">Price: Low to High</option>
                  <option value="Price: High to Low">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <Loader2 className="w-10 h-10 animate-spin text-brand-primary mb-4" />
              <p className="text-gray-500 font-medium">Loading professional catalog...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
              <span className="text-6xl mb-4">🐾</span>
              <h3 className="text-xl font-black text-gray-900 mb-2">No products found</h3>
              <p className="text-sm text-gray-500">Try adjusting your filters or location.</p>
              <button onClick={handleClearAll} className="mt-6 bg-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-mid transition-colors">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-6">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListing;
