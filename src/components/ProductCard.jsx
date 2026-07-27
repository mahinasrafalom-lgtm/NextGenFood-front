import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, ShoppingCart, Flame } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { triggerFlyToCart } from '../utils/cartAnimations';
import { showToast } from './Toast';

const ProductCard = ({ product }) => {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const imgRef = useRef(null);

  // Fallback to name if id is missing in mock data
  const productId = product._id || product.id || product.name;

  // Check if product is in cart
  const cartItem = cartItems.find(item => item.id === productId);
  const isInCart = !!cartItem;

  const handleAddToCart = (e) => {
    // Only trigger if not already added to avoid spamming
    if (!isInCart) {
      addToCart({ ...product, id: productId });
      
      // Trigger animation using the image ref
      if (imgRef.current) {
        triggerFlyToCart(imgRef.current);
      }

      // Show toast
      showToast('Success Added to Cart');
    }
  };

  // Logic to determine if we should show a "Save" badge (mocking original price)
  const hasDiscount = product.discount || (product.priceMax && product.priceMax > product.priceMin);
  const savings = product.priceMax ? product.priceMax - product.priceMin : 0;

  return (
    <div className="border border-gray-200 rounded-lg bg-[#FFFFFF] hover:shadow-md transition-shadow duration-300 flex flex-col h-full relative group overflow-hidden font-sans">
      
      {/* Discount / Best Selling Badge */}
      {hasDiscount && (
        <div className="absolute top-2 left-0 bg-[#FF4747] text-white text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-r-md z-10 flex items-center gap-1 shadow-sm pointer-events-none">
          <Flame size={12} className="hidden sm:block" /> {product.discount || 'Best Selling'}
        </div>
      )}

      {/* Image Container (Top Block) - Uniform image size */}
      <Link to={`/product/${productId}`} className="w-full aspect-square flex items-center justify-center overflow-hidden relative bg-[#FFFFFF] flex-shrink-0 block rounded-t-lg">
        <img 
          ref={imgRef}
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
      </Link>

      {/* Text/Content Container (Bottom Block) */}
      <div className="flex-1 flex flex-col p-4 bg-[#FFFFFF] text-[#666666] text-[14px]">
        {/* Category Label */}
        {product.category && (
          <div className="text-[11px] sm:text-[12px] text-gray-400 font-medium capitalize mb-[4px]">
            {product.category}{product.subcategory ? ` ${product.subcategory}` : ''}
          </div>
        )}

        {/* Product Title */}
        <Link to={`/product/${productId}`} className="text-[14px] font-semibold text-[#222831] line-clamp-2 hover:text-brand-mid cursor-pointer leading-snug mb-[8px] block">
          {product.name}
        </Link>
        
        {/* Price Area */}
        <div className="flex flex-wrap items-center gap-1.5 mb-[12px]">
          <span className="text-brand-mid font-bold text-[15px] sm:text-[16px]">
            ৳{product.priceMin.toLocaleString()}
          </span>
          {product.priceMax && (
            <>
              <span className="text-gray-400 line-through text-[11px] sm:text-[12px]">
                ৳{product.priceMax.toLocaleString()}
              </span>
              <span className="bg-[#a3d139] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                Save ৳{savings.toLocaleString()}
              </span>
            </>
          )}
        </div>

        {/* Action Area */}
        <div className="h-[36px] sm:h-[40px] mt-auto"> 
          {isInCart ? (
            <div className="flex items-center justify-between bg-[#FFFFFF] rounded border border-brand-mid h-full w-full overflow-hidden">
              <button 
                className="w-10 h-full flex items-center justify-center text-brand-mid hover:bg-brand-section transition-colors"
                onClick={() => updateQuantity(productId, cartItem.quantity - 1)}
              >
                <Minus size={16} />
              </button>
              
              <span className="flex-1 text-center font-bold text-brand-mid text-[14px]">
                {cartItem.quantity}
              </span>
              
              <button 
                className="w-10 h-full flex items-center justify-center text-brand-mid hover:bg-brand-section transition-colors"
                onClick={() => updateQuantity(productId, cartItem.quantity + 1)}
              >
                <Plus size={16} />
              </button>
            </div>
          ) : (
            <button 
              onClick={handleAddToCart}
              className="w-full h-full rounded text-[13px] font-bold transition-all duration-300 flex items-center justify-center gap-2 border border-brand-mid text-brand-mid hover:bg-brand-mid hover:text-white group/btn"
            >
              <ShoppingCart size={16} /> 
              <span>Add To Cart</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
