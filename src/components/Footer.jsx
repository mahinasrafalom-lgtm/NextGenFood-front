import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white pt-16 pb-8 border-t border-gray-200 font-bengali">
      <div className="container mx-auto px-4 max-w-[1350px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Col 1 */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-brand-section p-1.5 rounded-md text-brand-mid">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20c-1-1.5-2.5-3-4.5-3-2.6 0-4.5 1.5-4.5 3 0 1.5 2.5 3 4.5 3s4.5-1.5 4.5-3z"/><path d="M19 20c-1-1.5-2.5-3-4.5-3-2.6 0-4.5 1.5-4.5 3 0 1.5 2.5 3 4.5 3s4.5-1.5 4.5-3z"/><path d="M15 11c0-2-2.5-4-5-4s-5 2-5 4c0 1.5.5 3 2 4s3.5 1 5 1 3.5-.5 5-1 2-2.5 2-4z"/><path d="M7 6c0-1.5 1.5-3 3-3s3 1.5 3 3-1.5 3-3 3-3-1.5-3-3z"/></svg>
              </div>
              <div>
                <h2 className="text-lg font-bold font-sans text-gray-900 leading-tight">Next <span className="text-gray-800">Pet Food</span></h2>
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              আপনার পোষা প্রাণীর স্বাস্থ্য ও সুস্থতা আমাদের প্রতিশ্রুতি।
            </p>
            <div className="flex gap-3 text-gray-400">
              <a href="#" className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-brand-mid hover:text-white hover:border-brand-mid transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-brand-mid hover:text-white hover:border-brand-mid transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-brand-mid hover:text-white hover:border-brand-mid transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-brand-mid hover:text-white hover:border-brand-mid transition-all flex font-sans font-bold">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/></svg>
              </a>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-sm">শপ করুন</h3>
            <ul className="space-y-3 text-gray-500 text-sm">
              <li><a href="#" className="hover:text-brand-mid transition-colors">সব পণ্য</a></li>
              <li><a href="#" className="hover:text-brand-mid transition-colors">বিড়াল</a></li>
              <li><a href="#" className="hover:text-brand-mid transition-colors">কুকুর</a></li>
              <li><a href="#" className="hover:text-brand-mid transition-colors">ভেটেরিনারি</a></li>
              <li><a href="#" className="hover:text-brand-mid transition-colors">ব্র্যান্ড</a></li>
              <li><a href="#" className="hover:text-brand-mid transition-colors">অফার</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-sm">ব্র্যান্ড সেবা</h3>
            <ul className="space-y-3 text-gray-500 text-sm">
              <li><a href="#" className="hover:text-brand-mid transition-colors">পয়েন্ট রিডিম</a></li>
              <li><a href="#" className="hover:text-brand-mid transition-colors">ডিলার নিবন্ধন</a></li>
              <li><a href="#" className="hover:text-brand-mid transition-colors">ভেটেরিনারি পরামর্শ</a></li>
              <li><a href="#" className="hover:text-brand-mid transition-colors">অ্যাফিলিয়েট প্রোগ্রাম</a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-sm">আমাদের সম্পর্কে</h3>
            <ul className="space-y-3 text-gray-500 text-sm">
              <li><a href="#" className="hover:text-brand-mid transition-colors">আমাদের গল্প</a></li>
              <li><a href="#" className="hover:text-brand-mid transition-colors">ব্লগ</a></li>
              <li><a href="#" className="hover:text-brand-mid transition-colors">ক্যারিয়ার</a></li>
              <li><a href="#" className="hover:text-brand-mid transition-colors">প্রেস</a></li>
            </ul>
          </div>

          {/* Col 5 */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-sm">যোগাযোগ</h3>
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
          <p>© 2026 NexGen Veterinary. সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-gray-600">Privacy Policy</a>
            <a href="#" className="hover:text-gray-600">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
