import React from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import ProductCard from './ProductCard';

const ProductSection = ({ title, viewAllText, linkUrl = '/products', products, headerVariant = "centered" }) => {
  return (
    <section className="pt-[20px] pb-[15px] bg-white">
      <div className="container mx-auto px-2 sm:px-4 max-w-[1350px]">
        
        {/* Section Header */}
        {headerVariant === "left" ? (
          <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-2 relative">
            <h2 className="text-lg lg:text-xl font-bold text-gray-800 tracking-wide relative">
              {title}
              {/* The active tab underline */}
              <div className="absolute -bottom-[9px] left-0 w-full h-[2px] bg-brand-mid"></div>
            </h2>
            {viewAllText && (
              <Link to={linkUrl} className="flex items-center gap-1 text-[11px] text-brand-mid font-bold uppercase tracking-wider hover:opacity-80 transition-opacity">
                {viewAllText} <ArrowRight size={14} strokeWidth={2.5} className="ml-0.5" />
              </Link>
            )}
          </div>
        ) : (
          <div className="relative text-center mb-1 sm:mb-2">
            <h2 className="text-[22px] sm:text-[28px] font-medium text-gray-700 font-sans tracking-tight">
              {title}
            </h2>
            
            <div className="flex justify-center sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2 mt-3 sm:mt-0 gap-4">
              {viewAllText && (
                <Link to={linkUrl} className="text-sm font-semibold text-brand-mid hover:text-brand-dark hover:underline">
                  {viewAllText}
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Product Carousel */}
        <div className="mt-2 sm:mt-4 relative group product-carousel-wrapper">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            pagination={{ clickable: true, dynamicBullets: true, dynamicMainBullets: 1 }}
            navigation={{
              nextEl: '.swiper-button-next-custom',
              prevEl: '.swiper-button-prev-custom',
            }}
            spaceBetween={8} // mobile gap
            slidesPerView={2}
            slidesPerGroup={1}
            loop={products.length > 5}
            speed={500}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: { slidesPerView: 3, spaceBetween: 24 },
              1024: { slidesPerView: 4, spaceBetween: 24 },
              1280: { slidesPerView: 5, spaceBetween: 24 },
            }}
            className="pb-12 !static"
          >
            {products.map((product, idx) => (
              <SwiperSlide key={idx} className="h-auto">
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
          
          {/* Custom Navigation Arrows */}
          <button className="swiper-button-prev-custom absolute top-[40%] -left-3 lg:-left-5 z-10 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl shadow-brand-dark/5 border border-gray-100 flex items-center justify-center text-gray-500 hover:text-brand-primary hover:border-brand-primary hover:scale-110 transition-all opacity-0 group-hover:opacity-100 hidden md:flex cursor-pointer">
            <ChevronLeft className="w-6 h-6 mr-0.5" />
          </button>
          <button className="swiper-button-next-custom absolute top-[40%] -right-3 lg:-right-5 z-10 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl shadow-brand-dark/5 border border-gray-100 flex items-center justify-center text-gray-500 hover:text-brand-primary hover:border-brand-primary hover:scale-110 transition-all opacity-0 group-hover:opacity-100 hidden md:flex cursor-pointer">
            <ChevronRight className="w-6 h-6 ml-0.5" />
          </button>
        </div>

      </div>
    </section>
  );
};

export default ProductSection;
