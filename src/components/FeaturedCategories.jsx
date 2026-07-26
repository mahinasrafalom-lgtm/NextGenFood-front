import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import FeaturedCategoriesCard from './FeaturedCategoriesCard';

const FeaturedCategories = ({ categories = [] }) => {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);
  
  // Triple the array for seamless infinite looping only if we have enough items
  const shouldLoop = categories.length > 5;
  const displayCategories = shouldLoop ? [...categories, ...categories, ...categories] : categories;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || isPaused || !shouldLoop) return;

    const intervalId = setInterval(() => {
      if (el) {
        el.scrollBy({ left: 150, behavior: 'smooth' });
        
        // Loop back seamlessly if we reach the end of the cloned sets
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 10) {
          setTimeout(() => {
            if (el) {
              el.style.scrollBehavior = 'auto';
              el.scrollLeft = el.scrollWidth / 3;
              el.style.scrollBehavior = 'smooth';
            }
          }, 500);
        }
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [isPaused]);

  const manualScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeft(scrollLeft > 5); // Added small threshold for mobile rendering
    setShowRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 5);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      handleScroll();
      el.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleScroll);
    }
    return () => {
      if (el) el.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [displayCategories]);

  return (
    <section className="pt-2 pb-2 lg:pt-4 lg:pb-4 bg-[#FBF9F6] font-bengali">
      <div className="container mx-auto px-4 max-w-[1350px] relative group">
        
        {/* Header */}
        <div className="text-center mb-5 sm:mb-8">
          <h2 className="text-[13px] sm:text-[15px] font-semibold text-gray-400 font-sans uppercase tracking-[0.2em]">
            Featured Categories
          </h2>
        </div>

        {/* Scrollable Container with Floating Arrows */}
        <div 
          className="relative group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Left Arrow */}
          <button 
            onClick={() => manualScroll('left')}
            className={`absolute left-0 top-[40%] -translate-y-1/2 -translate-x-3 sm:-translate-x-5 w-8 h-8 sm:w-10 sm:h-10 bg-brand-mid rounded-full shadow-md flex items-center justify-center text-white hover:bg-[#e07a19] hover:scale-110 transition-all active:scale-95 z-20 ${showLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <div 
            ref={scrollRef}
            className="flex items-center gap-3 sm:gap-6 overflow-x-auto hide-scrollbar py-2 px-6 sm:px-8 snap-x snap-mandatory"
            style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
          >
            {displayCategories.map((cat, idx) => (
              <FeaturedCategoriesCard key={idx} category={cat} />
            ))}
          </div>

          {/* Right Arrow */}
          <button 
            onClick={() => manualScroll('right')}
            className={`absolute right-0 top-[40%] -translate-y-1/2 translate-x-3 sm:translate-x-5 w-8 h-8 sm:w-10 sm:h-10 bg-brand-mid rounded-full shadow-md flex items-center justify-center text-white hover:bg-[#e07a19] hover:scale-110 transition-all active:scale-95 z-20 ${showRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
