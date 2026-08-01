import React, { useState, useEffect } from 'react';
import { Search, Package, Truck, CheckCircle, MapPin, Calendar, CreditCard, ChevronRight, History, PackageOpen, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { trackOrder, getUserOrders, cancelOrder } from '../services/api';
import CancelOrderModal from '../components/CancelOrderModal';
import CancelledOrderHero from '../components/CancelledOrderHero';
import { useAuth } from '../context/AuthContext';

const TrackOrder = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [loadingCancel, setLoadingCancel] = useState(false);
  
  const [recentOrders, setRecentOrders] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(false);

  useEffect(() => {
    if (currentUser && currentUser.email) {
      setLoadingRecent(true);
      getUserOrders(currentUser.email)
        .then(orders => setRecentOrders(orders))
        .catch(err => console.error('Failed to fetch recent orders', err))
        .finally(() => setLoadingRecent(false));
    }
  }, [currentUser]);

  const handleTrack = async (e, forceId = null) => {
    if (e) e.preventDefault();
    const idToTrack = forceId || orderId;
    if (!idToTrack.trim()) return;

    setLoading(true);
    setError('');
    setOrderData(null);

    try {
      // If user inputs without '#', we prepend it since our DB saves as '#ORD-XXXX'
      let formattedId = idToTrack.trim();
      if (!formattedId.startsWith('#')) {
        formattedId = '#' + formattedId;
      }
      
      const data = await trackOrder(formattedId);
      setOrderData(data);
    } catch (err) {
      setError(err.message || 'Order not found. Please check your Order ID.');
    } finally {
      setLoading(false);
    }
  };

  // Status mapping for Stepper
  const statusSteps = [
    { label: 'Order Placed', icon: FileText },
    { label: 'Processing', icon: Package },
    { label: 'Shipped', icon: Truck },
    { label: 'Delivered', icon: CheckCircle }
  ];

  const getStepIndex = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'delivered') return 3;
    if (s === 'shipped') return 2;
    if (s === 'processing') return 1;
    return 0; // default to Order Placed
  };

  const currentStep = orderData ? getStepIndex(orderData.status) : 0;

  const handleCancelOrder = async (reason) => {
    try {
      setLoadingCancel(true);
      const res = await cancelOrder(orderData.id, reason);
      setOrderData(res.order || { ...orderData, status: 'Cancelled' });
      setIsCancelModalOpen(false);
    } catch (err) {
      setError('Failed to cancel the order. Please try again or contact support.');
    } finally {
      setLoadingCancel(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-light font-sans py-10 px-4">
      <div className="container mx-auto max-w-4xl">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Track Your Order</h1>
          <p className="text-gray-500 max-w-md mx-auto">
            Enter your order ID below to get real-time updates on your package's location and delivery status.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-8 mb-8 border border-gray-100">
          <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter Order ID (e.g., ORD-12345)"
                className="block w-full pl-11 pr-4 py-4 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-mid focus:border-transparent transition-all outline-none text-gray-800 text-lg font-medium"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-brand-mid hover:bg-brand-dark text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 min-w-[160px]"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Track <Search size={20} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Custom Error / Empty State Box */}
        {(!orderData && (!currentUser || recentOrders.length === 0 || error)) && (
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-10 md:p-14 max-w-2xl mx-auto text-center border border-gray-100 flex flex-col items-center justify-center">
            <div className="text-5xl mb-4">📦</div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1f2937] mb-3">
              {error ? "Order Not Found" : "No Orders to Display"}
            </h2>
            <p className="text-gray-500 text-sm md:text-base max-w-md mb-8 leading-relaxed">
              {error 
                ? "We couldn't find an order with that number. Please double-check and try again."
                : "You don't have any recent orders to show. Enter an Order ID above to track your package."}
            </p>
            <button 
              onClick={() => navigate('/products')}
              className="bg-[#f97316] hover:bg-[#ea580c] text-white px-8 py-3 rounded-xl font-bold text-base transition-colors shadow-sm"
            >
              Back to Shopping
            </button>
          </div>
        )}

        {/* Recent Orders List for Logged-In Users */}
        {currentUser && recentOrders.length > 0 && !orderData && !error && (
          <div className="mb-10">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <History size={20} className="text-brand-mid" /> Your Recent Orders
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentOrders.slice(0, 4).map(order => (
                <div 
                  key={order.id} 
                  onClick={() => {
                    setOrderId(order.id);
                    handleTrack(null, order.id);
                  }}
                  className="bg-white p-5 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 hover:border-brand-mid/40 cursor-pointer transition-all hover:shadow-lg group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-gray-900 group-hover:text-brand-mid transition-colors">{order.id}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{order.date}</p>
                    </div>
                    <span className="bg-brand-light/50 text-brand-dark px-3 py-1 rounded-full text-xs font-semibold">
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-4 text-sm">
                    <span className="text-gray-600 font-medium">{order.total}</span>
                    <span className="text-brand-mid font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                      Track <ChevronRight size={16} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order Details & Stepper */}
        {orderData && (
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-gray-100">
            {/* Header Info */}
            <div className="bg-gray-50 border-b border-gray-100 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  Order {orderData.id}
                </h2>
                <div className="text-sm text-gray-500 flex items-center gap-4 mt-2">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {orderData.date}</span>
                  {orderData.trackingNumber && (
                    <span className="flex items-center gap-1"><Truck size={14} /> {orderData.trackingNumber}</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 inline-flex items-center gap-2 shadow-sm font-semibold text-brand-dark">
                  Status: <span className="text-brand-mid capitalize">{orderData.status}</span>
                </div>
                {orderData.status !== 'Delivered' && orderData.status !== 'Cancelled' && orderData.status !== 'Shipped' && (
                  <button 
                    onClick={() => setIsCancelModalOpen(true)}
                    disabled={loadingCancel}
                    className="text-xs font-bold text-red-500 hover:text-red-700 underline underline-offset-2 transition-colors disabled:opacity-50"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>

            {/* Stepper or Cancelled Hero */}
            {orderData.status === 'Cancelled' ? (
              <div className="p-6 md:p-10 border-b border-gray-100 bg-gray-50/50">
                <CancelledOrderHero reason={orderData.cancelReason} />
              </div>
            ) : (
              <div className="p-6 md:p-10 border-b border-gray-100">
                <div className="relative flex justify-between items-center max-w-2xl mx-auto">
                  {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 rounded-full z-0" />
                
                {/* Active Line */}
                <div 
                  className="absolute top-1/2 left-0 h-1 bg-brand-mid -translate-y-1/2 rounded-full z-0 transition-all duration-500" 
                  style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
                />

                {statusSteps.map((step, index) => {
                  const isActive = index <= currentStep;
                  const Icon = step.icon;
                  return (
                    <div key={step.label} className="relative z-10 flex flex-col items-center gap-3 bg-white px-2">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-colors duration-300 ${isActive ? 'bg-brand-mid border-brand-light text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                        <Icon size={20} strokeWidth={2.5} />
                      </div>
                      <span className={`text-sm font-bold ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
                </div>
              </div>
            )}

            {/* Order Items */}
            {orderData.items && orderData.items.length > 0 && (
              <div className="p-6 md:p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Items in this shipment</h3>
                <div className="space-y-4">
                  {orderData.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-brand-mid/30 transition-colors">
                      <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center p-2 border border-gray-100">
                        <img src={item.image || '/placeholder.png'} alt={item.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 text-sm md:text-base truncate">{item.name}</h4>
                        <p className="text-gray-500 text-sm mt-0.5">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-gray-900">৳{((item.price || item.priceMin) * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center gap-6 min-w-[250px]">
                    <span className="text-gray-600 font-medium">Total Amount</span>
                    <span className="text-2xl font-bold text-brand-dark ml-auto">{orderData.total}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <CancelOrderModal 
          isOpen={isCancelModalOpen}
          onClose={() => setIsCancelModalOpen(false)}
          onConfirm={handleCancelOrder}
          loading={loadingCancel}
        />

      </div>
    </div>
  );
};

export default TrackOrder;
