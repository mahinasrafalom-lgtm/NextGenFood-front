import React from 'react';
import { Home, LayoutGrid, ShoppingBag, Search, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const MobileBottomNav = ({ cartCount, onOpenSearch, isLoggedIn }) => {
  const { openCartDrawer } = useCart();
  const location = useLocation();
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-brand-mid text-white z-[60] flex items-center justify-around pt-2 pb-3 px-2 sm:px-4 shadow-[0_-4px_15px_rgba(0,0,0,0.15)]">
      <Link to="/" className={`flex flex-col items-center justify-center gap-1 p-1 flex-1 active:scale-95 transition-all ${location.pathname === '/' ? 'text-white drop-shadow-md scale-105' : 'text-white/80'}`}>
        <Home size={22} strokeWidth={2.5} />
        <span className="text-[9px] uppercase font-bold tracking-wider">Home</span>
      </Link>
      
      <Link to="/products" className={`flex flex-col items-center justify-center gap-1 p-1 flex-1 active:scale-95 transition-all ${location.pathname === '/products' ? 'text-white drop-shadow-md scale-105' : 'text-white/80'}`}>
        <LayoutGrid size={22} strokeWidth={2.5} />
        <span className="text-[9px] uppercase font-bold tracking-wider">Menu</span>
      </Link>
      
      <button 
        onClick={openCartDrawer} 
        className="flex flex-col items-center justify-center gap-1 p-1 flex-1 active:scale-95 transition-all relative text-white/80"
      >
        <div className="relative">
          <ShoppingBag size={22} strokeWidth={2.5} />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-gray-900 text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-brand-mid">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[9px] uppercase font-bold tracking-wider">Cart</span>
      </button>
      
      <button onClick={onOpenSearch} className="search-toggle-btn flex flex-col items-center justify-center gap-1 p-1 flex-1 active:scale-95 transition-transform text-white/80 hover:text-white">
        <Search size={22} strokeWidth={2.5} />
        <span className="text-[9px] uppercase font-bold tracking-wider">Search</span>
      </button>
      
      <Link onClick={() => window.scrollTo(0,0)} to={isLoggedIn ? "/profile" : "/login"} className="flex flex-col items-center justify-center gap-1 p-1 flex-1 active:scale-95 transition-transform text-white/80 hover:text-white">
        <User size={22} strokeWidth={2.5} />
        <span className="text-[9px] uppercase font-bold tracking-wider">Account</span>
      </Link>
    </div>
  );
};

export default MobileBottomNav;
