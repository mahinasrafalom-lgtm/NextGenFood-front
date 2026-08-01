import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, Package, Truck, Home, CalendarClock, ChevronRight, FileText } from 'lucide-react';
import { trackOrder, cancelOrder } from '../services/api';
import CancelOrderModal from '../components/CancelOrderModal';
import CancelledOrderHero from '../components/CancelledOrderHero';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [orderData, setOrderData] = useState(null);
  const [loadingCancel, setLoadingCancel] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  
  // Use the real order ID passed from Checkout, or fallback
  const orderId = location.state?.orderId || `NXT-${Math.floor(100000 + Math.random() * 900000)}`;
  
  // Calculate estimated delivery date (2 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 2);
  const formattedDate = deliveryDate.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (location.state?.orderId) {
      trackOrder(location.state.orderId)
        .then(data => setOrderData(data))
        .catch(err => console.error("Could not fetch order data:", err));
    }
  }, [location.state]);

  const getStepIndex = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'delivered') return 3;
    if (s === 'shipped') return 2;
    if (s === 'processing') return 1;
    return 0;
  };

  const handleCancelOrder = async (reason) => {
    try {
      setLoadingCancel(true);
      const res = await cancelOrder(orderData.id, reason);
      setOrderData(res.order || { ...orderData, status: 'Cancelled' });
      setIsCancelModalOpen(false);
    } catch (err) {
      alert('Failed to cancel the order. Please try again or contact support.');
    } finally {
      setLoadingCancel(false);
    }
  };

  const currentStep = orderData ? getStepIndex(orderData.status) : 0;

  return (
    <div className="min-h-screen bg-[#f5f6f8] pb-20 pt-6 md:pt-10">
      <div className="max-w-[700px] mx-auto px-4">
        
        {/* Success Header Card */}
        <div className="bg-white rounded-3xl p-8 text-center shadow-sm border border-gray-100 mb-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-[#f68b1e]"></div>
          
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
            <CheckCircle2 size={40} className="text-green-500" />
          </div>
          
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">
            {orderData ? 'Order Details' : 'Order Confirmed!'}
          </h1>
          <p className="text-gray-500 text-sm md:text-base max-w-[400px] mx-auto leading-relaxed">
            {orderData 
              ? `Here are the details for your order. Current status: ${orderData.status}.`
              : 'Thank you for shopping with NexGen Veterinary. Your order has been successfully placed and is being processed.'}
          </p>
          
          <div className="mt-8 p-4 bg-brand-section/50 rounded-2xl inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-8 border border-brand-section/50">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Order Number</p>
              <p className="text-lg font-black text-brand-mid">{orderData?.id || orderId}</p>
            </div>
            <div className="hidden sm:block w-px h-10 bg-brand-mid/50"></div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">{orderData ? 'Order Date' : 'Est. Delivery'}</p>
              <p className="text-lg font-bold text-gray-800">{orderData?.date || formattedDate}</p>
            </div>
            {orderData && (
              <>
                <div className="hidden sm:block w-px h-10 bg-brand-mid/50"></div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Status</p>
                  <p className={`text-lg font-bold ${
                    orderData.status === 'Delivered' ? 'text-green-600' :
                    orderData.status === 'Shipped' ? 'text-amber-600' :
                    'text-brand-mid'
                  }`}>{orderData.status}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Tracking Timeline Card */}
        {orderData?.status !== 'Cancelled' ? (
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-8 flex items-center gap-2">
              <CalendarClock size={20} className="text-brand-mid" />
              Track Your Order
            </h2>
            
            <div className="relative">
              {/* Connecting Line - Background */}
              <div className="absolute left-6 top-8 bottom-8 w-1 bg-gray-100 rounded-full md:left-auto md:top-6 md:right-12 md:bottom-auto md:w-[calc(100%-6rem)] md:h-1 md:-translate-y-1/2"></div>
              
              {/* Connecting Line - Active */}
              <div 
                className="absolute left-6 top-8 w-1 bg-brand-mid rounded-full transition-all duration-500 hidden md:block md:left-12 md:top-6 md:h-1 md:-translate-y-1/2" 
                style={{ width: `calc(${(currentStep / 3) * 100}% - ${(currentStep / 3) * 6}rem)` }}
              ></div>
              
              {/* Status Steps */}
              <div className="flex flex-col md:flex-row gap-8 md:gap-0 justify-between relative z-10">
                
                {/* Step 1: Placed */}
                <div className="flex md:flex-col items-center gap-4 md:gap-3 group z-10 bg-white md:bg-transparent">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-[0_0_0_4px_white] shrink-0 transition-all duration-300 ${currentStep >= 0 ? 'bg-green-500 shadow-[0_4px_10px_rgba(34,197,94,0.3)] scale-110' : 'bg-white border-2 border-gray-200'}`}>
                    <FileText size={20} className={currentStep >= 0 ? "text-white" : "text-gray-300"} />
                  </div>
                  <div className="md:text-center">
                    <p className={`font-bold text-sm ${currentStep >= 0 ? 'text-gray-900' : 'text-gray-400'}`}>Order Placed</p>
                    <p className="text-xs text-gray-400 mt-0.5">We have received your order</p>
                  </div>
                </div>

                {/* Step 2: Processing */}
                <div className="flex md:flex-col items-center gap-4 md:gap-3 group z-10 bg-white md:bg-transparent">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-[0_0_0_4px_white] transition-all duration-300 ${currentStep >= 1 ? 'bg-brand-mid shadow-[0_4px_10px_rgba(246,139,30,0.3)] scale-110' : 'bg-white border-2 border-gray-200'}`}>
                    <Package size={20} className={currentStep >= 1 ? "text-white" : "text-gray-300"} />
                  </div>
                  <div className="md:text-center">
                    <p className={`font-bold text-sm ${currentStep >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>Processing</p>
                    <p className="text-xs text-gray-400 mt-0.5">Preparing your items</p>
                  </div>
                </div>

                {/* Step 3: Shipped */}
                <div className="flex md:flex-col items-center gap-4 md:gap-3 group z-10 bg-white md:bg-transparent">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-[0_0_0_4px_white] transition-all duration-300 ${currentStep >= 2 ? 'bg-brand-mid shadow-[0_4px_10px_rgba(246,139,30,0.3)] scale-110' : 'bg-white border-2 border-gray-200'}`}>
                    <Truck size={20} className={currentStep >= 2 ? "text-white" : "text-gray-300"} />
                  </div>
                  <div className="md:text-center">
                    <p className={`font-bold text-sm ${currentStep >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>Shipped</p>
                    <p className="text-xs text-gray-400 mt-0.5">On the way to you</p>
                  </div>
                </div>

                {/* Step 4: Delivered */}
                <div className="flex md:flex-col items-center gap-4 md:gap-3 group z-10 bg-white md:bg-transparent">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-[0_0_0_4px_white] transition-all duration-300 ${currentStep >= 3 ? 'bg-brand-mid shadow-[0_4px_10px_rgba(246,139,30,0.3)] scale-110' : 'bg-white border-2 border-gray-200'}`}>
                    <Home size={20} className={currentStep >= 3 ? "text-white" : "text-gray-300"} />
                  </div>
                  <div className="md:text-center">
                    <p className={`font-bold text-sm ${currentStep >= 3 ? 'text-gray-900' : 'text-gray-400'}`}>Delivered</p>
                    <p className="text-xs text-gray-400 mt-0.5">Arrived at destination</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <CancelledOrderHero reason={orderData?.cancelReason} />
          </div>
        )}

        {/* Order Items */}
        {orderData && orderData.items && orderData.items.length > 0 && (
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Package size={20} className="text-brand-mid" />
              Items in this order
            </h2>
            <div className="space-y-4">
              {orderData.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-brand-mid/30 transition-colors">
                  <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center p-2 border border-gray-100">
                    <img src={item.image || item.images?.[0] || '/placeholder.png'} alt={item.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-800 text-sm md:text-base truncate">{item.name}</h4>
                    <p className="text-gray-500 text-sm mt-0.5">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-900">৳{((item.price || item.priceMin || 0) * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4">
              {orderData.status !== 'Delivered' && orderData.status !== 'Cancelled' && orderData.status !== 'Shipped' && (
                <button 
                  onClick={() => setIsCancelModalOpen(true)}
                  disabled={loadingCancel}
                  className="text-sm font-bold text-red-500 hover:text-red-700 underline underline-offset-2 transition-colors disabled:opacity-50"
                >
                  Cancel Order
                </button>
              )}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center gap-6 min-w-[250px] ml-auto">
                <span className="text-gray-600 font-medium">Total Amount</span>
                <span className="text-2xl font-bold text-brand-dark ml-auto">{orderData.total}</span>
              </div>
            </div>
          </div>
        )}

        <CancelOrderModal 
          isOpen={isCancelModalOpen}
          onClose={() => setIsCancelModalOpen(false)}
          onConfirm={handleCancelOrder}
          loading={loadingCancel}
        />

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
