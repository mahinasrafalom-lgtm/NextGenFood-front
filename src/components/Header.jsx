import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, SlidersHorizontal, Menu, X, MapPin, Heart, Calendar, HelpCircle, PhoneCall, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Header = ({ isCheckoutPage, cartCount, lang, setLang, mobileSearchOpen, setMobileSearchOpen, mobileMenuOpen, setMobileMenuOpen, isLoggedIn }) => {
  const { openCartDrawer } = useCart();
  const searchRef = useRef(null);
  const moreMenuRef = useRef(null);
  const navigate = useNavigate();
  const [searchCategory, setSearchCategory] = useState('সব বিভাগ');
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isProductDetailsPage = location.pathname.startsWith('/product/');
  const isProductListingPage = location.pathname === '/products';
  
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Fetch all products for search recommendations
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { fetchProducts } = await import('../services/api');
        const data = await fetchProducts();
        setAllProducts(data || []);
      } catch (err) {
        console.error("Failed to load products for search", err);
      }
    };
    loadProducts();
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase().trim();
    const isGlobal = searchCategory === 'সব বিভাগ';
    
    const results = allProducts.filter(p => {
      // If a specific animal category is selected in the dropdown, restrict search to it
      if (!isGlobal) {
        const pCat = p.category ? p.category.toLowerCase() : '';
        const sCat = searchCategory === 'পোষা পশু' ? 'pet' : searchCategory.toLowerCase(); // Map Bengali to English logic if needed, but since data is English:
        // Actually searchCategory maps to Bengali like "বিড়াল", but our data has "cat"
        const categoryMap = { 'বিড়াল': 'cat', 'কুকুর': 'dog', 'পাখি': 'bird', 'মাছ': 'fish', 'পোষা পশু': 'pet' };
        const mappedCat = categoryMap[searchCategory];
        if (mappedCat && pCat !== mappedCat) return false;
      }
      
      const name = p.name ? p.name.toLowerCase() : '';
      const brand = p.brand ? p.brand.toLowerCase() : '';
      const category = p.category ? p.category.toLowerCase() : '';
      const subcategory = p.subcategory ? p.subcategory.toLowerCase() : '';
      const desc = p.description ? p.description.toLowerCase() : '';

      return name.includes(query) || 
             brand.includes(query) || 
             category.includes(query) || 
             subcategory.includes(query) || 
             desc.includes(query);
    });
    
    return results.slice(0, 5); // Max 5 suggestions
  }, [searchQuery, searchCategory, allProducts]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      if (mobileSearchOpen) setMobileSearchOpen(false);
      navigate(`/products?searchQuery=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileSearchOpen && searchRef.current && !searchRef.current.contains(event.target)) {
        if (!event.target.closest('.search-toggle-btn')) {
          setMobileSearchOpen(false);
        }
      }
      
      // Handle more menu click outside
      if (moreMenuOpen && moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setMoreMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [mobileSearchOpen, setMobileSearchOpen, moreMenuOpen]);

  const shouldBeSticky = isProductDetailsPage || isProductListingPage;
  const stickyClasses = shouldBeSticky 
    ? `sticky top-0 z-50 transition-all duration-300 ease-in-out ${isScrolled ? 'bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)] py-1' : 'bg-white/80 backdrop-blur-xl py-0'}`
    : `relative z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50`;

  return (
    <header className={`font-bengali w-full overflow-visible ${stickyClasses}`}>
      {/* Row 1: Logo and Icons */}
      <div className="container mx-auto px-3 py-2.5 sm:py-3 max-w-[1350px] flex items-center justify-between gap-2 lg:gap-8 w-full relative">
        
        {/* Left: Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <button 
            className="p-2 -ml-2 text-gray-700 hover:text-brand-mid transition-colors active:scale-95"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={26} strokeWidth={2.5} /> : <Menu size={26} strokeWidth={2.5} />}
          </button>
        </div>

        {/* Center (Mobile) / Left (Desktop): Logo */}
        <Link to="/" className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 group absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 z-10">
          
          {/* Uploaded Logo Image */}
          <img src="/logo.png" alt="Logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105" />
          
          <div className="flex flex-col justify-center">
            <h1 className="text-[17px] sm:text-lg lg:text-[22px] font-bold font-sans text-gray-900 leading-none tracking-tight">
              NexGen <span className="text-gray-700">Veterinary</span>
            </h1>
            <p className="hidden md:block text-[10px] lg:text-[11px] text-gray-500 font-sans tracking-wide mt-0.5">Happy Pets, Healthy Lives</p>
          </div>
        </Link>

        {/* Desktop Search Bar */}
        {!isCheckoutPage && (
          <div className="flex-grow max-w-md hidden md:flex flex-col relative z-50">
            <form 
              onSubmit={handleSearchSubmit}
              className={`flex items-center border rounded-full bg-white transition-all duration-200 ml-4 lg:ml-0 pl-1 pr-1 py-1 relative z-20 ${isSearchFocused ? 'border-brand-mid ring-1 ring-brand-mid' : 'border-gray-300'}`}
            >
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                placeholder="পণ্য, ব্র্যান্ড বা মেডিসিন খুঁজুন..."
                className="flex-grow py-1.5 px-3 outline-none text-sm placeholder:text-gray-400 bg-transparent text-gray-800 min-w-[120px]"
              />
              
              <div className="flex items-center gap-1">
                {/* Search Button */}
                <button type="submit" className="text-white bg-brand-mid hover:bg-brand-dark w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm">
                  <Search size={16} strokeWidth={2.5} />
                </button>
              </div>
            </form>

            {/* Search Recommendations Dropdown */}
            {isSearchFocused && searchQuery.trim() !== '' && (
              <div className="absolute top-full left-4 lg:left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                {searchResults.length > 0 ? (
                  <>
                    <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Suggested Products
                    </div>
                    {searchResults.map(product => (
                      <div 
                        key={product._id || product.id}
                        onClick={() => navigate(`/product/${product._id || product.id}`)}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="w-10 h-10 bg-white border border-gray-100 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center">
                          <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{product.name}</p>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-brand-mid font-bold">৳{product.priceMin?.toLocaleString()}</span>
                            {product.category && <span className="text-gray-400 capitalize">{product.category}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                    <button 
                      onMouseDown={(e) => { e.preventDefault(); handleSearchSubmit(e); }}
                      className="w-full text-center text-sm text-brand-primary font-bold py-3 mt-1 hover:bg-gray-50 border-t border-gray-100 transition-colors"
                    >
                      See all results for "{searchQuery}"
                    </button>
                  </>
                ) : (
                  <div className="px-4 py-6 text-center text-gray-500 text-sm">
                    No products found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Right: Actions (Modern Icon Layout) */}
        {!isCheckoutPage && (
          <div className="flex items-center gap-3 sm:gap-5 lg:gap-6 flex-shrink-0 relative z-20 font-sans">
            
            {/* Track Order */}
            <Link to="/track-order" className="hidden xl:flex flex-col items-center justify-center group text-gray-700 hover:text-brand-mid transition-colors">
              <div className="relative mb-0.5">
                <MapPin size={22} strokeWidth={1.8} className="group-hover:scale-105 transition-transform" />
              </div>
              <span className="text-[12px] font-semibold leading-tight">Track Order</span>
            </Link>

            {/* Sign In / User */}
            <button 
              onClick={() => navigate(isLoggedIn ? '/profile' : '/login')}
              className="hidden sm:flex flex-col items-center justify-center group text-gray-700 hover:text-brand-mid transition-colors"
            >
              <div className="relative mb-0.5">
                <User size={22} strokeWidth={1.8} className="group-hover:scale-105 transition-transform" />
              </div>
              <span className="text-[12px] font-semibold leading-tight">{isLoggedIn ? 'Profile' : 'Sign In'}</span>
            </button>



            {/* Cart */}
            <button 
              onClick={openCartDrawer}
              className="flex flex-col items-center justify-center group text-gray-700 hover:text-brand-mid transition-colors relative"
            >
              <div className="relative mb-0.5">
                <ShoppingCart size={22} strokeWidth={1.8} className="group-hover:scale-105 transition-transform" />
                <span className="absolute -top-1.5 -right-2 bg-brand-mid text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-white shadow-sm">
                  {cartCount}
                </span>
              </div>
              <span className="text-[12px] font-semibold leading-tight">Cart</span>
            </button>

            {/* More Menu (Dropdown) - Hidden on Mobile */}
            <div className="relative hidden md:block" ref={moreMenuRef}>
              <button 
                className={`flex flex-col items-center justify-center transition-colors focus:outline-none ${moreMenuOpen ? 'text-brand-mid' : 'text-gray-700 hover:text-brand-mid group'}`}
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
              >
                <div className="relative mb-0.5">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`${!moreMenuOpen && 'group-hover:scale-105 transition-transform'}`}>
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="4" y1="12" x2="15" y2="12" />
                    <line x1="4" y1="18" x2="9" y2="18" />
                  </svg>
                </div>
                <span className="text-[12px] font-semibold leading-tight">More</span>
              </button>

              {/* Dropdown Box */}
              <div className={`absolute right-0 top-full mt-2 w-52 bg-white rounded-lg shadow-[0_10px_35px_rgba(0,0,0,0.12)] border border-gray-100 py-1.5 z-50 transition-all duration-200 ${moreMenuOpen ? 'block' : 'hidden'}`}>
                
                <Link to="/about" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-mid transition-colors border-b border-gray-100/80">
                  <Calendar size={18} className="text-gray-700" />
                  <span className="font-medium">About Us</span>
                </Link>

                <Link to="/wishlist" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-mid transition-colors border-b border-gray-100/80">
                  <Heart size={18} className="text-gray-700" />
                  <span className="font-medium">Wishlists</span>
                </Link>

                <Link to="/faq" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-mid transition-colors border-b border-gray-100/80">
                  <HelpCircle size={18} className="text-gray-700" />
                  <span className="font-medium">Faqs</span>
                </Link>

                <a href="tel:+8801700000000" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-mid transition-colors border-b border-gray-100/80">
                  <PhoneCall size={18} className="text-gray-700" />
                  <span className="font-medium">Call Us</span>
                </a>

                <a href="https://wa.me/8801700000000" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 transition-colors group/wa">
                  <MessageCircle size={18} className="text-green-600 fill-green-600/10" />
                  <span className="font-medium text-gray-700 group-hover/wa:text-green-600">WhatsApp</span>
                </a>

              </div>
            </div>

          </div>
        )}
      </div>

      {/* Mobile Search Bar (Expandable, matches Desktop Search design) */}
      {!isCheckoutPage && (
        <div ref={searchRef} className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out absolute w-full left-0 top-full bg-white shadow-md z-40 ${mobileSearchOpen ? 'max-h-28 opacity-100 border-b border-gray-100 py-2' : 'max-h-0 opacity-0 pointer-events-none'}`}>
          <div className="px-3 py-0.5 relative">
            <form 
              onSubmit={handleSearchSubmit}
              className={`flex items-center border rounded-full bg-white transition-all pl-1 pr-1 py-1 ${isSearchFocused ? 'border-brand-mid ring-1 ring-brand-mid' : 'border-gray-300'}`}
            >
              
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                placeholder="পণ্য, ব্র্যান্ড বা মেডিসিন খুঁজুন..."
                className="flex-grow py-1.5 px-3 outline-none text-xs placeholder:text-gray-400 bg-transparent text-gray-800 min-w-[80px]"
              />

              <div className="flex items-center gap-1 flex-shrink-0">
                {/* Search Button */}
                <button type="submit" className="text-white bg-brand-mid hover:bg-brand-dark w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm">
                  <Search size={15} strokeWidth={2.5} />
                </button>
              </div>
            </form>

            {/* Mobile Search Recommendations Dropdown */}
            {isSearchFocused && searchQuery.trim() !== '' && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-xl border-t border-gray-100 max-h-[60vh] overflow-y-auto z-50">
                {searchResults.length > 0 ? (
                  <>
                    <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50">
                      Suggested Products
                    </div>
                    {searchResults.map(product => (
                      <div 
                        key={product._id || product.id}
                        onClick={() => navigate(`/product/${product._id || product.id}`)}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50"
                      >
                        <div className="w-10 h-10 bg-white border border-gray-100 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center">
                          <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-800 truncate">{product.name}</p>
                          <div className="flex items-center gap-2 text-[10px]">
                            <span className="text-brand-mid font-bold">৳{product.priceMin?.toLocaleString()}</span>
                            {product.category && <span className="text-gray-400 capitalize">{product.category}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                    <button 
                      onMouseDown={(e) => { e.preventDefault(); handleSearchSubmit(e); }}
                      className="w-full text-center text-xs text-brand-primary font-bold py-3 hover:bg-gray-50 transition-colors"
                    >
                      See all results for "{searchQuery}"
                    </button>
                  </>
                ) : (
                  <div className="px-4 py-6 text-center text-gray-500 text-xs">
                    No products found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
