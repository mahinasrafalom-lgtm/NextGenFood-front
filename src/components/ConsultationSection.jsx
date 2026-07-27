import React, { useState } from 'react';
import { Stethoscope, X, PhoneCall, Cat, Dog, Bird, Fish, Rabbit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ConsultationSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const consultationOptions = [
    { id: 'cat', label: 'Consultation for Cat', icon: Cat, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'dog', label: 'Consultation for Dog', icon: Dog, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'bird', label: 'Consultation for Bird', icon: Bird, color: 'text-green-500', bg: 'bg-green-50' },
    { id: 'fish', label: 'Consultation for Fish', icon: Fish, color: 'text-cyan-500', bg: 'bg-cyan-50' },
    { id: 'rabbit', label: 'Consultation for Rabbit', icon: Rabbit, color: 'text-pink-500', bg: 'bg-pink-50' },
  ];

  const handleBook = (option) => {
    setIsModalOpen(false);
    navigate(`/consultation/${option.id}`);
  };

  return (
    <>
      {/* Consultation Banner Section */}
      <div className="bg-gradient-to-r from-brand-mid/10 to-brand-mid/5 py-8 md:py-12 border-y border-brand-mid/20">
        <div className="container mx-auto px-4 max-w-[1350px]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-6 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-brand-mid/10">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-brand-mid text-white rounded-2xl flex items-center justify-center shadow-lg shadow-brand-mid/30 shrink-0 transform -rotate-6">
                <Stethoscope size={40} strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                  Free consultation <br className="hidden md:block" /> for your vet
                </h2>
                <p className="text-gray-500 mt-2 font-medium text-sm md:text-base">
                  Get expert advice for your beloved pets from our certified veterinarians.
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full md:w-auto bg-brand-mid hover:bg-brand-dark text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-md hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <PhoneCall size={22} />
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)} />
          
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10 transform transition-all">
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Select Pet Type</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-3">
                {consultationOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleBook(option)}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-100 hover:border-brand-mid hover:bg-brand-section transition-all group text-left"
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${option.bg} ${option.color} group-hover:scale-110 transition-transform`}>
                        <Icon size={24} />
                      </div>
                      <span className="font-bold text-gray-800 text-lg group-hover:text-brand-mid transition-colors">
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConsultationSection;
