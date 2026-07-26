import React from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import OurBrandsCard from './OurBrandsCard';

const BrandsSection = ({ brands = [] }) => {
  const displayBrands = brands;
  const shouldLoop = displayBrands.length >= 7;

  return (
    <section className="pt-4 pb-8 lg:pt-6 lg:pb-10 font-bengali relative overflow-hidden bg-transparent">
      
      <div className="container mx-auto px-4 max-w-[1350px] relative z-10">
        
        {/* Header with full width border and active tab border */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-2 relative">
          <h2 className="text-lg lg:text-xl font-bold text-gray-800 tracking-wide relative">
            Our Brands
            {/* The active tab underline */}
            <div className="absolute -bottom-[9px] left-0 w-full h-[2px] bg-brand-mid"></div>
          </h2>
          <Link to="/products?brand=all" className="flex items-center gap-1 text-[11px] text-brand-mid font-bold uppercase tracking-wider hover:opacity-80 transition-opacity">
            SEE ALL <ArrowRight size={14} strokeWidth={2.5} className="ml-0.5" />
          </Link>
        </div>
        
        {/* Swiper Carousel for Brands */}
        <div className="py-2 product-carousel-wrapper relative group">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            pagination={{ clickable: true, dynamicBullets: true, dynamicMainBullets: 1 }}
            navigation={{
              nextEl: '.swiper-button-next-custom-brands',
              prevEl: '.swiper-button-prev-custom-brands',
            }}
            spaceBetween={8} // Highly reduced distance
            slidesPerView={3} // Fit more on mobile
            slidesPerGroup={1}
            loop={shouldLoop}
            speed={500}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: { slidesPerView: 4, spaceBetween: 12 },
              1024: { slidesPerView: 6, spaceBetween: 12 },
              1280: { slidesPerView: 7, spaceBetween: 16 },
              1536: { slidesPerView: 8, spaceBetween: 16 },
            }}
            className="pb-12 !static"
          >
            {displayBrands.map((brand, idx) => (
              <SwiperSlide key={idx} className="h-auto">
                <OurBrandsCard brand={brand} />
              </SwiperSlide>
            ))}
          </Swiper>
          
          {/* Custom Navigation Arrows */}
          <button className="swiper-button-prev-custom-brands absolute top-[40%] -left-3 lg:-left-5 z-10 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl shadow-brand-dark/5 border border-gray-100 flex items-center justify-center text-gray-500 hover:text-brand-primary hover:border-brand-primary hover:scale-110 transition-all opacity-0 group-hover:opacity-100 hidden md:flex cursor-pointer">
            <ChevronLeft className="w-6 h-6 mr-0.5" />
          </button>
          <button className="swiper-button-next-custom-brands absolute top-[40%] -right-3 lg:-right-5 z-10 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl shadow-brand-dark/5 border border-gray-100 flex items-center justify-center text-gray-500 hover:text-brand-primary hover:border-brand-primary hover:scale-110 transition-all opacity-0 group-hover:opacity-100 hidden md:flex cursor-pointer">
            <ChevronRight className="w-6 h-6 ml-0.5" />
          </button>
        </div>
        
      </div>
    </section>
  );
};

export default BrandsSection;
