import React from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Wishlist() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 text-center">
        <div className="w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart size={32} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Wishlist</h1>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Keep track of all the items you love! You haven't added any products to your wishlist yet.
        </p>
        <Link to="/products" className="inline-flex items-center justify-center bg-brand-primary text-white font-bold py-3 px-8 rounded-xl hover:bg-brand-mid transition-colors shadow-sm">
          Browse Products
        </Link>
      </div>
    </div>
  );
}
