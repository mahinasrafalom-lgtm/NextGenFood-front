import React from 'react';
import { X, User, ChevronRight, Info, HelpCircle, FileText } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const MobileDrawerMenu = ({ isOpen, onClose, isLoggedIn }) => {
  const navigate = useNavigate();

  // Actual product categories instead of placeholder data
  const menuItems = [
    { id: 'cat', label: 'Cats' },
    { id: 'dog', label: 'Dogs' },
    { id: 'bird', label: 'Birds' },
    { id: 'fish', label: 'Fish' },
    { id: 'pets', label: 'Other Pets' },
    { id: 'goat', label: 'Goats' },
    { id: 'rabbit', label: 'Rabbits' },
    { id: 'medicine', label: 'Pharmacy' },
  ];

  const quickLinks = [
    { label: 'About Us', icon: <Info size={18} />, path: '/about' },
    { label: 'Faqs', icon: <HelpCircle size={18} />, path: '/faq' },
    { label: 'Terms & Conditions', icon: <FileText size={18} />, path: '/terms' },
  ];

  const handleCategoryClick = (categoryId) => {
    onClose();
    navigate(`/products?animalType=${categoryId}`);
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 z-[100] transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div 
        className={`fixed inset-y-0 left-0 w-[80vw] max-w-[320px] bg-white z-[110] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header Section */}
        <div className="bg-brand-mid p-5 text-white flex flex-col relative">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
          
          <div className="flex items-center gap-4 mt-2">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-brand-mid shadow-inner">
              <User size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Hello there!</h3>
              <Link 
                to={isLoggedIn ? "/profile" : "/login"} 
                onClick={onClose} 
                className="text-sm text-white/90 font-medium hover:underline mt-0.5 inline-block"
              >
                {isLoggedIn ? 'View Profile' : 'Signin'}
              </Link>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {/* List Items */}
          <div className="py-2 border-b border-gray-100">
            {menuItems.map((item, idx) => (
              <button 
                key={idx}
                onClick={() => handleCategoryClick(item.id)}
                className="w-full flex items-center justify-between px-5 py-4 border-b border-gray-50 hover:bg-brand-section active:bg-gray-100 transition-colors last:border-0 group"
              >
                <span className="font-medium text-[15px] text-gray-800 group-hover:text-brand-mid transition-colors">{item.label}</span>
                <ChevronRight size={18} className="text-gray-300 group-hover:text-brand-mid transition-colors group-hover:translate-x-1" />
              </button>
            ))}
          </div>
          
          {/* Quick Links Section */}
          <div className="py-4">
            <h4 className="px-5 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Quick Links</h4>
            {quickLinks.map((link, idx) => (
              <Link 
                to={link.path}
                key={idx}
                onClick={onClose}
                className="w-full flex items-center gap-4 px-5 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors text-gray-600 hover:text-brand-mid"
              >
                <span className="text-gray-400 flex-shrink-0">{link.icon}</span>
                <span className="font-medium text-[14px]">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileDrawerMenu;
