import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Minus, Plus, Trash2, ChevronDown, CheckCircle2, Circle, User, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../components/Toast';
import { placeOrder } from '../services/api';
import { ALL_DISTRICTS, THANAS_BY_DISTRICT } from '../data/locations';

const Checkout = ({ isLoggedIn }) => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    district: '',
    thana: ''
  });
  const [billingAddress, setBillingAddress] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    district: '',
    thana: ''
  });
  const [errors, setErrors] = useState({});
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [isCouponOpen, setIsCouponOpen] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;
      try {
        const res = await fetch('http://localhost:5005/api/users/addresses', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data && data.length > 0) {
          setSavedAddresses(data);
          const defaultAddr = data.find(addr => addr.isDefault) || data[0];
          setSelectedAddressId(defaultAddr._id);
          applySavedAddress(defaultAddr);
        }
      } catch (error) {
        console.error('Failed to fetch addresses:', error);
      }
    };
    fetchAddresses();
  }, []);

  const applySavedAddress = (addr) => {
    setShippingAddress({
      fullName: addr.name || '',
      phone: addr.phone || '',
      email: currentUser?.email || '',
      address: addr.street || '',
      district: addr.state || '',
      thana: addr.city || ''
    });
  };

  const handleAddressSelect = (e) => {
    const addrId = e.target.value;
    setSelectedAddressId(addrId);
    if (addrId === 'new') {
      setShippingAddress({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        district: '',
        thana: ''
      });
    } else {
      const addr = savedAddresses.find(a => a._id === addrId);
      if (addr) applySavedAddress(addr);
    }
  };

  const handlePurchase = async () => {
    if (cartItems.length === 0) {
      showToast("Your cart is empty!");
      return;
    }
    
    // Form Validation
    const newErrors = {};
    if (!shippingAddress.fullName.trim()) newErrors.fullName = true;
    if (!shippingAddress.phone.trim()) newErrors.phone = true;
    if (!shippingAddress.address.trim()) newErrors.address = true;
    if (!shippingAddress.district) newErrors.district = true;
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast("Please fill out all required fields.");
      // Scroll to the first error
      window.scrollTo({ top: 400, behavior: 'smooth' });
      return;
    }
    setErrors({});

    if (!agreedToTerms) {
      showToast("Please agree to the Terms and Conditions first.");
      return;
    }
    
    if (!isLoggedIn) {
      showToast("Please login to place an order");
      navigate('/login');
      window.scrollTo(0, 0);
      return;
    }
    
    setIsPlacingOrder(true);
    try {
      const formattedItems = cartItems.map(item => ({
        ...item,
        price: item.priceMin || item.price || 0
      }));

      const response = await placeOrder({
        email: currentUser?.email || shippingAddress.email || 'guest@example.com',
        shippingAddress,
        billingAddress: billingSameAsShipping ? shippingAddress : billingAddress,
        items: formattedItems,
        total: cartTotal,
        paymentMethod
      });
      showToast(`Order placed successfully! Order ID: ${response.orderId}`);
      setTimeout(() => {
        clearCart();
        navigate('/order-confirmation');
        window.scrollTo(0, 0);
      }, 1500);
    } catch (error) {
      showToast("Failed to place order. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="bg-[#f5f6f8] min-h-screen pb-20 font-sans">
      
      {/* Page Header */}
      <div className="bg-white py-0 border-b border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-[28px] font-bold text-gray-900">Checkout</h1>
        </div>
      </div>

      <div className="max-w-[1300px] mx-auto px-0 sm:px-4 md:px-6 lg:px-8 mt-2 sm:mt-6 md:mt-8">
        
        {/* Account Banner */}
        {!isLoggedIn && (
          <div className="bg-gradient-to-r from-orange-50 to-orange-50 sm:rounded-xl border-y sm:border border-brand-section/60 p-5 sm:p-6 mb-6 md:mb-8 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-sm relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-mid/40 rounded-full blur-2xl"></div>
            <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-brand-mid/40 rounded-full blur-2xl"></div>
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 relative z-10 text-center sm:text-left">
              <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-brand-mid shrink-0 mx-auto sm:mx-0 border border-brand-section">
                <User size={22} />
              </div>
              <div>
                <h3 className="text-gray-900 font-bold text-base sm:text-lg">Have an account?</h3>
                <p className="text-gray-500 text-xs sm:text-sm mt-0.5">Please login for a faster checkout experience.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto relative z-10">
              <button 
                onClick={() => navigate('/login')}
                className="flex-1 sm:flex-none px-6 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 font-bold text-[13px] hover:bg-gray-50 hover:text-brand-mid hover:border-brand-section transition-all shadow-sm"
              >
                Login
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="flex-1 sm:flex-none px-6 py-2.5 bg-brand-mid text-white rounded-lg font-bold text-[13px] hover:bg-[#e07a1b] hover:shadow-md transition-all shadow-sm"
              >
                Register
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6 xl:gap-8">
          
          {/* Left Column - Main Details */}
          <div className="w-full lg:w-[62%] xl:w-[65%] flex flex-col gap-6">
            
            {/* Order Review Section */}
            <section>
              <div className="flex items-center gap-2 mb-3 px-4 sm:px-0">
                <div className="w-1 h-4 bg-brand-mid rounded-full"></div>
                <h2 className="text-lg font-bold text-[#222831]">Order review</h2>
              </div>
              
              <div className="bg-white sm:rounded-lg shadow-[0_2px_15px_rgba(0,0,0,0.03)] border-y sm:border-x border-gray-100 p-4 md:p-6 flex flex-col gap-4">
                {cartItems.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">Your cart is empty.</div>
                ) : (
                  cartItems.map((item, index) => (
                    <div key={item.id}>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 group">
                        
                        {/* Product Info */}
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded flex items-center justify-center p-1 shrink-0">
                            <img src={item.image} alt={item.name} className="max-h-full object-contain" />
                          </div>
                          <h4 className="text-sm md:text-[15px] font-medium text-gray-800 leading-snug line-clamp-2">
                            {item.name}
                          </h4>
                        </div>
                        
                        {/* Controls & Price */}
                        <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8 w-full sm:w-auto">
                          
                          <div className="flex items-center gap-3">
                            <span className="text-gray-500 text-sm font-medium">Qty:</span>
                            <div className="flex items-center bg-gray-50 border border-gray-200 rounded h-8 w-24">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors rounded-l"
                              ><Minus size={14} /></button>
                              <input 
                                type="text" 
                                value={item.quantity} 
                                readOnly
                                className="flex-1 w-full h-full text-center text-sm font-semibold bg-transparent border-x border-gray-200 focus:outline-none pointer-events-none"
                              />
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors rounded-r"
                              ><Plus size={14} /></button>
                            </div>
                          </div>

                          <div className="font-bold text-gray-900 min-w-[80px] text-right">
                            ৳{((item.priceMin || item.price || 0) * item.quantity).toLocaleString()}
                          </div>

                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="w-8 h-8 flex items-center justify-center rounded bg-[#ffebe6] text-[#ff4747] hover:bg-[#ff4747] hover:text-white transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      
                      {index < cartItems.length - 1 && <hr className="border-gray-100 mt-4" />}
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Saved Addresses Section */}
            {savedAddresses.length > 0 && (
              <section className="mb-6">
                <div className="flex items-center gap-2 mb-3 px-4 sm:px-0">
                  <div className="w-1 h-4 bg-brand-mid rounded-full"></div>
                  <h2 className="text-lg font-bold text-[#222831]">Saved Addresses</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 sm:px-0">
                  {savedAddresses.map(addr => (
                    <label 
                      key={addr._id}
                      className={`flex flex-col p-4 rounded-lg border cursor-pointer transition-colors ${selectedAddressId === addr._id ? 'border-[#f68b1e] bg-[#fdf8f4]' : 'border-gray-200 hover:border-gray-300 bg-[#fdfdfd]'}`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <input 
                          type="radio"
                          name="savedAddress"
                          value={addr._id}
                          checked={selectedAddressId === addr._id}
                          onChange={handleAddressSelect}
                          className="accent-[#f68b1e]"
                        />
                        <span className="font-bold text-[#f68b1e] text-sm">{addr.type || 'Saved Address'}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-800 mb-1 pl-5">{addr.name}</span>
                      <span className="text-xs text-gray-500 pl-5 italic line-clamp-2">
                        {addr.street}, {addr.city} {addr.zip ? `- ${addr.zip}` : ''}, {addr.state}
                      </span>
                    </label>
                  ))}
                  <label 
                    className={`flex items-center justify-center p-4 rounded-lg border border-dashed cursor-pointer transition-colors min-h-[100px] ${selectedAddressId === 'new' ? 'border-[#f68b1e] bg-[#fdf8f4]' : 'border-gray-300 hover:border-[#f68b1e] hover:bg-orange-50/10'}`}
                  >
                    <input 
                      type="radio"
                      name="savedAddress"
                      value="new"
                      checked={selectedAddressId === 'new'}
                      onChange={handleAddressSelect}
                      className="hidden"
                    />
                    <span className={`text-sm font-bold ${selectedAddressId === 'new' ? 'text-[#f68b1e]' : 'text-gray-500'}`}>+ Add New Address</span>
                  </label>
                </div>
              </section>
            )}

            {/* Shipping Address Section */}
            <section>
              <div className="flex items-center justify-between mb-3 px-4 sm:px-0">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-brand-mid rounded-full"></div>
                  <h2 className="text-lg font-bold text-[#222831]">Shipping Address</h2>
                </div>
              </div>
              
              <div className="bg-white sm:rounded-lg shadow-[0_2px_15px_rgba(0,0,0,0.03)] border-y sm:border-x border-gray-100 p-5 md:p-6">
                <form className="flex flex-col gap-4">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      placeholder="Your Full Name *" 
                      value={shippingAddress.fullName}
                      onChange={(e) => {
                        setShippingAddress({...shippingAddress, fullName: e.target.value});
                        if (errors.fullName) setErrors({...errors, fullName: false});
                      }}
                      className={`w-full border rounded text-sm px-4 py-3 focus:outline-none focus:border-brand-mid bg-[#fdfdfd] transition-colors ${errors.fullName ? 'border-red-500 bg-red-50/30' : 'border-gray-200'}`}
                      required
                    />
                    <div className={`flex border rounded overflow-hidden focus-within:border-brand-mid bg-[#fdfdfd] transition-colors ${errors.phone ? 'border-red-500 bg-red-50/30' : 'border-gray-200'}`}>
                      <div className="bg-gray-100 px-3 md:px-4 py-3 border-r border-gray-200 text-sm text-gray-800 font-medium flex items-center justify-center">
                         +88
                      </div>
                      <input 
                        type="tel" 
                        placeholder="017********" 
                        value={shippingAddress.phone}
                        onChange={(e) => {
                          setShippingAddress({...shippingAddress, phone: e.target.value});
                          if (errors.phone) setErrors({...errors, phone: false});
                        }}
                        className="flex-1 w-full text-sm px-4 py-3 focus:outline-none bg-transparent"
                        required
                      />
                    </div>
                  </div>

                  <input 
                    type="email" 
                    placeholder="example@gmail.com (Optional)" 
                    value={shippingAddress.email}
                    onChange={(e) => setShippingAddress({...shippingAddress, email: e.target.value})}
                    className="w-full border border-gray-200 rounded text-sm px-4 py-3 focus:outline-none focus:border-brand-mid bg-[#fdfdfd]"
                  />

                  <input 
                    type="text" 
                    placeholder="ex: House no. / building / street / area *" 
                    value={shippingAddress.address}
                    onChange={(e) => {
                      setShippingAddress({...shippingAddress, address: e.target.value});
                      if (errors.address) setErrors({...errors, address: false});
                    }}
                    className={`w-full border rounded text-sm px-4 py-3 focus:outline-none focus:border-brand-mid bg-[#fdfdfd] transition-colors ${errors.address ? 'border-red-500 bg-red-50/30' : 'border-gray-200'}`}
                    required
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <select 
                        value={shippingAddress.district}
                        onChange={(e) => {
                          setShippingAddress({...shippingAddress, district: e.target.value, thana: ''});
                          if (errors.district) setErrors({...errors, district: false});
                        }}
                        className={`w-full border rounded text-sm px-4 py-3 focus:outline-none focus:border-brand-mid bg-[#fdfdfd] appearance-none text-gray-700 cursor-pointer transition-colors ${errors.district ? 'border-red-500 bg-red-50/30' : 'border-gray-200'}`}
                      >
                        <option value="">Select District *</option>
                        {ALL_DISTRICTS.map(dist => (
                          <option key={dist.id} value={dist.id}>{dist.label}</option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                    <div className="relative">
                      <select 
                        value={shippingAddress.thana}
                        onChange={(e) => setShippingAddress({...shippingAddress, thana: e.target.value})}
                        className="w-full border border-gray-200 rounded text-sm px-4 py-3 focus:outline-none focus:border-brand-mid bg-[#fdfdfd] appearance-none text-gray-700 cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
                        disabled={!shippingAddress.district || !THANAS_BY_DISTRICT[shippingAddress.district]}
                      >
                        <option value="">Select Thana (Optional)</option>
                        {(THANAS_BY_DISTRICT[shippingAddress.district] || []).map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                </form>
              </div>
            </section>

            {/* Billing Address Section */}
            <section className="mb-4">
              <div 
                className={`bg-[#fafafa] sm:rounded-t-lg shadow-[0_2px_15px_rgba(0,0,0,0.03)] border-t border-x border-gray-100 p-5 flex items-center justify-between cursor-pointer ${billingSameAsShipping ? 'sm:rounded-b-lg border-b' : 'border-b-0'}`} 
                onClick={() => setBillingSameAsShipping(!billingSameAsShipping)}
              >
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-brand-mid rounded-full"></div>
                  <h2 className="text-lg font-bold text-[#222831]">Billing Address</h2>
                </div>
                {!billingSameAsShipping ? (
                  <div className="w-[22px] h-[22px] rounded-full border-2 border-[#f68b1e] bg-transparent flex items-center justify-center shrink-0">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f68b1e" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                ) : (
                  <div className="w-[22px] h-[22px] rounded-full border-2 border-gray-300 bg-transparent shrink-0"></div>
                )}
              </div>
              
              <div className={`grid transition-all duration-300 ease-in-out ${!billingSameAsShipping ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                  <div className="bg-[#fafafa] sm:rounded-b-lg shadow-[0_2px_15px_rgba(0,0,0,0.03)] border-b sm:border-x border-gray-100 p-5 md:p-6 border-t border-dashed">
                  <form className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input 
                        type="text" 
                        placeholder="Your Full Name *" 
                        value={billingAddress.fullName}
                        onChange={(e) => setBillingAddress({...billingAddress, fullName: e.target.value})}
                        className="w-full border border-gray-200 rounded text-sm px-4 py-3 focus:outline-none focus:border-brand-mid bg-[#fdfdfd] transition-colors"
                      />
                      <div className="flex border border-gray-200 rounded overflow-hidden focus-within:border-brand-mid bg-[#fdfdfd] transition-colors">
                        <div className="bg-gray-100 px-3 md:px-4 py-3 border-r border-gray-200 text-sm text-gray-800 font-medium flex items-center justify-center">
                           +88
                        </div>
                        <input 
                          type="tel" 
                          placeholder="017********" 
                          value={billingAddress.phone}
                          onChange={(e) => setBillingAddress({...billingAddress, phone: e.target.value})}
                          className="flex-1 w-full text-sm px-4 py-3 focus:outline-none bg-transparent"
                        />
                      </div>
                    </div>

                    <input 
                      type="email" 
                      placeholder="example@gmail.com (Optional)" 
                      value={billingAddress.email}
                      onChange={(e) => setBillingAddress({...billingAddress, email: e.target.value})}
                      className="w-full border border-gray-200 rounded text-sm px-4 py-3 focus:outline-none focus:border-brand-mid bg-[#fdfdfd]"
                    />

                    <input 
                      type="text" 
                      placeholder="ex: House no. / building / street / area *" 
                      value={billingAddress.address}
                      onChange={(e) => setBillingAddress({...billingAddress, address: e.target.value})}
                      className="w-full border border-gray-200 rounded text-sm px-4 py-3 focus:outline-none focus:border-brand-mid bg-[#fdfdfd] transition-colors"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <select 
                          value={billingAddress.district}
                          onChange={(e) => setBillingAddress({...billingAddress, district: e.target.value, thana: ''})}
                          className="w-full border border-gray-200 rounded text-sm px-4 py-3 focus:outline-none focus:border-brand-mid bg-[#fdfdfd] appearance-none text-gray-700 cursor-pointer transition-colors"
                        >
                          <option value="">Select District *</option>
                          {ALL_DISTRICTS.map(dist => (
                            <option key={dist.id} value={dist.id}>{dist.label}</option>
                          ))}
                        </select>
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                      <div className="relative">
                        <select 
                          value={billingAddress.thana}
                          onChange={(e) => setBillingAddress({...billingAddress, thana: e.target.value})}
                          className="w-full border border-gray-200 rounded text-sm px-4 py-3 focus:outline-none focus:border-brand-mid bg-[#fdfdfd] appearance-none text-gray-700 cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
                          disabled={!billingAddress.district || !THANAS_BY_DISTRICT[billingAddress.district]}
                        >
                          <option value="">Select Thana (Optional)</option>
                          {(THANAS_BY_DISTRICT[billingAddress.district] || []).map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>
            
          </div>

          {/* Right Column - Summary & Payment */}
          <div className="w-full lg:w-[38%] xl:w-[35%] flex flex-col gap-6">
            
            {/* Payment Method */}
            <section>
              <div className="flex items-center gap-2 mb-3 px-4 sm:px-0">
                <div className="w-1 h-4 bg-brand-mid rounded-full"></div>
                <h2 className="text-lg font-bold text-[#222831]">Payment method</h2>
              </div>
              
              <div className="bg-white sm:rounded-lg shadow-[0_2px_15px_rgba(0,0,0,0.03)] border-y sm:border-x border-gray-100 p-4">
                <div className="grid grid-cols-2 gap-3">
                  {/* COD */}
                  <label className={`flex items-center gap-1.5 sm:gap-3 p-2 sm:p-3 rounded border cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-brand-mid bg-brand-mid/5' : 'border-gray-200 hover:border-brand-mid/50'}`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'cod'} 
                      onChange={() => setPaymentMethod('cod')}
                      className="hidden" 
                    />
                    <div className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 bg-[#eef2ff] rounded flex items-center justify-center text-[#4f46e5] text-xs sm:text-base">
                       💵
                    </div>
                    <span className="text-[11px] sm:text-sm font-semibold text-gray-800 flex-1 leading-tight">Cash On Delivery</span>
                    {paymentMethod === 'cod' && <CheckCircle2 size={16} className="text-brand-mid shrink-0" />}
                  </label>

                  {/* Online Payment */}
                  <label className={`flex items-center gap-1.5 sm:gap-3 p-2 sm:p-3 rounded border cursor-pointer transition-colors ${paymentMethod === 'online' ? 'border-brand-mid bg-brand-mid/5' : 'border-gray-200 hover:border-brand-mid/50'}`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'online'} 
                      onChange={() => setPaymentMethod('online')}
                      className="hidden" 
                    />
                    <div className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 bg-[#f0f9ff] rounded flex items-center justify-center text-[#0284c7] text-xs sm:text-base">
                       💳
                    </div>
                    <span className="text-[11px] sm:text-sm font-semibold text-gray-800 flex-1 leading-tight">Online Payment</span>
                    {paymentMethod === 'online' && <CheckCircle2 size={16} className="text-brand-mid shrink-0" />}
                  </label>

                  {/* bKash */}
                  <label className={`flex items-center gap-1.5 sm:gap-3 p-2 sm:p-3 rounded border cursor-pointer transition-colors ${paymentMethod === 'bkash' ? 'border-brand-mid bg-brand-mid/5' : 'border-gray-200 hover:border-brand-mid/50'}`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'bkash'} 
                      onChange={() => setPaymentMethod('bkash')}
                      className="hidden" 
                    />
                    <div className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 bg-[#e2136e]/10 rounded flex items-center justify-center text-[#e2136e] font-bold text-[10px] sm:text-xs italic">
                      bK
                    </div>
                    <span className="text-[11px] sm:text-sm font-semibold text-gray-800 flex-1 leading-tight">Bkash</span>
                    {paymentMethod === 'bkash' && <CheckCircle2 size={16} className="text-brand-mid shrink-0" />}
                  </label>
                </div>
              </div>
            </section>

            {/* Coupon Code */}
            <div className="bg-white rounded-lg shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden">
              <div 
                className="p-4 flex items-center justify-between cursor-pointer group"
                onClick={() => setIsCouponOpen(!isCouponOpen)}
              >
                <span className="text-sm font-bold text-gray-800">Have any coupon or gift voucher?</span>
                <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 ${isCouponOpen ? 'rotate-180' : ''}`} />
              </div>
              {isCouponOpen && (
                <div className="px-4 pb-4 border-t border-gray-50 pt-3 flex gap-2 animate-fade-in">
                  <input 
                    type="text" 
                    placeholder="Enter code here" 
                    className="flex-1 border border-gray-200 rounded text-sm px-3 py-2.5 focus:outline-none focus:border-brand-mid bg-[#fdfdfd]" 
                  />
                  <button className="bg-brand-mid text-white px-5 py-2.5 rounded text-sm font-bold hover:bg-[#e07a1b] transition-colors shadow-sm">
                    Apply
                  </button>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-white sm:rounded-lg shadow-[0_2px_15px_rgba(0,0,0,0.03)] border-y sm:border-x border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600 font-medium">Sub total</span>
                <span className="text-sm font-bold text-gray-800">৳{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                <span className="text-sm text-gray-600 font-medium">Delivery cost</span>
                <span className="text-sm font-bold text-gray-800">৳0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-gray-900">Total</span>
                <span className="text-base font-bold text-brand-mid">৳{cartTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Special Notes */}
            <section>
              <div className="flex items-center gap-2 mb-3 px-4 sm:px-0">
                <div className="w-1 h-4 bg-brand-mid rounded-full"></div>
                <h2 className="text-lg font-bold text-[#222831]">Special notes <span className="text-sm font-normal text-gray-500">(Optional)</span></h2>
              </div>
              
              <div className="bg-white sm:rounded-lg shadow-[0_2px_15px_rgba(0,0,0,0.03)] border-y sm:border-x border-gray-100 p-4">
                <textarea 
                  rows="3"
                  maxLength={90}
                  className="w-full border border-gray-200 rounded text-sm px-4 py-3 focus:outline-none focus:border-brand-mid bg-[#fdfdfd] resize-none"
                  placeholder="Notes about your order..."
                ></textarea>
                <div className="text-right text-[11px] text-gray-400 mt-1">0 / 90 characters</div>
              </div>
            </section>

            {/* Terms and Submit */}
            <div className="flex flex-col gap-6 mt-2 px-4 sm:px-0 mb-32 md:mb-4">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="mt-0.5">
                  <input 
                    type="checkbox" 
                    className="hidden"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                  />
                  {agreedToTerms ? (
                    <CheckCircle2 size={20} className="text-brand-mid fill-[#f68b1e]/10" />
                  ) : (
                    <Circle size={20} className="text-gray-300 group-hover:border-brand-mid transition-colors" />
                  )}
                </div>
                <span className="text-[13px] text-gray-600 leading-snug">
                  I have read and agree to the <button type="button" onClick={(e) => { e.preventDefault(); showToast("Terms and Conditions placeholder"); }} className="text-brand-mid hover:underline cursor-pointer bg-transparent border-none p-0 inline">Terms and Conditions</button>, <button type="button" onClick={(e) => { e.preventDefault(); showToast("Privacy Policy placeholder"); }} className="text-brand-mid hover:underline cursor-pointer bg-transparent border-none p-0 inline">Privacy Policy</button> & <button type="button" onClick={(e) => { e.preventDefault(); showToast("Refund Policy placeholder"); }} className="text-brand-mid hover:underline cursor-pointer bg-transparent border-none p-0 inline">Refund and Return Policy</button>.
                </span>
              </label>
            </div>
            
          </div>
        </div>
      </div>

      {/* Fixed Bottom Bar for Purchase Now */}
      <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-gray-200 p-3 sm:p-4 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] md:static md:bg-transparent md:border-none md:p-0 md:shadow-none mt-auto">
        <div className="max-w-[1300px] mx-auto md:px-6 lg:px-8 flex justify-end">
          <div className="w-full md:w-[38%] xl:w-[35%]">
            <button 
              onClick={handlePurchase}
              disabled={isPlacingOrder}
              className={`relative w-full bg-gradient-to-r from-[#f68b1e] to-[#ff9800] text-white font-bold py-3.5 sm:py-4 rounded-xl shadow-[0_4px_15px_rgba(197,160,89,0.4)] hover:shadow-[0_8px_25px_rgba(197,160,89,0.6)] transition-all duration-300 transform md:hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-2 overflow-hidden group ${isPlacingOrder ? 'opacity-70 pointer-events-none' : ''}`}
            >
              {isPlacingOrder ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                  <span className="relative z-10 text-[16px] tracking-widest uppercase font-black">Processing...</span>
                </>
              ) : (
                <>
                  <span className="relative z-10 text-[16px] tracking-widest uppercase font-black">Purchase Now</span>
                  <div className="relative z-10 flex items-center justify-center w-6 h-6">
                    <ChevronRight size={22} className="absolute animate-ping opacity-75" />
                    <ChevronRight size={22} className="relative z-10" />
                  </div>
                  {/* Shine effect overlay */}
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-[shimmer_1.5s_infinite] skew-x-12"></div>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
