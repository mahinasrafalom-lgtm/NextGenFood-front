import React, { useEffect } from 'react';
import { ArrowLeft, ShieldCheck, FileText, Lock, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Terms = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-brand-light pb-20 pt-5 md:pt-10">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Header */}
        <div className="mb-8 flex flex-col items-center text-center relative">
          <button 
            onClick={() => navigate(-1)} 
            className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-50 shadow-sm border border-gray-100 transition-colors hidden md:flex"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          
          <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 text-brand-mid">
            <FileText size={32} strokeWidth={2} />
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight mb-2">Terms & Conditions</h1>
          <p className="text-gray-500 font-medium max-w-md">Please read these terms carefully before using NexGen Veterinary services.</p>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-gray-100">
          <div className="prose prose-gray max-w-none">
            
            <p className="text-gray-600 mb-8 leading-relaxed">
              Welcome to NexGen Veterinary! These Terms & Conditions outline the rules and regulations for the use of our website and services. By accessing this website, we assume you accept these terms and conditions. Do not continue to use NexGen Veterinary if you do not agree to take all of the terms and conditions stated on this page.
            </p>

            <div className="space-y-8">
              {/* Section 1 */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-brand-section flex items-center justify-center shrink-0">
                    <ShieldCheck size={16} className="text-brand-mid" />
                  </div>
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 m-0">1. License & Usage</h2>
                </div>
                <div className="pl-11 text-gray-600 leading-relaxed space-y-3">
                  <p>Unless otherwise stated, NexGen Veterinary and/or its licensors own the intellectual property rights for all material on NexGen Veterinary. All intellectual property rights are reserved.</p>
                  <p>You must not:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Republish material from NexGen Veterinary</li>
                    <li>Sell, rent, or sub-license material from NexGen Veterinary</li>
                    <li>Reproduce, duplicate or copy material from NexGen Veterinary</li>
                    <li>Redistribute content from NexGen Veterinary</li>
                  </ul>
                </div>
              </section>

              {/* Section 2 */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <Lock size={16} className="text-blue-600" />
                  </div>
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 m-0">2. Data Privacy</h2>
                </div>
                <div className="pl-11 text-gray-600 leading-relaxed">
                  <p>We respect your privacy and protect your personal information. When you register an account, purchase products, or book a consultation, you provide personal data. This data is handled in accordance with our Privacy Policy to ensure your pets' and your own information remains confidential and secure.</p>
                </div>
              </section>

              {/* Section 3 */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                    <HelpCircle size={16} className="text-orange-500" />
                  </div>
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 m-0">3. Veterinary Consultations</h2>
                </div>
                <div className="pl-11 text-gray-600 leading-relaxed">
                  <p>Our online veterinary consultation service connects you with certified professionals. However, online advice is not a complete substitute for a physical examination. In cases of severe emergency, please visit your nearest animal hospital immediately.</p>
                </div>
              </section>

            </div>

            <div className="mt-12 pt-8 border-t border-gray-100">
              <p className="text-sm text-gray-400">Last updated: August 2026</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Terms;
