import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Header from './components/Header';
import CategoryNav from './components/CategoryNav';
import TrustBar from './components/TrustBar';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import FloatingCart from './components/FloatingCart';
import MobileBottomNav from './components/MobileBottomNav';
import MobileDrawerMenu from './components/MobileDrawerMenu';
import ChatWidget from './components/ChatWidget';
import Home from './pages/Home';
import ProductListing from './pages/ProductListing';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import OrderConfirmation from './pages/OrderConfirmation';
import CartDrawer from './components/CartDrawer';
import Toast from './components/Toast';
import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';

function App() {
  const [lang, setLang] = useState('bn');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { currentUser } = useAuth();
  const isLoggedIn = !!currentUser;
  
  const { cartCount, cartTotal } = useCart();
  const location = useLocation();

  const isProductListingPage = location.pathname === '/products';
  const isProductDetailsPage = location.pathname.startsWith('/product/');
  const isHomePage = location.pathname === '/';
  const isCheckoutPage = location.pathname === '/checkout' || location.pathname === '/order-confirmation';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isProfilePage = location.pathname === '/profile';
  
  // Global nav rendering logic:
  // - Home: Show all (Announcement, Header, CategoryNav)
  // - Product Listing: Show all on Desktop only (hidden on mobile)
  // - Product Details: Show Header only everywhere

  return (
    <div className="min-h-screen bg-brand-light font-sans text-gray-900 pb-[76px] md:pb-0 relative w-full">
      <div className="w-full overflow-x-hidden">
        {!isProductDetailsPage && !isCheckoutPage && !isAuthPage && (
        <div className={isProductListingPage ? "hidden lg:block" : ""}>

          <Header 
            cartCount={cartCount} 
            lang={lang} 
            setLang={setLang} 
            mobileSearchOpen={mobileSearchOpen}
            setMobileSearchOpen={setMobileSearchOpen}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
            isLoggedIn={isLoggedIn}
          />
          {!isProductListingPage && <CategoryNav />}
        </div>
      )}

      {/* On Checkout page, we render a simplified Header */}
      {isCheckoutPage && (
        <Header 
          isCheckoutPage={true}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
      )}
      
      {/* On Product Details page, we only render the Header (no Announcement or CategoryNav) */}
      {isProductDetailsPage && (
        <Header 
          cartCount={cartCount} 
          lang={lang} 
          setLang={setLang} 
          mobileSearchOpen={mobileSearchOpen}
          setMobileSearchOpen={setMobileSearchOpen}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
      )}
      
      {!isCheckoutPage && <FloatingCart />}
      
      <CartDrawer isLoggedIn={isLoggedIn} />
      <Toast />
      
      {!isCheckoutPage && !isAuthPage && (
        <MobileBottomNav 
          cartCount={cartCount} 
          onOpenSearch={() => {
            setMobileSearchOpen(prev => {
              const willOpen = !prev;
              if (willOpen) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
              return willOpen;
            });
          }}
          isLoggedIn={isLoggedIn}
        />
      )}
      
      <MobileDrawerMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        isLoggedIn={isLoggedIn}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductListing />} />
        <Route path="/product/:id" element={<ProductDetails isLoggedIn={isLoggedIn} />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout isLoggedIn={isLoggedIn} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
      </Routes>

        {(isHomePage || isProfilePage) && (
          <>
            {isHomePage && <TrustBar />}
            {isHomePage && <Newsletter />}
            <Footer />
          </>
        )}
      </div>
      <ChatWidget />
    </div>
  );
}

export default App;
