import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

/* ─── Category data with subcategories (Icons removed for cleaner text-only look) ─── */
const categories = [
  {
    id: 'cat',
    label: 'Cats',
    subcategories: [
      { id: 'food', label: 'Food', emoji: '🍖' },
      { id: 'medicine', label: 'Medicine', emoji: '💊' },
      { id: 'accessories', label: 'Accessories', emoji: '🎀' },
      { id: 'toys', label: 'Toys', emoji: '🧶' },
    ],
  },
  {
    id: 'dog',
    label: 'Dogs',
    subcategories: [
      { id: 'food', label: 'Food', emoji: '🦴' },
      { id: 'medicine', label: 'Medicine', emoji: '💉' },
      { id: 'accessories', label: 'Accessories', emoji: '🦺' },
      { id: 'toys', label: 'Toys', emoji: '🎾' },
    ],
  },
  {
    id: 'bird',
    label: 'Birds',
    subcategories: [
      { id: 'food', label: 'Food', emoji: '🌾' },
      { id: 'medicine', label: 'Medicine', emoji: '💧' },
      { id: 'accessories', label: 'Accessories', emoji: '🏠' },
      { id: 'toys', label: 'Toys', emoji: '🪞' },
    ],
  },
  {
    id: 'fish',
    label: 'Fish',
    subcategories: [
      { id: 'food', label: 'Food', emoji: '🐟' },
      { id: 'medicine', label: 'Medicine', emoji: '💊' },
      { id: 'accessories', label: 'Accessories', emoji: '🪸' },
      { id: 'aquarium', label: 'Aquariums', emoji: '🐠' },
    ],
  },
  {
    id: 'pets',
    label: 'Other Pets',
    subcategories: [
      { id: 'food', label: 'Food', emoji: '🥩' },
      { id: 'medicine', label: 'Medicine', emoji: '💊' },
      { id: 'accessories', label: 'Accessories', emoji: '🐾' },
      { id: 'grooming', label: 'Grooming', emoji: '✂️' },
    ],
  },
  {
    id: 'goat',
    label: 'Goats',
    subcategories: [
      { id: 'food', label: 'Food', emoji: '🌿' },
      { id: 'medicine', label: 'Medicine', emoji: '💉' },
      { id: 'supplements', label: 'Supplements', emoji: '🧪' },
    ],
  },
  {
    id: 'rabbit',
    label: 'Rabbits',
    subcategories: [
      { id: 'food', label: 'Food', emoji: '🥕' },
      { id: 'medicine', label: 'Medicine', emoji: '💊' },
      { id: 'accessories', label: 'Accessories', emoji: '🏠' },
    ],
  },
  {
    id: 'medicine',
    label: 'Pharmacy',
    subcategories: [
      { id: 'cat-medicine', label: 'Cat Medicine', emoji: '🐱' },
      { id: 'dog-medicine', label: 'Dog Medicine', emoji: '🐶' },
      { id: 'bird-medicine', label: 'Bird Medicine', emoji: '🐦' },
      { id: 'fish-medicine', label: 'Fish Medicine', emoji: '🐠' },
      { id: 'goat-medicine', label: 'Goat Medicine', emoji: '🐐' },
      { id: 'general', label: 'General Medicine', emoji: '💊' },
    ],
  },
];

