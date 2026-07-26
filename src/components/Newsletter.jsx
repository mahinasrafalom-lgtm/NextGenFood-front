import React from 'react';

const Newsletter = () => {
  return (
    <section className="bg-brand-mid py-6 font-bengali">
      <div className="container mx-auto px-4 max-w-[1350px]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="text-brand-dark md:w-1/2 text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-bold mb-1">আমাদের নিউজলেটারের সাথে থাকুন</h3>
            <p className="text-brand-dark text-sm">নতুন অফার ও প্রমোশন সম্পর্কে জানতে সাবস্ক্রাইব করুন</p>
          </div>
          
          <div className="md:w-1/2 w-full max-w-md flex">
            <input 
              type="email" 
              placeholder="আপনার ইমেইল অ্যাড্রেস..." 
              className="flex-grow py-3 px-4 outline-none rounded-l-md text-sm text-gray-700"
            />
            <button className="bg-brand-mid text-white font-semibold py-3 px-6 rounded-r-md hover:bg-brand-dark transition-colors">
              সাবস্ক্রাইব
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Newsletter;
