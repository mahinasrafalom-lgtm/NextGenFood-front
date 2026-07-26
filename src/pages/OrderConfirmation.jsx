import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, Package, Truck, Home, CalendarClock, ChevronRight, FileText } from 'lucide-react';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  // Generate a random order ID for display purposes
  const orderId = `NXT-${Math.floor(100000 + Math.random() * 900000)}`;
  
  // Calculate estimated delivery date (2 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 2);
  const formattedDate = deliveryDate.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });

  // Ensure scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f6f8] pb-20 pt-6 md:pt-10">
      <div className="max-w-[700px] mx-auto px-4">
        
        {/* Success Header Card */}
        <div className="bg-white rounded-3xl p-8 text-center shadow-sm border border-gray-100 mb-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-[#f68b1e]"></div>
          
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
            <CheckCircle2 size={40} className="text-green-500" />
          </div>
          
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-500 text-sm md:text-base max-w-[400px] mx-auto leading-relaxed">
            Thank you for shopping with NexGen Veterinary. Your order has been successfully placed and is being processed.
          </p>
          
          <div className="mt-8 p-4 bg-brand-section/50 rounded-2xl inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-8 border border-brand-section/50">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Order Number</p>
              <p className="text-lg font-black text-brand-mid">{orderId}</p>
            </div>
            <div className="hidden sm:block w-px h-10 bg-brand-mid/50"></div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Est. Delivery</p>
              <p className="text-lg font-bold text-gray-800">{formattedDate}</p>
            </div>
          </div>
        </div>

        {/* Tracking Timeline Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-8 flex items-center gap-2">
            <CalendarClock size={20} className="text-brand-mid" />
            Track Your Order
          </h2>
          
          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute left-6 top-8 bottom-8 w-1 bg-gray-100 rounded-full md:left-auto md:top-6 md:right-12 md:bottom-auto md:w-[calc(100%-6rem)] md:h-1 md:-translate-y-1/2"></div>
            
            {/* Status Steps */}
            <div className="flex flex-col md:flex-row gap-8 md:gap-0 justify-between relative z-10">
              
              {/* Step 1: Placed (Active) */}
              <div className="flex md:flex-col items-center gap-4 md:gap-3 group">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_0_4px_white,0_4px_10px_rgba(34,197,94,0.3)] shrink-0 transition-transform group-hover:scale-110">
                  <FileText size={20} className="text-white" />
                </div>
                <div className="md:text-center">
                  <p className="font-bold text-gray-900 text-sm">Order Placed</p>
                  <p className="text-xs text-gray-500 mt-0.5">We have received your order</p>
                </div>
              </div>

              {/* Step 2: Processing */}
              <div className="flex md:flex-col items-center gap-4 md:gap-3 group">
                <div className="w-12 h-12 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center shrink-0 shadow-[0_0_0_4px_white] transition-colors group-hover:border-brand-mid">
                  <Package size={20} className="text-gray-300 group-hover:text-brand-mid" />
                </div>
                <div className="md:text-center">
                  <p className="font-bold text-gray-400 text-sm group-hover:text-gray-600 transition-colors">Processing</p>
                  <p className="text-xs text-gray-400 mt-0.5">Preparing your items</p>
                </div>
              </div>

              {/* Step 3: Shipped */}
              <div className="flex md:flex-col items-center gap-4 md:gap-3 group">
                <div className="w-12 h-12 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center shrink-0 shadow-[0_0_0_4px_white] transition-colors group-hover:border-brand-mid">
                  <Truck size={20} className="text-gray-300 group-hover:text-brand-mid" />
                </div>
                <div className="md:text-center">
                  <p className="font-bold text-gray-400 text-sm group-hover:text-gray-600 transition-colors">Shipped</p>
                  <p className="text-xs text-gray-400 mt-0.5">On the way to you</p>
                </div>
              </div>

              {/* Step 4: Delivered */}
              <div className="flex md:flex-col items-center gap-4 md:gap-3 group">
                <div className="w-12 h-12 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center shrink-0 shadow-[0_0_0_4px_white] transition-colors group-hover:border-brand-mid">
                  <Home size={20} className="text-gray-300 group-hover:text-brand-mid" />
                </div>
                <div className="md:text-center">
                  <p className="font-bold text-gray-400 text-sm group-hover:text-gray-600 transition-colors">Delivered</p>
                  <p className="text-xs text-gray-400 mt-0.5">Arrived at destination</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => navigate('/profile')}
            className="flex-1 py-4 bg-white border-2 border-gray-100 rounded-2xl font-bold text-gray-700 hover:border-gray-200 hover:bg-gray-50 transition-all shadow-sm active:scale-[0.98]"
          >
            View Order History
          </button>
          <button 
            onClick={() => navigate('/')}
            className="flex-1 py-4 bg-gradient-to-r from-[#f68b1e] to-[#ff9800] rounded-2xl font-bold text-white shadow-[0_4px_15px_rgba(197,160,89,0.3)] hover:shadow-[0_6px_20px_rgba(197,160,89,0.4)] transition-all active:scale-[0.98] flex justify-center items-center gap-2 group"
          >
            Continue Shopping
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default OrderConfirmation;