/* ─── Single category with hover-triggered dropdown ─── */
const CategoryItem = ({ cat, activeDropdown, setActiveDropdown }) => {
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const hasDropdown = cat.subcategories && cat.subcategories.length > 0;
  
  const isOpen = activeDropdown === cat.id;

  const open = () => {
    if (window.innerWidth >= 768) {
      clearTimeout(timeoutRef.current);
      setActiveDropdown(cat.id);
    }
  };

  const close = () => {
    if (window.innerWidth >= 768) {
      timeoutRef.current = setTimeout(() => {
        setActiveDropdown((prev) => (prev === cat.id ? null : prev));
      }, 150);
    }
  };

  const handleMainClick = () => {
    if (hasDropdown) {
      // Toggle on click for mobile, but also navigate to "view all"
      setActiveDropdown((prev) => (prev === cat.id ? null : cat.id));
    } else {
      navigate(`/products?animalType=${cat.id}`);
    }
  };

  const handleSubClick = (sub) => {
    setActiveDropdown(null);
    navigate(`/products?animalType=${cat.id}&category=${sub.id}`);
  };

  const handleViewAll = () => {
    setActiveDropdown(null);
    navigate(`/products?animalType=${cat.id}`);
  };

  // Determine dropdown alignment to prevent screen overflow
  const getDropdownPosition = (id) => {
    if (['fish', 'bird'].includes(id)) return 'md:left-0';
    if (['pets', 'goat', 'rabbit', 'medicine'].includes(id)) return 'md:right-0 md:left-auto';
    return 'left-0';
  };

  return (
    <li
      className="relative block"
      onMouseEnter={open}
      onMouseLeave={close}
    >
      {/* Main button */}
      <button
        onClick={handleMainClick}
        className={`flex items-center gap-1.5 px-3 md:px-4 py-4 text-[14px] md:text-[15px] font-bold transition-all duration-300 relative group ${
          isOpen
            ? 'text-brand-mid'
            : 'text-gray-300 hover:text-white'
        }`}
      >
        <span className="whitespace-nowrap tracking-wide">{cat.label}</span>
        {hasDropdown && (
          <ChevronDown
            size={14}
            className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-mid' : 'text-gray-400 group-hover:text-white'}`}
          />
        )}
        {/* Animated bottom underline */}
        <div className={`absolute bottom-0 left-0 h-[3px] bg-brand-mid transition-all duration-300 ${isOpen ? 'w-full' : 'w-0 group-hover:w-full'}`}></div>
      </button>

      {/* Dropdown Panel — positioned outside the overflow container */}
      {hasDropdown && isOpen && (
        <div
          className={`absolute top-full mt-0 pt-0 z-[100] ${getDropdownPosition(cat.id)}`}
          onMouseEnter={open}
          onMouseLeave={close}
        >
          <div className="w-56 bg-black/95 backdrop-blur-xl rounded-b-2xl shadow-[0_15px_40px_rgba(0,0,0,0.5)] border border-white/10 border-t-0 overflow-hidden animate-[fadeSlideIn_0.2s_ease-out]">
            {/* View All header */}
            <button
              onClick={handleViewAll}
              className="w-full flex items-center justify-between px-5 py-4 text-[13px] font-bold text-white bg-white/5 hover:bg-brand-mid transition-all border-b border-white/10 group/header relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/header:translate-x-[100%] transition-transform duration-700"></div>
              <span className="relative z-10 uppercase tracking-[0.15em]">View all {cat.label}</span>
              <svg className="transform group-hover/header:translate-x-1 transition-transform relative z-10" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>

            {/* Subcategory items */}
            {cat.subcategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => handleSubClick(sub)}
                className="w-full flex items-center px-5 py-3.5 text-[14px] text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200 group border-b border-white/5 last:border-b-0 font-medium relative"
              >
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-brand-mid opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="group-hover:translate-x-2 transition-transform duration-200 tracking-wide">{sub.label}</span>
                <svg className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-brand-mid" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            ))}
          </div>
        </div>
      )}
    </li>
  );
};

/* ═══════════════════════════════════════════
   CategoryNav — Evenly spaced with dropdowns
   ═══════════════════════════════════════════ */
const CategoryNav = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const stickyClasses = isHomePage
    ? `sticky top-0 z-40 transition-all duration-300 ease-in-out ${isScrolled ? 'shadow-lg bg-black/95 backdrop-blur-md' : 'shadow-none bg-black'}`
    : 'relative z-40 bg-black shadow-md';

  return (
    <nav ref={navRef} className={`hidden md:block ${stickyClasses}`}>
      <div className="container mx-auto max-w-[1350px] px-4">
        <ul className="flex flex-wrap items-center justify-between w-full py-0">
          {categories.map((cat) => (
            <CategoryItem 
              key={cat.id} 
              cat={cat} 
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
            />
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default CategoryNav;
