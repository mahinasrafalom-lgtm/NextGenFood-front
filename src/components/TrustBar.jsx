import React from 'react';
import { Store, ShieldCheck, RefreshCcw, Headset } from 'lucide-react';

const TrustBar = () => {
  return (
    <section className="bg-brand-section py-10 font-bengali border-t border-brand-mid">
      <div className="container mx-auto px-4 max-w-[1350px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="flex items-start gap-4">
            <div className="bg-brand-section p-3 rounded-full text-brand-mid shrink-0">
              <Store size={24} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">১০০% অরিজিনাল পণ্য</h4>
              <p className="text-sm text-gray-600">সারা দেশের ব্র্যান্ড থেকে সংগ্রহ</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-brand-section p-3 rounded-full text-brand-mid shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">SSL এনক্রিপশন সুরক্ষা</h4>
              <p className="text-sm text-gray-600">নিরাপদ পেমেন্ট গ্যারান্টি</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-brand-section p-3 rounded-full text-brand-mid shrink-0">
              <RefreshCcw size={24} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">সহজ রিটার্ন</h4>
              <p className="text-sm text-gray-600">৭ দিনের মধ্যে রিটার্ন</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-brand-section p-3 rounded-full text-brand-mid shrink-0">
              <Headset size={24} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">আমাদের বিশেষজ্ঞের সাথে কথা বলুন</h4>
              <p className="text-sm text-gray-600">২৪/৭ কাস্টমার সাপোর্ট</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TrustBar;
