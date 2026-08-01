import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Truck, HeadphonesIcon, ShieldCheck, HeartPulse, Stethoscope, Package, ChevronLeft, ChevronRight, Cat, Dog, Fish, Bird, Star, Award, Gift, Clock, CreditCard, ThumbsUp, ShoppingBag, Zap, Sparkles, Smile, Activity } from 'lucide-react';

const HeroBanner = ({ banners }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const getButtonLink = (text) => {
    const lowerText = (text || '').toLowerCase();
    
    // Check for consultation keywords (English & Bangla)
    if (
      lowerText.includes('পরামর্শ') || 
      lowerText.includes('consult') || 
      lowerText.includes('advice') ||
      lowerText.includes('doctor') ||
      lowerText.includes('ডাক্তার')
    ) {
      return 'open-consultation-modal';
    }
    
    // Default to products
    return '/products';
  };

  const handleButtonClick = (action) => {
    if (action === 'open-consultation-modal') {
      window.dispatchEvent(new CustomEvent('openConsultationModal'));
    } else {
      navigate(action);
    }
  };

  const IconMap = {
    Stethoscope, HeartPulse, ShieldCheck, HeadphonesIcon, Truck, CheckCircle2, Package,
    Cat, Dog, Fish, Bird, Star, Award, Gift, Clock, CreditCard, ThumbsUp, ShoppingBag, Zap, Sparkles, Smile, Activity
  };

  const displayBanners = banners && banners.length > 0 ? banners : [];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % displayBanners.length);
    }, 5000); 
    return () => clearInterval(timer);
  }, [displayBanners.length]);

  return (
    <section className="bg-[#FBF9F6] font-bengali pt-2 pb-2 lg:pt-4 lg:pb-3 overflow-hidden transition-colors duration-700 w-full">
      <div className="container mx-auto px-2 sm:px-4 w-full max-w-[1350px] overflow-hidden">
        
        {/* Banner Container */}
        <div 
          className="rounded-xl sm:rounded-2xl relative overflow-hidden w-full h-[200px] sm:h-[260px] md:h-[300px] lg:h-[360px] transition-colors duration-1000"
          style={{ backgroundColor: displayBanners[currentSlide]?.containerBg || '#f9fafb' }}
        >
          
          <div 
            className="flex transition-transform duration-500 ease-out h-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {displayBanners.map((slide, index) => {
              const isActive = index === currentSlide;
              return (
                <div 
                  key={slide.id} 
                  className="w-full h-full flex-shrink-0 relative"
                >
                  {/* Full-cover Background Image */}
                  <div className={`absolute inset-0 w-full h-full transition-transform duration-1000 ease-out`}>
                    <img 
                      src={slide.image} 
                      alt={slide.titleTop} 
                      className="w-full h-full object-cover sm:object-right"
                      style={{ objectPosition: 'center right' }}
                    />
                    {/* Subtle gradient to ensure text readability */}
                    <div className={`absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent w-[90%] sm:w-[70%] lg:w-[65%] mix-blend-normal opacity-90`}></div>
                  </div>

                  {/* Content over the image */}
                  <div className="relative w-[75%] sm:w-[65%] lg:w-[60%] h-full pl-4 sm:pl-8 lg:pl-14 flex flex-col justify-center z-20">

                    {/* Main Title */}
                    <h2 
                      className={`text-[13px] leading-tight sm:text-3xl md:text-4xl lg:text-[42px] font-bold sm:leading-[1.15] mb-1 sm:mb-3 transition-all duration-700 ease-out delay-100 ${isActive ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}
                      style={{ color: slide.titleTopColor || '#111827' }}
                    >
                      {slide.titleTop} <br />
                      <span 
                        className="transition-colors duration-700"
                        style={{ color: slide.titleHighlightColor || '#0891B2' }}
                      >
                        {slide.titleHighlight}
                      </span>
                      <span style={{ color: slide.titleBottomColor || '#111827' }}>
                        {slide.titleBottom}
                      </span>
                    </h2>
                    
                    <p 
                      className={`mb-1.5 sm:mb-4 text-[10px] sm:text-sm md:text-base lg:text-lg max-w-[160px] sm:max-w-md font-medium transition-all duration-700 ease-out delay-200 ${isActive ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'} leading-snug`}
                      style={{ color: slide.descColor || '#4B5563' }}
                    >
                      {slide.desc}
                    </p>
                    
                    {/* Features list - Stacked on mobile, side-by-side on desktop */}
                    <div 
                      className={`flex flex-col md:flex-row md:flex-wrap gap-y-1 gap-x-4 lg:gap-x-6 mb-2 sm:mb-5 transition-all duration-700 ease-out delay-300 ${isActive ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}
                    >
                      {slide.features?.map((feat, i) => {
                        const Icon = typeof feat.icon === 'string' ? IconMap[feat.icon] : feat.icon;
                        return (
                          <div key={i} className="flex items-center gap-1 sm:gap-2 text-[8.5px] sm:text-sm lg:text-[14px] font-medium" style={{ color: feat.textColor || '#374151' }}>
                            {Icon && <Icon className="w-2.5 h-2.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 transition-colors duration-700" style={{ color: feat.iconColor || '#0891B2' }} />}
                            {feat.text}
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Button */}
                    <div className={`transition-all duration-700 ease-out delay-[400ms] ${isActive ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}>
                      <button 
                        onClick={() => handleButtonClick(getButtonLink(slide.buttonText || 'শপ করুন / Shop Now'))}
                        className="transition-all duration-300 font-bengali font-medium py-1 px-2.5 sm:py-2.5 sm:px-6 lg:py-2.5 lg:px-8 rounded sm:rounded-lg inline-flex items-center gap-1 sm:gap-2 text-[8px] sm:text-sm lg:text-base hover:opacity-90"
                        style={{ backgroundColor: slide.buttonBgColor || '#0891B2', color: slide.buttonTextColor || '#F9F9F9' }}
                      >
                        {slide.buttonText || 'শপ করুন / Shop Now'} <ArrowRight className="w-2.5 h-2.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" style={{ color: slide.buttonArrowColor || '#F9F9F9' }} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Pagination indicators */}
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-40">
            {displayBanners.map((slide, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'w-4 sm:w-6' 
                    : 'opacity-30 hover:opacity-60 w-1.5 sm:w-2'
                }`}
                style={{ backgroundColor: slide.buttonBgColor || '#0891B2' }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
