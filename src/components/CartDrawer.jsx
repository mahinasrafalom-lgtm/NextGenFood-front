import React from 'react';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { showToast } from './Toast';

const CartDrawer = ({ isLoggedIn }) => {
  const { isDrawerOpen, closeCartDrawer, cartItems, cartTotal, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

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
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-[101] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">SHOPPING CART</h2>
          <button 
            onClick={closeCartDrawer}
            className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
          >
            Close <X size={18} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-gray-50">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <Trash2 size={24} className="text-gray-400" />
              </div>
              <p>Your cart is empty.</p>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="flex gap-3 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                {/* Image */}
                <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center p-1 shrink-0">
                  <img src={item.image} alt={item.name} className="max-h-full object-contain" />
                </div>
                
                {/* Info */}
                <div className="flex-1 flex flex-col py-1">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-sm font-medium text-gray-800 line-clamp-2 leading-tight">
                      {item.name}
                    </h4>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  
                  <div className="mt-auto flex items-center justify-between pt-2">
                    {/* Quantity Selector matching ProductCard */}
                    <div className="flex items-center bg-gray-100 rounded border border-gray-200 h-8">
                      <button 
                        className="w-8 h-full flex items-center justify-center text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors rounded-l"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus size={14} />
                      </button>
                      <input 
                        type="text"
                        value={item.quantity}
                        readOnly
                        className="w-8 h-full text-center text-sm font-semibold bg-transparent border-none focus:outline-none pointer-events-none"
                      />
                      <button 
                        className="w-8 h-full flex items-center justify-center text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors rounded-r"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="font-bold text-brand-dark text-sm">
                      ৳{((item.priceMin || item.price || 0) * item.quantity).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-4 bg-white sticky bottom-0">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 font-medium">Subtotal:</span>
              <span className="text-lg font-bold text-gray-900">৳{cartTotal.toLocaleString()}</span>
            </div>
            <button 
              onClick={() => {
                closeCartDrawer();
                navigate('/checkout');
                window.scrollTo(0, 0);
              }}
              className="w-full bg-brand-mid hover:bg-[#e07a1b] text-white font-bold py-3.5 rounded-lg transition-colors flex justify-center items-center gap-2"
            >
              CHECKOUT
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
