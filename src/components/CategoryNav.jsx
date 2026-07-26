import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

/* ─── Category data with subcategories ─── */
const categories = [
  {
    id: 'cat',
    label: 'বিড়াল',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3.1-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z"/><path d="M8 14v.5"/><path d="M16 14v.5"/><path d="M11.25 16.25h1.5L12 17l-.75-.75Z"/></svg>
    ),
    subcategories: [
      { id: 'food', label: 'খাবার', emoji: '🍖' },
      { id: 'medicine', label: 'ওষুধ', emoji: '💊' },
      { id: 'accessories', label: 'এক্সেসরিজ', emoji: '🎀' },
      { id: 'toys', label: 'খেলনা', emoji: '🧶' },
    ],
  },
  {
    id: 'dog',
    label: 'কুকুর',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.7.28 1.4.51 2"/><path d="M14 5.172C14 3.782 15.577 2.679 17.5 3c2.823.47 4.113 6.006 4 7-.08.7-.28 1.4-.51 2"/><path d="M12 21.5c-3.5 0-6-2.5-6-5.5 0-2 1.5-3.5 3-4.5 1-1 3-2 3-2s2 1 3 2c1.5 1 3 2.5 3 4.5 0 3-2.5 5.5-6 5.5z"/><path d="M10 16.5c1 .5 3 .5 4 0"/></svg>
    ),
    subcategories: [
      { id: 'food', label: 'খাবার', emoji: '🦴' },
      { id: 'medicine', label: 'ওষুধ', emoji: '💉' },
      { id: 'accessories', label: 'এক্সেসরিজ', emoji: '🦺' },
      { id: 'toys', label: 'খেলনা', emoji: '🎾' },
    ],
  },
  {
    id: 'bird',
    label: 'পাখি',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 7h.01"/><path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20"/><path d="m20 7 2 .5-2 .5"/><path d="M10 18v3"/><path d="M14 17.75V21"/><path d="M7 18a6 6 0 0 0 3.84-10.61"/></svg>
    ),
    subcategories: [
      { id: 'food', label: 'খাবার', emoji: '🌾' },
      { id: 'medicine', label: 'ওষুধ', emoji: '💧' },
      { id: 'accessories', label: 'এক্সেসরিজ', emoji: '🏠' },
      { id: 'toys', label: 'খেলনা', emoji: '🪞' },
    ],
  },
  {
    id: 'fish',
    label: 'মাছ',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z"/><path d="M18 12h.01"/><path d="M2 9.6v4.8a2 2 0 0 0 2 2h1.5a2 2 0 0 1 2 2v.1"/><path d="M2 14.4V9.6a2 2 0 0 1 2-2h1.5a2 2 0 0 0 2-2v-.1"/></svg>
    ),
    subcategories: [
      { id: 'food', label: 'খাবার', emoji: '🐟' },
      { id: 'medicine', label: 'ওষুধ', emoji: '💊' },
      { id: 'accessories', label: 'এক্সেসরিজ', emoji: '🪸' },
      { id: 'aquarium', label: 'অ্যাকুরিয়াম', emoji: '🐠' },
    ],
  },
  {
    id: 'pets',
    label: 'পোষা পশু',
    hideOnMobile: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21.5c-3.5 0-6-2.5-6-5.5 0-2 1.5-3.5 3-4.5 1-1 3-2 3-2s2 1 3 2c1.5 1 3 2.5 3 4.5 0 3-2.5 5.5-6 5.5z"/><circle cx="7.5" cy="11.5" r="2.5"/><circle cx="16.5" cy="11.5" r="2.5"/><circle cx="10" cy="7" r="2"/><circle cx="14" cy="7" r="2"/></svg>
    ),
    subcategories: [
      { id: 'food', label: 'খাবার', emoji: '🥩' },
      { id: 'medicine', label: 'ওষুধ', emoji: '💊' },
      { id: 'accessories', label: 'এক্সেসরিজ', emoji: '🐾' },
      { id: 'grooming', label: 'গ্রুমিং', emoji: '✂️' },
    ],
  },
  {
    id: 'goat',
    label: 'ছাগল',
    hideOnMobile: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
    ),
    subcategories: [
      { id: 'food', label: 'খাবার', emoji: '🌿' },
      { id: 'medicine', label: 'ওষুধ', emoji: '💉' },
      { id: 'supplements', label: 'সাপ্লিমেন্ট', emoji: '🧪' },
    ],
  },
  {
    id: 'medicine',
    label: 'ওষুধ',
    hideOnMobile: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="9" width="16" height="11" rx="2" ry="2"/><rect x="8" y="4" width="8" height="5" rx="1" ry="1"/><path d="M12 11v6"/><path d="M9 14h6"/></svg>
    ),
    subcategories: [
      { id: 'cat-medicine', label: 'বিড়ালের ওষুধ', emoji: '🐱' },
      { id: 'dog-medicine', label: 'কুকুরের ওষুধ', emoji: '🐶' },
      { id: 'bird-medicine', label: 'পাখির ওষুধ', emoji: '🐦' },
      { id: 'fish-medicine', label: 'মাছের ওষুধ', emoji: '🐠' },
      { id: 'goat-medicine', label: 'ছাগলের ওষুধ', emoji: '🐐' },
      { id: 'general', label: 'সাধারণ ওষুধ', emoji: '💊' },
    ],
  },

];

