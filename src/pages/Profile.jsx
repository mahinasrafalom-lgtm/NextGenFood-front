import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, LogOut, Package, MapPin, Heart, Settings,
  ShoppingBag, Truck, CreditCard, Star, Ticket,
  Menu, X, ArrowRight, DollarSign, Activity, FileText, MessageCircle,
  Edit3, Trash2, Camera, Lock, Shield, Mail, Phone, Copy, Check, ShoppingBasket, Wallet, Calendar,
  ArrowLeft, Upload, Plus, EyeOff, ChevronDown
} from 'lucide-react';
import { showToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ALL_DISTRICTS, THANAS_BY_DISTRICT } from '../data/locations';

const Profile = ({ isLoggedIn: mockIsLoggedIn }) => {
  const navigate = useNavigate();
  const { currentUser, logout, changePassword, updateProfile } = useAuth();
  const { cartCount } = useCart();
  const [profileData, setProfileData] = useState({ name: '', address: '', phone: '', email: '' });
  const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({ 'orders-group': true });
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.sidebar-nav-container')) {
        setExpandedMenus({});
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Phase 2 State
  const [wishlist, setWishlist] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ type: 'Home', name: '', street: '', city: '', state: '', zip: '', phone: '' });

  // Phase 3 State
  const [orders, setOrders] = useState([]);

  // Phase 4 State
  const [coupons, setCoupons] = useState({ available: [], applied: [] });
  const [reviews, setReviews] = useState([]);
  const [newTicket, setNewTicket] = useState({ title: '', topic: '', description: '', photoUrl: '' });


  useEffect(() => {
    if (currentUser) {
      setProfileData({
        name: currentUser.displayName || '',
        email: currentUser.email || '',
        phone: '',
        address: ''
      });
      
      const token = localStorage.getItem('authToken');
      if (token) {
        // Fetch Profile
        fetch('http://localhost:5005/api/users/profile', { headers: { Authorization: `Bearer ${token}` }})
          .then(res => res.json())
          .then(data => {
            if(data.phone) setProfileData(prev => ({...prev, phone: data.phone}));
            if(data.address) setProfileData(prev => ({...prev, address: data.address}));
          }).catch(console.error);
          
        // Fetch Wishlist
        fetch('http://localhost:5005/api/users/wishlist', { headers: { Authorization: `Bearer ${token}` }})
          .then(res => res.json())
          .then(data => setWishlist(data || [])).catch(console.error);

        // Fetch Addresses
        fetch('http://localhost:5005/api/users/addresses', { headers: { Authorization: `Bearer ${token}` }})
          .then(res => res.json())
          .then(data => setAddresses(data || [])).catch(console.error);

        // Fetch Orders
        fetch('http://localhost:5005/api/orders/my-orders', { headers: { Authorization: `Bearer ${token}` }})
          .then(res => res.json())
          .then(data => setOrders(data || [])).catch(console.error);

        // Fetch Tickets
        fetch('http://localhost:5005/api/tickets', { headers: { Authorization: `Bearer ${token}` }})
          .then(res => res.json())
          .then(data => setTickets(data || [])).catch(console.error);

        // Fetch Coupons
        fetch('http://localhost:5005/api/coupons', { headers: { Authorization: `Bearer ${token}` }})
          .then(res => res.json())
          .then(data => setCoupons(data || { available: [], applied: [] })).catch(console.error);

        // Fetch Reviews with fallback for embedded product reviews
        fetch('http://localhost:5005/api/reviews/my-reviews', { headers: { Authorization: `Bearer ${token}` }})
          .then(res => res.json())
          .then(async data => {
            let userReviews = Array.isArray(data) ? data : [];
            try {
              const api = await import('../services/api');
              const allProducts = await api.fetchProducts();
              const embedded = [];
              const userName = currentUser.displayName || currentUser.name || currentUser.email?.split('@')[0] || "User";
              allProducts.forEach(p => {
                if (p.reviews && p.reviews.length > 0) {
                  p.reviews.forEach(r => {
                    if (r.user === userName || r.userEmail === currentUser.email) {
                      const exists = userReviews.some(sr => 
                        sr.productId?._id === (p._id || p.id) && sr.comment === r.comment
                      );
                      if (!exists) {
                        embedded.push({
                          _id: r._id || Math.random().toString(),
                          productId: { _id: p._id || p.id, name: p.name, image: p.image, images: p.images, price: p.price },
                          rating: r.rating,
                          comment: r.comment,
                          createdAt: r.createdAt || new Date()
                        });
                      }
                    }
                  });
                }
              });
              setReviews([...userReviews, ...embedded]);
            } catch (err) {
              console.error("Fallback review fetch error:", err);
              setReviews(userReviews);
            }
          }).catch(console.error);
      }
    }
  }, [currentUser]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewTicket({ ...newTicket, photoUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateTicket = async () => {
    if (!newTicket.title || !newTicket.topic || !newTicket.description) {
      showToast('Please fill all required fields');
      return;
    }
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('http://localhost:5005/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newTicket)
      });
      const data = await res.json();
      setTickets([data, ...tickets]);
      setNewTicket({ title: '', topic: '', description: '', photoUrl: '' });
      setIsCreatingTicket(false);
      showToast('Ticket created successfully!');
    } catch(err) {
      showToast('Failed to create ticket');
    }
  };

  const handleTicketReply = async () => {
    if (!replyMessage.trim() || !selectedTicket) return;
    const token = localStorage.getItem('authToken');
    try {
      const res = await fetch(`http://localhost:5005/api/tickets/${selectedTicket._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          responseMessage: replyMessage.trim(), 
          sender: 'user' 
        })
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.message || 'Failed to reply');
        return;
      }
      setTickets(tickets.map(t => t._id === data._id ? data : t));
      setSelectedTicket(data);
      setReplyMessage('');
    } catch (err) {
      console.error('Error replying to ticket:', err);
      showToast('Error replying to ticket');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      showToast("Logged out successfully");
      navigate('/');
    } catch (error) {
      showToast("Failed to log out");
    }
  };

  const handleProfileUpdate = async () => {
    try {
      await updateProfile({ displayName: profileData.name });
      // Here you would also push changes to your backend API
      // await fetch('/api/users/profile', { method: 'PUT', body: JSON.stringify(profileData), ... })
      showToast('Profile updated successfully!');
    } catch (error) {
      showToast('Error updating profile');
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      showToast('Passwords do not match');
      return;
    }
    if (passwords.newPassword.length < 8) {
      showToast('Password must be at least 8 characters');
      return;
    }
    try {
      await changePassword(passwords.newPassword);
      showToast('Password updated successfully!');
      setPasswords({ newPassword: '', confirmPassword: '' });
    } catch (error) {
      showToast(error.message || 'Error updating password');
    }
  };


  const navLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { 
      id: 'orders-group', 
      label: 'My orders', 
      icon: Package,
      subLinks: [
        { id: 'all-orders', label: 'All orders' },
        { id: 'cancelled-orders', label: 'Cancelled Orders' }
      ]
    },

    { id: 'promo', label: 'Promo/Coupon', icon: Ticket },
    { id: 'address', label: 'Address', icon: MapPin },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'reviews', label: 'Product Reviews', icon: Star },
    { id: 'support', label: 'Support Tickets', icon: FileText },
    { id: 'manage-profile', label: 'Manage Profile', icon: User },
    { id: 'change-password', label: 'Change Password', icon: Settings },
  ];

  // Reusable Empty State
  const EmptyState = ({ title }) => (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
        <Package size={32} className="text-gray-300" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">No Record Found</h3>
      <p className="text-gray-500 max-w-xs mx-auto">There are no records to display in {title} at the moment.</p>
    </div>
  );

  const renderDashboard = () => {
    const totalOrders = orders.length;
    const runningOrders = orders.filter(o => {
      const status = o.status ? o.status.toLowerCase() : '';
      return status !== 'delivered' && status !== 'cancelled';
    }).length;
    const amountSpent = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    return (
    <div className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total order placed */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-indigo-50/50 to-indigo-100/50 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-3xl font-black text-gray-800 leading-none mb-2">{totalOrders}</p>
            <p className="text-[13px] sm:text-sm font-medium text-gray-500">Total order placed</p>
          </div>
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 transform rotate-3 shrink-0">
            <ShoppingBag size={22} className="text-white" />
            <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full border-2 border-white w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
              <Check size={10} className="text-white" strokeWidth={4} />
            </div>
          </div>
        </div>

        {/* Running orders */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-teal-50/50 to-teal-100/50 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-3xl font-black text-gray-800 leading-none mb-2">{runningOrders}</p>
            <p className="text-[13px] sm:text-sm font-medium text-gray-500">Running orders</p>
          </div>
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-300 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30 transform -rotate-6 shrink-0">
            <Package size={22} className="text-white" />
            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full border-2 border-white w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
              <Check size={10} className="text-white" strokeWidth={4} />
            </div>
          </div>
        </div>

        {/* Items in cart */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-purple-50/50 to-purple-100/50 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-3xl font-black text-gray-800 leading-none mb-2">{cartCount}</p>
            <p className="text-[13px] sm:text-sm font-medium text-gray-500">Items in cart</p>
          </div>
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0">
            <ShoppingBasket size={20} className="text-white" />
          </div>
        </div>


        {/* Amount spent */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-rose-50/50 to-rose-100/50 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-3xl font-black text-gray-800 leading-none mb-2">{amountSpent}</p>
            <p className="text-[13px] sm:text-sm font-medium text-gray-500">Amount spent (৳)</p>
          </div>
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 shrink-0">
            <span className="text-white font-bold text-xl sm:text-2xl">৳</span>
            <div className="absolute top-0 right-0 bg-cyan-400 rounded-full border-2 border-white w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center">
              <Check size={8} className="text-white" strokeWidth={4} />
            </div>
          </div>
        </div>

        {/* Opened Tickets */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-cyan-50/50 to-cyan-100/50 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-3xl font-black text-gray-800 leading-none mb-2">{tickets.length}</p>
            <p className="text-[13px] sm:text-sm font-medium text-gray-500">Opened Tickets</p>
          </div>
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 shrink-0">
            <div className="absolute top-0 left-0 w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full flex items-center justify-center shadow-sm">
              <MessageCircle size={14} className="text-pink-500" fill="currentColor" />
            </div>
            <div className="absolute bottom-0 right-0 w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-fuchsia-400 to-fuchsia-600 rounded-full flex items-center justify-center shadow-md">
              <MessageCircle size={14} className="text-white" fill="currentColor" />
            </div>
          </div>
        </div>

        {/* Coupons */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-amber-50/50 to-amber-100/50 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-3xl font-black text-gray-800 leading-none mb-2">{Array.isArray(coupons?.available) ? coupons.available.length : 0}</p>
            <p className="text-[13px] sm:text-sm font-medium text-gray-500">Coupons</p>
          </div>
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30 shrink-0">
            <Ticket size={20} className="text-white" />
          </div>
        </div>
      </div>

      <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
        <div className="bg-[#2D2D2D] px-4 py-3 flex justify-between items-center">
          <h3 className="text-white font-bold text-sm tracking-wide">Recent orders</h3>
          <button onClick={() => setActiveTab('orders')} className="bg-white text-gray-800 text-xs font-bold px-3 py-1.5 rounded hover:bg-gray-100 transition-colors">All orders</button>
        </div>
        {orders.length === 0 ? (
          <div className="bg-gray-50 py-12 flex justify-center items-center">
            <p className="text-gray-500 font-bold text-sm">No Order Found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-gray-50 text-gray-700 text-sm font-bold border-b border-gray-200">
                  <th className="p-4 whitespace-nowrap">Order ID</th>
                  <th className="p-4 whitespace-nowrap">Date & Time</th>
                  <th className="p-4 whitespace-nowrap">Status</th>
                  <th className="p-4 whitespace-nowrap">Quantity</th>
                  <th className="p-4 whitespace-nowrap">Amount</th>
                  <th className="p-4 text-center whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 3).map(order => (
                  <tr key={order.id || order._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-bold text-gray-900">#{order.id || (order._id && order._id.slice(-6)) || 'N/A'}</td>
                    <td className="p-4 text-gray-600">
                      {order.date || (order.createdAt && new Date(order.createdAt).toLocaleDateString()) || 'N/A'}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        order.status?.toLowerCase() === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status?.toLowerCase() === 'cancelled' ? 'bg-red-100 text-red-700' :
                        order.status?.toLowerCase() === 'processing' ? 'bg-blue-100 text-blue-700' :
                        'bg-orange-100 text-[#f68b1e]'
                      }`}>
                        {order.status || 'Order Placed'}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">{order.items?.reduce((acc, curr) => acc + curr.quantity, 0) || 0} items</td>
                    <td className="p-4 font-bold text-gray-900">৳{order.totalAmount || (order.total && order.total.replace(/\D/g,'')) || 0}</td>
                    <td className="p-4 text-center">
                      <button className="text-blue-600 font-bold hover:underline text-sm" onClick={() => navigate('/order-confirmation', { state: { orderId: order.id || order._id } })}>
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
        <div className="bg-[#2D2D2D] px-4 py-3 flex justify-between items-center">
          <h3 className="text-white font-bold text-sm tracking-wide">Available Coupons</h3>
          <button onClick={() => setActiveTab('promo')} className="bg-white text-gray-800 text-xs font-bold px-3 py-1.5 rounded hover:bg-gray-100 transition-colors">View all</button>
        </div>
        {(!coupons?.available || coupons.available.length === 0) ? (
          <div className="bg-white py-12 flex justify-center items-center">
            <p className="text-gray-500 font-bold text-sm">No coupons available right now</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
            {coupons.available.slice(0, 4).map((coupon) => (
              <div key={coupon._id} className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow relative cursor-pointer" onClick={() => setActiveTab('promo')}>
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                  <Ticket size={24} />
                </div>
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-start w-full">
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{coupon.code}</h4>
                      <p className="text-gray-500 text-xs mt-1">{coupon.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block bg-blue-100 text-blue-700 font-bold text-xs px-2 py-1 rounded-full whitespace-nowrap">
                        {coupon.discountType === 'percentage' ? `${coupon.discount}% OFF` : `৳${coupon.discount} OFF`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    );
  };

  const renderOrdersTable = (type) => {
    // type is either 'all' or 'cancelled'
    const filteredOrders = type === 'all' 
      ? orders 
      : orders.filter(o => o.status && o.status.toLowerCase() === 'cancelled');
    
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#2D2D2D] text-white text-sm font-bold">
                <th className="p-4 whitespace-nowrap">Order ID</th>
                <th className="p-4 whitespace-nowrap">Date & Time</th>
                <th className="p-4 whitespace-nowrap">Status</th>
                <th className="p-4 whitespace-nowrap">Quantity</th>
                <th className="p-4 whitespace-nowrap">Amount</th>
                <th className="p-4 whitespace-nowrap text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm bg-white">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500 font-bold">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id || order._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-bold text-gray-900">#{order.id || order._id.slice(-6)}</td>
                    <td className="p-4 text-gray-600">
                      {order.date || new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        order.status?.toLowerCase() === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status?.toLowerCase() === 'cancelled' ? 'bg-red-100 text-red-700' :
                        order.status?.toLowerCase() === 'processing' ? 'bg-blue-100 text-blue-700' :
                        'bg-orange-100 text-[#f68b1e]'
                      }`}>
                        {order.status || 'Order Placed'}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">{order.items?.reduce((acc, curr) => acc + curr.quantity, 0) || 0} items</td>
                    <td className="p-4 font-bold text-gray-900">৳{order.totalAmount || order.total?.replace(/\D/g,'') || 0}</td>
                    <td className="p-4 text-center">
                      <button className="text-blue-600 font-bold hover:underline text-sm" onClick={() => navigate('/order-confirmation', { state: { orderId: order.id || order._id } })}>
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderWishlist = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 animate-fade-in">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Heart className="text-[#f68b1e]" /> Wishlist
      </h2>
      {wishlist.length === 0 ? (
        <EmptyState title="Your wishlist is empty" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {wishlist.map((item) => (
            <div key={item._id} className="flex gap-4 p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow relative">
              <button 
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                onClick={() => {
                  const token = localStorage.getItem('authToken');
                  fetch('http://localhost:5005/api/users/wishlist', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ productId: item._id })
                  }).then(() => {
                    setWishlist(wishlist.filter(w => w._id !== item._id));
                    showToast('Removed from wishlist');
                  });
                }}
              >
                <Trash2 size={16} />
              </button>
              <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                {item.images && item.images.length > 0 ? (
                  <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <Heart className="text-red-400" />
                )}
              </div>
              <div className="flex flex-col justify-center flex-1">
                 <h4 className="font-bold text-gray-900 line-clamp-1">{item.name}</h4>
                 <p className="text-[#f68b1e] font-bold mt-1">৳{item.price}</p>
                 <button 
                  onClick={() => navigate(`/product/${item._id}`)}
                  className="mt-2 text-sm font-bold text-white bg-gray-900 px-3 py-1.5 rounded-lg w-max hover:bg-black transition-colors"
                 >
                   View Product
                 </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderPromo = () => (
    <div className="animate-fade-in space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900">Promo or Coupon</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="bg-gray-50 px-4 py-3 rounded-t-xl">
            <h3 className="font-bold text-gray-900 text-sm">Available coupon</h3>
          </div>
          <div className="bg-white border border-gray-100 border-t-0 p-5 rounded-b-xl shadow-sm">
            {coupons.available.length === 0 ? (
              <p className="text-gray-500 font-bold text-sm text-center py-4">No coupons available right now</p>
            ) : (
              coupons.available.map(coupon => (
                <div key={coupon._id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b border-gray-50 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                    <Ticket size={24} />
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-start w-full">
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{coupon.title}</h4>
                        <p className="text-xs text-gray-500 mt-0.5 font-medium">Validity: {new Date(coupon.validUntil).toLocaleDateString()}</p>
                      </div>
                      <span className="bg-gray-50 text-gray-700 text-[10px] font-bold px-3 py-1 rounded-full border border-gray-100">Active</span>
                    </div>
                    <div className="mt-3 flex items-center">
                      <div className="bg-gray-50 text-gray-700 font-bold text-xs px-3 py-2 rounded-lg flex items-center gap-2 border border-gray-100">
                        {coupon.code}
                        <button className="text-gray-500 hover:text-gray-900 transition-colors cursor-pointer" onClick={() => showToast('Coupon copied!')}>
                          <Copy size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <div className="bg-gray-50 px-4 py-3 rounded-t-xl">
            <h3 className="font-bold text-gray-900 text-sm">Applied coupon</h3>
          </div>
          <div className={`bg-white border border-gray-100 border-t-0 p-5 rounded-b-xl shadow-sm ${coupons.applied.length === 0 ? 'flex items-center justify-center py-8' : ''}`}>
            {coupons.applied.length === 0 ? (
              <p className="text-gray-700 font-bold text-sm">No Coupons Applied</p>
            ) : (
              coupons.applied.map(coupon => (
                <div key={coupon._id} className="flex items-center justify-between mb-2 last:mb-0">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{coupon.code}</h4>
                    <span className="text-xs text-gray-500">Applied</span>
                  </div>
                  <span className="bg-green-50 text-green-700 text-[10px] font-bold px-3 py-1 rounded-full border border-green-100">Success</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const handleSaveAddress = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('http://localhost:5005/api/users/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newAddress)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Server returned an error');
      }
      setAddresses(data);
      setIsAddingAddress(false);
      setNewAddress({ type: 'Home', name: '', street: '', city: '', state: '', zip: '', phone: '' });
      showToast('Address added successfully');
    } catch(err) {
      console.error(err);
      showToast(err.message || 'Failed to add address');
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`http://localhost:5005/api/users/addresses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setAddresses(data);
      showToast('Address deleted');
    } catch(err) {
      showToast('Failed to delete address');
    }
  };

  const renderAddress = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <MapPin className="text-[#f68b1e]" /> Saved Addresses
        </h2>
        {!isAddingAddress && (
          <button 
            onClick={() => setIsAddingAddress(true)}
            className="px-5 py-2 bg-[#f68b1e] text-white text-sm font-bold rounded-lg hover:bg-[#e07b1a] transition-colors shadow-sm"
          >
            + Add New Address
          </button>
        )}
      </div>

      {isAddingAddress ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[400px] p-6 relative">
            <button 
              onClick={() => setIsAddingAddress(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">Address type</label>
                <div className="relative">
                  <select 
                    value={newAddress.type} 
                    onChange={e => setNewAddress({...newAddress, type: e.target.value})}
                    className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium text-sm transition-all"
                  >
                    <option value="">Select</option>
                    <option value="Home">Home</option>
                    <option value="Office">Office</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>

              <div>
                <input 
                  type="text" 
                  placeholder="Address" 
                  value={newAddress.street} 
                  onChange={e => setNewAddress({...newAddress, street: e.target.value})} 
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">Select District</label>
                <div className="relative">
                  <select 
                    value={newAddress.state} 
                    onChange={e => setNewAddress({...newAddress, state: e.target.value, city: ''})}
                    className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium text-sm transition-all"
                  >
                    <option value="">Select District</option>
                    {ALL_DISTRICTS.map(dist => (
                      <option key={dist.id} value={dist.id}>{dist.label}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">Select Thana/Upazila</label>
                <div className="relative">
                  <select 
                    value={newAddress.city} 
                    onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                    disabled={!newAddress.state}
                    className={`w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium text-sm transition-all ${!newAddress.state ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}`}
                  >
                    <option value="">Select Thana</option>
                    {newAddress.state && THANAS_BY_DISTRICT[newAddress.state]?.map(thana => (
                      <option key={thana} value={thana}>{thana}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">Postal code</label>
                <input 
                  type="text" 
                  placeholder="ex: 1000" 
                  value={newAddress.zip} 
                  onChange={e => setNewAddress({...newAddress, zip: e.target.value})} 
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium text-sm transition-all"
                />
              </div>

              <button 
                onClick={handleSaveAddress} 
                className="w-full py-3.5 bg-[#333333] hover:bg-[#222222] text-white font-bold rounded-lg mt-2 transition-colors"
              >
                SAVE
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {addresses.length === 0 ? (
            <EmptyState title="No saved addresses found" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div key={addr._id} className={`border-2 ${addr.isDefault ? 'border-[#f68b1e] bg-orange-50/30' : 'border-gray-100'} rounded-xl p-5 relative`}>
                  {addr.isDefault && (
                    <div className="absolute top-4 right-4 bg-[#f68b1e] text-white text-[10px] uppercase font-bold px-2 py-1 rounded">Default</div>
                  )}
                  <h3 className="font-bold text-gray-900 mb-1">{addr.type || 'Home'}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {addr.name}<br/>{addr.street}<br/>{addr.city}, {addr.state} - {addr.zip}<br/>{addr.phone}
                  </p>
                  <div className="flex items-center gap-3 text-sm">
                    <button className="text-[#f68b1e] font-bold hover:underline flex items-center gap-1"><Edit3 size={14}/> Edit</button>
                    <div className="w-px h-3 bg-gray-300"></div>
                    <button onClick={() => handleDeleteAddress(addr._id)} className="text-gray-500 font-bold hover:text-red-500 transition-colors flex items-center gap-1"><Trash2 size={14}/> Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );

  const renderPayments = () => (
    <div className="animate-fade-in space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900">Payments</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-100/50 to-purple-50/50 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden">
          <div className="w-16 h-16 bg-[#0a80ff] rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 mb-4 text-white">
            <Wallet size={28} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 leading-tight">0 BDT</h3>
          <p className="text-gray-500 text-sm mt-1">This month spent</p>
        </div>

        <div className="p-8 rounded-2xl bg-gradient-to-br from-lime-50/50 to-rose-50/50 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden">
          <div className="w-16 h-16 bg-[#00d084] rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-4 text-white relative">
            <Calendar size={28} />
            <div className="absolute bottom-0 right-0 bg-[#00d084] border-2 border-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
              $
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 leading-tight">0 BDT</h3>
          <p className="text-gray-500 text-sm mt-1">Last 6 month spent</p>
        </div>

        <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-100/50 to-pink-50/50 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden">
          <div className="w-16 h-16 bg-[#ff6b00] rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30 mb-4 text-white">
            <Wallet size={28} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 leading-tight">0</h3>
          <p className="text-gray-500 text-sm mt-1">Total spent</p>
        </div>
      </div>

      <div className="pt-2">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Payments history</h3>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-[#2D2D2D] text-white text-sm font-bold">
                  <th className="p-4 whitespace-nowrap">Date & time</th>
                  <th className="p-4 whitespace-nowrap text-center">TXN id</th>
                  <th className="p-4 whitespace-nowrap text-center">Method</th>
                  <th className="p-4 whitespace-nowrap text-center">Amount</th>
                  <th className="p-4 whitespace-nowrap text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm bg-gray-50/50">
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-500 font-bold">
                    No Payment Record Found
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReviews = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 animate-fade-in">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Star className="text-[#f68b1e]" /> My Reviews
      </h2>
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <EmptyState title="You haven't reviewed any products yet" />
        ) : (
          reviews.map((review) => (
            <div 
              key={review._id} 
              onClick={() => navigate(`/product/${review.productId?._id || review.productId?.id}`)}
              className="border border-gray-100 rounded-xl p-5 hover:border-gray-200 transition-colors cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="w-16 h-16 bg-gray-50 rounded flex items-center justify-center shrink-0 hidden sm:flex">
                  {(review.productId?.images?.[0] || review.productId?.image) ? (
                    <img src={review.productId?.images?.[0] || review.productId?.image} alt={review.productId?.name} className="w-full h-full object-cover rounded" />
                  ) : (
                    <Package size={20} className="text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-sm">{review.productId?.name || 'Product'}</h4>
                  <div className="flex items-center gap-1 my-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < review.rating ? "fill-[#f68b1e] text-[#f68b1e]" : "fill-gray-200 text-gray-200"} />
                    ))}
                    <span className="text-xs text-gray-500 ml-2">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-2">{review.comment}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderSupport = () => {
    if (isCreatingTicket) {
      return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 animate-fade-in max-w-3xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-xl font-bold text-gray-900">Create ticket</h2>
            <button 
              onClick={() => setIsCreatingTicket(false)}
              className="px-4 py-2 bg-gray-50 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 border border-gray-200"
            >
              <ArrowLeft size={16} /> Back to tickets
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Ticket title</label>
              <input type="text" value={newTicket.title} onChange={e => setNewTicket({...newTicket, title: e.target.value})} placeholder="Ticket title here" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#f68b1e] text-sm" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Select topic</label>
              <select value={newTicket.topic} onChange={e => setNewTicket({...newTicket, topic: e.target.value})} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#f68b1e] text-sm text-gray-700 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_16px_center] bg-no-repeat">
                <option value="">Select</option>
                <option value="order">Order Issue</option>
                <option value="payment">Payment Issue</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Ticket description</label>
              <textarea value={newTicket.description} onChange={e => setNewTicket({...newTicket, description: e.target.value})} placeholder="Describe your issues.." rows="6" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#f68b1e] text-sm resize-y"></textarea>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Upload attachment</label>
              <label className="w-full border border-gray-100 rounded-lg bg-gray-50 flex flex-col items-center justify-center py-4 cursor-pointer hover:bg-gray-100 transition-colors relative overflow-hidden">
                {newTicket.photoUrl ? (
                  <img src={newTicket.photoUrl} alt="Attachment" className="max-h-32 object-contain" />
                ) : (
                  <div className="flex items-center gap-2 text-gray-600 font-bold text-sm">
                    <Upload size={16} /> Upload photo
                  </div>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </label>
            </div>

            <div className="pt-2">
              <button 
                onClick={handleCreateTicket}
                className="px-6 py-3 bg-[#2D2D2D] text-white font-bold rounded-lg hover:bg-black transition-colors text-sm flex items-center gap-2"
              >
                <Plus size={16} /> CREATE TICKET
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="text-[#f68b1e]" /> Support Tickets
          </h2>
          <button 
            onClick={() => setIsCreatingTicket(true)}
            className="px-5 py-2 bg-[#f68b1e] text-white text-sm font-bold rounded-lg hover:bg-[#e07b1a] transition-colors shadow-sm"
          >
            Open New Ticket
          </button>
        </div>
      <div className="border border-gray-100 rounded-xl overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <th className="p-4 font-bold">Ticket ID</th>
              <th className="p-4 font-bold">Subject</th>
              <th className="p-4 font-bold">Status</th>
              <th className="p-4 font-bold">Date</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {tickets.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-500 font-bold">
                  No tickets found
                </td>
              </tr>
            ) : (
              tickets.map(ticket => (
                <tr key={ticket._id} onClick={() => setSelectedTicket(ticket)} className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                  <td className="p-4 font-bold text-gray-900">#{ticket._id.slice(-6).toUpperCase()}</td>
                  <td className="p-4 text-gray-600 font-medium">{ticket.title}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 font-bold rounded text-[10px] uppercase tracking-wider ${
                      ticket.status === 'Open' ? 'bg-orange-50 text-orange-600' :
                      ticket.status === 'Closed' ? 'bg-gray-50 text-gray-600' :
                      'bg-blue-50 text-blue-600'
                    }`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Ticket Details Modal for User */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Ticket #{selectedTicket._id.slice(-6).toUpperCase()}</h2>
                <p className="text-sm text-gray-500">Status: <span className="font-bold text-brand-primary">{selectedTicket.status}</span></p>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="text-gray-400 hover:text-gray-600 bg-white p-2 rounded-full shadow-sm">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
              {/* Original User Message */}
              <div className="flex gap-4 flex-row-reverse">
                <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white shadow-sm flex items-center justify-center shrink-0">
                  <User size={18} className="text-blue-600" />
                </div>
                <div className="bg-brand-primary text-white p-4 rounded-2xl rounded-tr-none shadow-sm max-w-[80%]">
                  <h3 className="font-bold mb-1 text-[15px]">{selectedTicket.title}</h3>
                  {selectedTicket.description && (
                    <p className="text-white/95 text-sm whitespace-pre-wrap leading-relaxed">{selectedTicket.description}</p>
                  )}
                  {selectedTicket.photoUrl && (
                    <div className="mt-3 bg-white/10 p-1 rounded-xl">
                      <img src={selectedTicket.photoUrl} alt="Attachment" className="max-w-full h-auto max-h-48 rounded-lg" />
                    </div>
                  )}
                  <span className="text-[10px] text-white/70 mt-2 block text-right">{new Date(selectedTicket.createdAt).toLocaleString()}</span>
                </div>
              </div>

              {/* Responses */}
              {selectedTicket.responses && selectedTicket.responses.map((resp, idx) => (
                <div key={idx} className={`flex gap-4 ${resp.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-full border-2 border-white shadow-sm flex items-center justify-center shrink-0 ${resp.sender === 'admin' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                    {resp.sender === 'admin' ? (
                      <span className="text-lg" title="Support">🐾</span>
                    ) : (
                      <User size={18} />
                    )}
                  </div>
                  <div className={`p-4 rounded-2xl max-w-[80%] shadow-sm ${resp.sender === 'user' ? 'bg-brand-primary text-white rounded-tr-none' : 'bg-white border border-gray-100 rounded-tl-none'}`}>
                    <p className={`text-sm whitespace-pre-wrap leading-relaxed ${resp.sender === 'admin' ? 'text-gray-800' : 'text-white/95'}`}>
                      {resp.message}
                    </p>
                    <span className={`text-[10px] mt-2 block ${resp.sender === 'user' ? 'text-white/70 text-right' : 'text-gray-400'}`}>
                      {new Date(resp.date).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {selectedTicket.status !== 'Closed' && (
              <div className="p-4 border-t border-gray-100 bg-white flex items-end gap-3">
                <textarea 
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Reply to support..."
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-brand-primary resize-none min-h-[60px]"
                ></textarea>
                <button 
                  onClick={handleTicketReply}
                  className="bg-[#2D2D2D] hover:bg-black text-white p-3 rounded-xl font-bold"
                >
                  Send
                </button>
              </div>
            )}
            
            {selectedTicket.status === 'Closed' && (
              <div className="p-4 border-t border-gray-100 bg-gray-50 text-center text-gray-500 text-sm font-medium">
                This ticket has been closed. You cannot send new messages.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    );
  };

  const renderManageProfile = () => (
    <div className="animate-fade-in space-y-6 max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900">Manage profile</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10 space-y-8 max-w-2xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
            <input type="text" value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} placeholder="MAHIN" className="w-full bg-white border border-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:border-gray-300 text-sm placeholder:text-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Upload New Photo</label>
            <div className="flex border border-gray-100 rounded-lg overflow-hidden h-[46px]">
              <label className="bg-gray-50 px-4 flex items-center text-sm text-gray-700 cursor-pointer hover:bg-gray-100 border-r border-gray-100">
                Choose file
                <input type="file" className="hidden" />
              </label>
              <div className="px-4 flex items-center text-sm text-gray-500 bg-white flex-1">
                No file chosen
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Address</label>
          <input type="text" value={profileData.address} onChange={(e) => setProfileData({...profileData, address: e.target.value})} placeholder="ex. Dhaka, Bangladesh" className="w-full bg-white border border-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:border-gray-300 text-sm placeholder:text-gray-400" />
        </div>

        <button 
          onClick={handleProfileUpdate} 
          className="w-full py-3.5 bg-[#2D2D2D] hover:bg-black text-white font-bold rounded-lg transition-colors text-sm"
        >
          Save Changes
        </button>

        <div className="space-y-6 pt-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
            <div className="relative flex items-center">
              <input type="tel" value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} placeholder="e.g. 01*********" className="w-full bg-white border border-gray-100 rounded-lg pl-4 pr-36 py-3 focus:outline-none focus:border-gray-300 text-sm placeholder:text-gray-400" />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-bold rounded">
                CHANGE NUMBER
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
            <div className="relative flex items-center">
              <input type="email" value={profileData.email} disabled placeholder="mahincse543@gmail.com" className="w-full bg-gray-50 border border-gray-100 rounded-lg pl-4 pr-36 py-3 focus:outline-none focus:border-gray-300 text-sm placeholder:text-gray-400 text-gray-500 cursor-not-allowed" />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-bold rounded">
                CHANGE EMAIL
              </button>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Third-party linked account</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="font-bold text-gray-900 text-sm">Google</span>
            </div>
            <button className="px-4 py-1.5 bg-gray-50 text-gray-600 hover:bg-gray-100 text-xs font-bold rounded-lg border border-gray-100 transition-colors">
              Revoke
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderChangePassword = () => (
    <div className="animate-fade-in space-y-6 max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900">Change password</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10 space-y-6 max-w-xl mx-auto">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Set a new password</label>
          <div className="relative flex items-center">
            <input type="password" value={passwords.newPassword} onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} placeholder="" className="w-full bg-white border border-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:border-gray-300 text-sm" />
            <button className="absolute right-4 text-gray-400 hover:text-gray-600">
              <EyeOff size={18} />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Confirm password</label>
          <div className="relative flex items-center">
            <input type="password" value={passwords.confirmPassword} onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})} placeholder="" className="w-full bg-white border border-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:border-gray-300 text-sm" />
            <button className="absolute right-4 text-gray-400 hover:text-gray-600">
              <EyeOff size={18} />
            </button>
          </div>
        </div>

        <button 
          onClick={handlePasswordUpdate} 
          className="w-full py-3.5 mt-2 bg-[#2D2D2D] hover:bg-black text-white font-bold rounded-lg transition-colors text-sm"
        >
          Update Password
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'all-orders': return renderOrdersTable('all');
      case 'cancelled-orders': return renderOrdersTable('cancelled');
      case 'wishlist': return renderWishlist();
      case 'promo': return renderPromo();
      case 'address': return renderAddress();
      case 'payments': return renderPayments();
      case 'reviews': return renderReviews();
      case 'support': return renderSupport();
      case 'manage-profile': return renderManageProfile();
      case 'change-password': return renderChangePassword();
      default: return renderDashboard();
    }
  };

  const SidebarContent = () => (
    <div className="sidebar-nav-container flex flex-col h-full bg-white shadow-lg lg:shadow-none lg:border lg:border-gray-100 lg:rounded-2xl overflow-hidden w-72">
      {/* User Header */}
      <div className="bg-gray-900 p-8 text-white relative">
        <h2 className="text-2xl font-bold mb-1">{profileData.name || 'User'}</h2>
        <p className="text-gray-400 text-sm mb-4">{profileData.email}</p>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id || (link.subLinks && link.subLinks.some(sub => sub.id === activeTab));
            const Icon = link.icon;
            
            return (
              <div key={link.id} className="mb-1">
                <button
                  onClick={() => {
                    if (link.subLinks) {
                      setExpandedMenus(prev => ({ ...prev, [link.id]: !prev[link.id] }));
                    } else {
                      setActiveTab(link.id);
                      setIsSidebarOpen(false);
                      setExpandedMenus({});
                    }
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-sm font-bold ${
                    isActive && !link.subLinks
                      ? 'bg-gray-800 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={(isActive && !link.subLinks) ? 'text-white' : 'text-gray-500'} />
                    {link.label}
                  </div>
                  {link.subLinks ? (
                    <ArrowRight size={16} className={`text-gray-400 transition-transform ${expandedMenus[link.id] ? 'rotate-90' : ''}`} />
                  ) : (isActive && (
                    <ArrowRight size={16} className="text-white" />
                  ))}
                </button>
                
                {link.subLinks && expandedMenus[link.id] && (
                  <div className="mt-1 ml-4 pl-4 border-l-2 border-gray-100 space-y-1">
                    {link.subLinks.map(sub => (
                      <button
                        key={sub.id}
                        onClick={() => {
                          setActiveTab(sub.id);
                          setIsSidebarOpen(false);
                        }}
                        className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors text-sm font-bold ${
                          activeTab === sub.id
                            ? 'bg-[#f68b1e]/10 text-[#f68b1e]'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          
          <div className="h-px bg-gray-100 my-4 mx-2"></div>
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-bold text-red-600 hover:bg-red-50"
          >
            <LogOut size={18} />
            Logout
          </button>
        </nav>
      </div>
    </div>
  );

  return (
    <div className="bg-[#f4f6f8] lg:min-h-screen pt-4 pb-8 lg:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Desktop Sidebar */}
          <div className="hidden lg:block shrink-0 sticky top-24">
            <SidebarContent />
          </div>

          {/* Main Content */}
          <div className="flex-1 w-full min-w-0">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Mobile Floating Button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden fixed top-1/3 right-0 -translate-y-1/2 bg-[#2D2D2D] text-white p-3 rounded-l-lg shadow-xl z-[60] hover:bg-black transition-colors border border-[#444] border-r-0"
      >
        <User size={24} />
      </button>

      {/* Mobile Drawer (Off-canvas menu) */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
          
          {/* Drawer Content */}
          <div className="relative flex flex-col w-72 max-w-[80%] bg-white h-full shadow-2xl z-10 transform transition-transform">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-6 right-4 p-1.5 text-white/70 hover:text-white rounded-full bg-black/20 z-50 transition-colors"
            >
              <X size={20} />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
