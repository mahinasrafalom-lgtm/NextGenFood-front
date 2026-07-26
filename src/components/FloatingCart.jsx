import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const FloatingCart = () => {
  const { cartCount, cartTotal, openCartDrawer } = useCart();

  return (
    <div 
      id="floating-cart-icon"
      onClick={openCartDrawer}
      className="flex fixed right-0 top-[45%] -translate-y-1/2 z-[70] flex-col items-center cursor-pointer shadow-[0_4px_15px_rgba(0,0,0,0.12)] rounded-l-md overflow-hidden transition-transform hover:-translate-x-1 border border-r-0 border-gray-200"
    >
      
      {/* Top Section - Orange */}
      <div className="bg-brand-mid text-white py-2.5 px-2 flex flex-col items-center justify-center w-[60px] lg:w-[68px]">
        <ShoppingBag size={20} className="mb-1" />
        <span className="text-[9px] lg:text-[10px] font-medium text-center leading-tight">
          {cartCount} Items
        </span>
      </div>
      
      {/* Bottom Section - White */}
      <div className="bg-white text-brand-mid w-full py-1.5 flex justify-center">
        <span className="text-[10px] lg:text-[11px] font-bold">
          ৳{cartTotal.toFixed(2)}
        </span>
      </div>
      
    </div>
  );
};

export default FloatingCart;
