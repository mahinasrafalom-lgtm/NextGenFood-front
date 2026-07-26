import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

const Cart = () => {
  return (
    <div className="min-h-[60vh] bg-gray-50 flex flex-col items-center justify-center p-4 font-sans text-center">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full flex flex-col items-center">
        <div className="w-20 h-20 bg-brand-section rounded-full flex items-center justify-center text-brand-mid mb-6 shadow-inner">
          <ShoppingBag size={40} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty!</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        
        <Link 
          to="/products" 
          className="w-full bg-brand-mid hover:bg-brand-mid text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
        >
          <ArrowLeft size={18} />
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default Cart;
