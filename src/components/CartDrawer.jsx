import React, { useState, useEffect, useRef } from 'react';
import { X, Minus, Plus, Trash2, ArrowRight, Gift, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { showToast } from './Toast';
import { fetchStorefrontData, fetchProducts } from '../services/api';

const CartDrawer = ({ isLoggedIn }) => {
  const { isDrawerOpen, closeCartDrawer, cartItems, cartTotal, updateQuantity, removeFromCart, addToCart } = useCart();
  const navigate = useNavigate();

  const [offer, setOffer] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const sliderRef = useRef(null);

  useEffect(() => {
    if (isDrawerOpen) {
      // Load dynamic offer
      fetchStorefrontData().then(data => {
        if (data && data.cartOffer && data.cartOffer.isActive) {
          setOffer(data.cartOffer);
        } else {
          setOffer(null);
        }
      }).catch(err => console.error("Failed to fetch storefront offer", err));

      // Load products for You May Also Like
      fetchProducts().then(data => {
        const cartIds = cartItems.map(i => i.id);
        const cartAnimalTypes = [...new Set(cartItems.map(i => i.animalType).filter(Boolean))];
        
        let filtered = (data || []).filter(item => !cartIds.includes(item._id) && !cartIds.includes(item.id));
        
        // Filter by animal types in cart if cart is not empty
        if (cartAnimalTypes.length > 0) {
          filtered = filtered.filter(item => cartAnimalTypes.includes(item.animalType));
        }
        
        setRecommendations(filtered);
      }).catch(err => console.error("Failed to fetch recommendations", err));
    }
  }, [isDrawerOpen, cartItems]);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el || isPaused || recommendations.length < 2) return;

    const intervalId = setInterval(() => {
      if (el) {
        el.scrollBy({ left: 232, behavior: 'smooth' });
        
        // Loop back if we reach the end
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 10) {
          setTimeout(() => {
            if (el) {
              el.style.scrollBehavior = 'auto';
              el.scrollLeft = 0;
              el.style.scrollBehavior = 'smooth';
            }
          }, 500);
        }
      }
    }, 2000);

    return () => clearInterval(intervalId);
  }, [isPaused, recommendations.length]);

  const handleNextRec = () => {
    if (sliderRef.current) sliderRef.current.scrollBy({ left: 232, behavior: 'smooth' });
  };

  const handlePrevRec = () => {
    if (sliderRef.current) sliderRef.current.scrollBy({ left: -232, behavior: 'smooth' });
  };

  // Offer calculation
  const target = offer ? offer.targetAmount : 0;
  const progress = Math.min((cartTotal / target) * 100, 100);
  const amountNeeded = target - cartTotal;
  const unlocked = amountNeeded <= 0;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300 ${
          isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCartDrawer}
      />

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white z-[101] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-[15px] font-bold text-gray-800 tracking-wide uppercase">SHOPPING CART</h2>
          <button 
            onClick={closeCartDrawer}
            className="flex items-center gap-1.5 text-[15px] font-medium text-gray-700 hover:text-brand-mid transition-colors"
          >
            Close <ArrowRight size={18} />
          </button>
        </div>

        {/* Scrollable Cart Content */}
        <div className="flex-1 overflow-y-auto flex flex-col bg-white hide-scrollbar">
          
          {/* Promotional Banner */}
          {offer && !unlocked && (
            <div className="p-3 pb-0">
              <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 relative overflow-hidden flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center shrink-0 shadow-sm shadow-yellow-500/20">
                  <Gift size={16} className="text-gray-900" />
                </div>
                <div className="flex-1 pr-6">
                  <p className="text-[12px] text-gray-700 font-medium">{offer.rewardTitle}</p>
                  <p className="text-[12px] font-medium text-gray-600 mt-0.5">
                    {unlocked ? (
                      <span className="text-green-600 font-bold">Offer Unlocked! 🎉</span>
                    ) : (
                      <>Add <strong className="text-[#f97316]">৳{amountNeeded.toLocaleString()}</strong> more to unlock!</>
                    )}
                  </p>
                </div>
                <button className="absolute top-2.5 right-2.5 text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={14} />
                </button>
                {/* Progress bar line at absolute bottom */}
                <div className="absolute bottom-0 left-0 h-1 bg-brand-mid/20 w-full">
                  <div className="h-full bg-brand-mid transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            </div>
          )}

          {/* Cart Items */}
          <div className="p-3 flex flex-col gap-2">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Trash2 size={24} className="text-gray-400" />
                </div>
                <p>Your cart is empty.</p>
              </div>
            ) : (
              cartItems.map(item => {
                const price = item.priceMin || item.price || 0;
                return (
                  <div key={item.id} className="flex gap-3 bg-white p-2 rounded-lg border border-gray-100 shadow-sm relative items-center">
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                      <X size={14} strokeWidth={1.5} />
                    </button>
                    
                    <div className="w-10 h-10 border border-gray-100 rounded flex items-center justify-center p-0.5 shrink-0 bg-white">
                      <img src={item.image} alt={item.name} className="max-h-full object-contain" />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-center pr-6">
                      <h4 className="text-[12px] font-medium text-gray-900 line-clamp-1 mb-0.5">
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-2">
                        {/* Quantity Pill */}
                        <div className="flex items-center border border-gray-200 rounded h-[22px]">
                          <button 
                            className="w-4 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus size={10} strokeWidth={2.5} />
                          </button>
                          <span className="w-4 h-full flex items-center justify-center text-[11px] font-bold text-gray-800 bg-gray-50/50">
                            {item.quantity}
                          </span>
                          <button 
                            className="w-4 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus size={10} strokeWidth={2.5} />
                          </button>
                        </div>
                        {/* Pricing */}
                        <span className="text-[11px] font-medium text-gray-600">
                          x ৳{price.toLocaleString()} = <strong className="text-gray-900">৳{(price * item.quantity).toLocaleString()}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Lower Section: Recommendations + Footer */}
        <div className="bg-[#F8F9FA] border-t border-gray-100 flex flex-col shrink-0">
          {/* You May Also Like */}
          {recommendations.length > 0 && (
            <div className="px-3 pt-3 pb-2">
              <div className="flex items-center justify-between mb-3">
                <div className="relative">
                  <h3 className="text-[15px] font-bold text-[#1f2937]">You May Also Like</h3>
                  <div className="absolute -bottom-1.5 left-0 w-8 h-[2px] bg-[#f97316]"></div>
                </div>
                <div className="flex gap-2">
                  <button onClick={handlePrevRec} className="w-6 h-6 rounded-full bg-[#f97316] text-white flex items-center justify-center hover:bg-[#ea580c] transition-colors shadow-sm">
                    <ChevronLeft size={14} strokeWidth={2} />
                  </button>
                  <button onClick={handleNextRec} className="w-6 h-6 rounded-full bg-[#f97316] text-white flex items-center justify-center hover:bg-[#ea580c] transition-colors shadow-sm">
                    <ChevronRight size={14} strokeWidth={2} />
                  </button>
                </div>
              </div>

              <div 
                ref={sliderRef}
                className="flex gap-3 overflow-x-auto hide-scrollbar scroll-smooth pb-2 -mx-1 px-1"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
              >
                {recommendations.slice(0, 6).map(rec => {
                  const recPrice = rec.priceMin || rec.price || 0;
                  return (
                    <div key={rec.id} className="w-[220px] shrink-0 bg-white border border-gray-200 rounded-lg p-2.5 flex items-center gap-3 shadow-sm relative group cursor-pointer" onClick={() => navigate(`/product/${rec.id}`)}>
                      <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-white">
                        <img src={rec.image} alt={rec.name} className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center items-start">
                        <h4 className="text-[12px] font-semibold text-gray-900 line-clamp-1 mb-0.5">
                          {rec.name}
                        </h4>
                        <div className="text-[11px] text-gray-500 mb-1.5">
                          ৳{recPrice.toLocaleString()}
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); addToCart(rec); }}
                          className="bg-[#f97316] hover:bg-[#ea580c] text-white text-[11px] font-medium px-3 py-0.5 rounded-full flex items-center gap-1 w-fit transition-colors shadow-sm"
                        >
                          <Plus size={10} strokeWidth={2.5} /> Add
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Checkout Footer */}
          <div className="p-3 pt-2">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[14px] font-bold text-gray-800">Total:</span>
              <span className="text-base font-bold text-gray-900">৳{cartTotal.toLocaleString()}</span>
            </div>
            <button 
              onClick={() => {
                closeCartDrawer();
                navigate('/checkout');
                window.scrollTo(0, 0);
              }}
              disabled={cartItems.length === 0}
              className="w-full bg-brand-mid hover:bg-[#e07a1b] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-lg transition-colors flex justify-center items-center text-[15px]"
            >
              CHECKOUT
            </button>
          </div>
        </div>

      </div>
    </>
  );
};

export default CartDrawer;
