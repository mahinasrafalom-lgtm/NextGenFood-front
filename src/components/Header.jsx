import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, SlidersHorizontal, Menu, X, MapPin, Heart, Calendar, HelpCircle, PhoneCall, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Header = ({ isCheckoutPage, cartCount, lang, setLang, mobileSearchOpen, setMobileSearchOpen, mobileMenuOpen, setMobileMenuOpen, isLoggedIn }) => {
  const { openCartDrawer } = useCart();
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const [searchCategory, setSearchCategory] = useState('সব বিভাগ');
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileSearchOpen && searchRef.current && !searchRef.current.contains(event.target)) {
        if (!event.target.closest('.search-toggle-btn')) {
          setMobileSearchOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [mobileSearchOpen, setMobileSearchOpen]);

  return (
    <header className="bg-white/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.04)] border-b border-gray-200/50 font-bengali sticky top-0 z-50 transition-all duration-300 w-full overflow-visible">
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
          <div className="flex-grow max-w-md hidden md:flex items-center border border-gray-300 rounded-full bg-white focus-within:border-brand-mid focus-within:ring-1 focus-within:ring-brand-mid transition-all duration-200 ml-4 lg:ml-0 pl-1 pr-1 py-1">
            
            {searchCategory !== 'সব বিভাগ' && (
              <div className="flex items-center bg-brand-section text-brand-dark px-2.5 py-1 rounded-full text-xs font-semibold ml-1 whitespace-nowrap">
                {searchCategory}
                <button onClick={() => setSearchCategory('সব বিভাগ')} className="ml-1 hover:text-red-500 transition-colors">
                  <X size={12} strokeWidth={3} />
                </button>
              </div>
            )}

            <input 
              type="text" 
              placeholder={searchCategory !== 'সব বিভাগ' ? "খুঁজুন..." : "পণ্য, ব্র্যান্ড বা মেডিসিন খুঁজুন..."}
              className="flex-grow py-1.5 px-3 outline-none text-sm placeholder:text-gray-400 bg-transparent text-gray-800 min-w-[120px]"
            />
            
            <div className="flex items-center gap-1">
              {/* Filter / Category Select */}
              <div className="relative flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 text-gray-500 transition-colors" title="ক্যাটাগরি ফিল্টার">
                <SlidersHorizontal size={16} />
                <select 
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                >
                  <option value="সব বিভাগ">সব বিভাগ (All)</option>
                  <option value="বিড়াল">বিড়াল</option>
                  <option value="কুকুর">কুকুর</option>
                  <option value="পাখি">পাখি</option>
                  <option value="মাছ">মাছ</option>
                  <option value="পোষা পশু">পোষা পশু</option>
                </select>
              </div>

              {/* Search Button */}
              <button className="text-white bg-brand-mid hover:bg-brand-dark w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm">
                <Search size={16} strokeWidth={2.5} />
              </button>
            </div>
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

            {/* Wishlist */}
            <Link to="/wishlist" className="hidden md:flex flex-col items-center justify-center group text-gray-700 hover:text-brand-mid transition-colors">
              <div className="relative mb-0.5">
                <Heart size={22} strokeWidth={1.8} className="group-hover:scale-105 transition-transform" />
              </div>
              <span className="text-[12px] font-semibold leading-tight">Wishlist</span>
            </Link>

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
            <div className="relative group/more hidden md:block">
              <button 
                className="flex flex-col items-center justify-center text-brand-mid transition-colors focus:outline-none"
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
              >
                <div className="relative mb-0.5 text-brand-mid">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="4" y1="12" x2="15" y2="12" />
                    <line x1="4" y1="18" x2="9" y2="18" />
                  </svg>
                </div>
                <span className="text-[12px] font-bold leading-tight">More</span>
              </button>

              {/* Dropdown Box */}
              <div className={`absolute right-0 top-full mt-2 w-52 bg-white rounded-lg shadow-[0_10px_35px_rgba(0,0,0,0.12)] border border-gray-100 py-1.5 z-50 transition-all duration-200 ${moreMenuOpen ? 'block' : 'hidden group-hover/more:block'}`}>
                
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
          <div className="px-3 py-0.5">
            <div className="flex items-center border border-gray-300 rounded-full bg-white focus-within:border-brand-mid focus-within:ring-1 focus-within:ring-brand-mid transition-all pl-1 pr-1 py-1">
              
              {searchCategory !== 'সব বিভাগ' && (
                <div className="flex items-center bg-brand-section text-brand-dark px-2.5 py-1 rounded-full text-xs font-semibold ml-1 whitespace-nowrap">
                  {searchCategory}
                  <button onClick={() => setSearchCategory('সব বিভাগ')} className="ml-1 hover:text-red-500 transition-colors">
                    <X size={12} strokeWidth={3} />
                  </button>
                </div>
              )}

              <input 
                type="text" 
                placeholder={searchCategory !== 'সব বিভাগ' ? "খুঁজুন..." : "পণ্য, ব্র্যান্ড বা মেডিসিন খুঁজুন..."}
                className="flex-grow py-1.5 px-3 outline-none text-xs placeholder:text-gray-400 bg-transparent text-gray-800 min-w-[80px]"
              />

              <div className="flex items-center gap-1 flex-shrink-0">
                {/* Filter / Category Select */}
                <div className="relative flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 text-gray-500 transition-colors" title="ক্যাটাগরি ফিল্টার">
                  <SlidersHorizontal size={16} />
                  <select 
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-xs"
                  >
                    <option value="সব বিভাগ">সব বিভাগ (All)</option>
                    <option value="বিড়াল">বিড়াল</option>
                    <option value="কুকুর">কুকুর</option>
                    <option value="পাখি">পাখি</option>
                    <option value="মাছ">মাছ</option>
                    <option value="পোষা পশু">পোষা পশু</option>
                  </select>
                </div>

                {/* Search Button */}
                <button className="text-white bg-brand-mid hover:bg-brand-dark w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm">
                  <Search size={15} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
