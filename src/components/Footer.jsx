import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white pt-16 pb-8 border-t border-gray-200">
      <div className="container mx-auto px-4 max-w-[1350px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <img src="/logo.png" alt="NexGen Veterinary" className="w-10 h-10 object-contain drop-shadow-sm group-hover:scale-105 transition-transform" />
              <div>
                <h2 className="text-lg font-bold font-sans text-gray-900 leading-tight">Next <span className="text-gray-800">Pet Food</span></h2>
              </div>
            </Link>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Your pet's health and wellness is our commitment.
            </p>
            <div className="flex gap-3 text-gray-400">
              {/* Social Icons */}
              <a href="#" className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-brand-mid hover:text-white hover:border-brand-mid transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-brand-mid hover:text-white hover:border-brand-mid transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-brand-mid hover:text-white hover:border-brand-mid transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
              </a>
            </div>
          </div>

          {/* Col 2: Shop */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-sm">Shop</h3>
            <ul className="space-y-3 text-gray-500 text-sm">
              <li><Link to="/products" className="hover:text-brand-mid transition-colors">All Products</Link></li>
              <li><Link to="/products?animalType=cat" className="hover:text-brand-mid transition-colors">Cats</Link></li>
              <li><Link to="/products?animalType=dog" className="hover:text-brand-mid transition-colors">Dogs</Link></li>
              <li><Link to="/products?animalType=bird" className="hover:text-brand-mid transition-colors">Birds</Link></li>
              <li><Link to="/products?animalType=medicine" className="hover:text-brand-mid transition-colors">Pharmacy</Link></li>
            </ul>
          </div>

          {/* Col 3: Services */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-sm">Services</h3>
            <ul className="space-y-3 text-gray-500 text-sm">
              <li><Link to="/profile" className="hover:text-brand-mid transition-colors">Redeem Points</Link></li>
              <li><Link to="/consultation/general" className="hover:text-brand-mid transition-colors">Vet Consultation</Link></li>
              <li><Link to="/track-order" className="hover:text-brand-mid transition-colors">Track Order</Link></li>
              <li><Link to="/faq" className="hover:text-brand-mid transition-colors">FAQs</Link></li>
            </ul>
          </div>

          {/* Col 4: About Us */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-sm">About Us</h3>
            <ul className="space-y-3 text-gray-500 text-sm">
              <li><Link to="/about" className="hover:text-brand-mid transition-colors">Our Story</Link></li>
              <li><Link to="#" className="hover:text-brand-mid transition-colors">Blog</Link></li>
              <li><Link to="#" className="hover:text-brand-mid transition-colors">Careers</Link></li>
              <li><Link to="#" className="hover:text-brand-mid transition-colors">Press</Link></li>
            </ul>
          </div>

          {/* Col 5: Contact */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-sm">Contact Us</h3>
            <ul className="space-y-4 text-gray-500 text-sm font-sans">
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-brand-mid shrink-0 mt-0.5" />
                <span>01700-000000</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-brand-mid shrink-0 mt-0.5" />
                <span>support@nexgenvet.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-brand-mid shrink-0 mt-0.5" />
                <span className="leading-relaxed">House 123, Road 45, Dhanmondi, Dhaka-1205</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 font-sans">
          <p>© 2026 NexGen Veterinary. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/terms" className="hover:text-brand-mid transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-brand-mid transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