/* ─── Single category with hover-triggered dropdown ─── */
const CategoryItem = ({ cat, activeDropdown, setActiveDropdown }) => {
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const hasDropdown = cat.subcategories && cat.subcategories.length > 0;
  
  const isOpen = activeDropdown === cat.id;

  const open = (e) => {
    if (window.innerWidth >= 768) {
      clearTimeout(timeoutRef.current);
      setActiveDropdown(cat.id);
    }
  };

  const close = (e) => {
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
      navigate(`/products?category=${cat.id}`);
    }
  };

  const handleSubClick = (sub) => {
    setActiveDropdown(null);
    navigate(`/products?category=${cat.id}&subcategory=${sub.id}`);
  };

  const handleViewAll = () => {
    setActiveDropdown(null);
    navigate(`/products?category=${cat.id}`);
  };

  // Determine dropdown alignment to prevent screen overflow
  const getDropdownPosition = (id) => {
    // On mobile, 'bird' and 'fish' are on the right half of the screen
    if (['fish', 'bird'].includes(id)) return 'right-0 md:left-0';
    // On desktop, 'more', 'medicine', and 'goat' are on the right side
    if (['more', 'medicine', 'goat'].includes(id)) return 'md:right-0 md:left-auto';
    return 'left-0';
  };

  return (
    <li
      className={`relative ${cat.hideOnMobile ? 'hidden md:block' : 'block'}`}
      onMouseEnter={open}
      onMouseLeave={close}
    >
      {/* Main button */}
      <button
        onClick={handleMainClick}
        className={`flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium transition-all duration-200 border-b-2 ${
          isOpen
            ? 'text-white border-brand-mid'
            : 'text-gray-300 border-transparent hover:text-white hover:border-brand-mid'
        }`}
      >
        <span className={`transition-colors duration-200 ${isOpen ? 'text-brand-mid' : 'text-gray-300'}`}>
          {cat.icon}
        </span>
        <span className="whitespace-nowrap">{cat.label}</span>
        {hasDropdown && (
          <ChevronDown
            size={13}
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-brand-mid' : 'text-gray-300'}`}
          />
        )}
      </button>

      {/* Dropdown Panel — positioned outside the overflow container */}
      {hasDropdown && isOpen && (
        <div
          className={`absolute top-full mt-0 pt-1 z-[100] ${getDropdownPosition(cat.id)}`}
          onMouseEnter={open}
          onMouseLeave={close}
        >
          <div className="w-56 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden animate-[fadeSlideIn_0.2s_ease-out]">
            {/* View All header */}
            <button
              onClick={handleViewAll}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-black bg-brand-section hover:bg-brand-section transition-colors border-b border-brand-section"
            >
              <span className="text-base">🐾</span>
              <span>সব {cat.label} পণ্য দেখুন</span>
              <svg className="ml-auto" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>

            {/* Subcategory items */}
            {cat.subcategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => handleSubClick(sub)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-black hover:text-brand-dark hover:bg-brand-section transition-all duration-150 group border-b border-gray-50 last:border-b-0"
              >
                <span className="text-base w-6 text-center group-hover:scale-110 transition-transform duration-150">{sub.emoji}</span>
                <span className="font-medium">{sub.label}</span>
                <svg className="ml-auto opacity-0 -translate-x-1 group-hover:opacity-50 group-hover:translate-x-0 transition-all duration-150" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
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

  return (
    <nav
      ref={navRef}
      className={`hidden md:block font-bengali sticky top-[53px] lg:top-[65px] z-40 transition-all duration-500 ${
        isScrolled
          ? 'bg-black/95 backdrop-blur-xl shadow-sm border-b border-gray-800'
          : 'bg-black'
      }`}
    >
      <div className="container mx-auto max-w-[1350px] px-2 sm:px-4">
        <ul className="flex items-center justify-between w-full">
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
