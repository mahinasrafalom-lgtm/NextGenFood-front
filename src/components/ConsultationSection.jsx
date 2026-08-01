import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    const handleOpenModal = () => setIsModalOpen(true);
    window.addEventListener('openConsultationModal', handleOpenModal);
    return () => window.removeEventListener('openConsultationModal', handleOpenModal);
  }, []);

  const handleBook = (option) => {
    setIsModalOpen(false);
    navigate(`/consultation/${option.id}`);
  };

  return (
    <>
      {/* Floating Action Button (Bottom Left) */}
      <div className="fixed bottom-[85px] left-4 md:bottom-6 md:left-6 z-50 flex flex-col items-start gap-2">
         {/* Highlight tooltip (Hidden when panel is open) */}
         {!isModalOpen && (
           <div className="bg-brand-mid text-white text-xs font-bold px-3 py-2 rounded-lg shadow-lg relative animate-bounce hidden md:block cursor-pointer" onClick={() => setIsModalOpen(true)}>
              Free Vet Consultation
              <div className="absolute -bottom-1.5 left-4 w-3 h-3 bg-brand-mid transform rotate-45"></div>
           </div>
         )}
         
         {/* FAB */}
         <button 
           onClick={() => setIsModalOpen(!isModalOpen)}
           className={`w-14 h-14 md:w-16 md:h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 group overflow-hidden relative z-10 ${isModalOpen ? 'bg-gray-800 border-gray-800 scale-90' : 'bg-white border-2 border-brand-mid hover:bg-brand-section'}`}
         >
           {!isModalOpen && <div className="absolute inset-0 bg-brand-mid/20 animate-ping rounded-full"></div>}
           {isModalOpen ? (
             <X className="text-white" size={28} strokeWidth={2.5} />
           ) : (
             <Stethoscope className="text-brand-mid group-hover:scale-110 transition-transform relative z-10" size={30} strokeWidth={2.5} />
           )}
         </button>
      </div>

      {/* Floating Drawer / Panel */}
      <div 
        className={`fixed bottom-[150px] md:bottom-24 left-4 md:left-6 z-[100] transition-all duration-300 origin-bottom-left ${
          isModalOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 translate-y-8 pointer-events-none'
        }`}
      >
        <div className="bg-white rounded-2xl shadow-[0_12px_40px_rgb(0,0,0,0.15)] border border-gray-100 w-[280px] sm:w-[320px] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-mid to-brand-primary p-4 text-white relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/20 rounded-full blur-xl"></div>
            <div className="flex items-center gap-2 relative z-10">
               <Stethoscope size={22} className="shrink-0" />
               <div>
                 <h3 className="font-bold text-[15px] leading-tight">Vet Consultation</h3>
                 <p className="text-[10px] text-white/80 font-medium">Get expert advice instantly</p>
               </div>
            </div>
          </div>
          
          {/* Body */}
          <div className="p-4 space-y-2.5 max-h-[60vh] overflow-y-auto custom-scrollbar">
            <p className="text-xs text-gray-500 font-medium px-1">Select your pet type to proceed:</p>
            {consultationOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => handleBook(option)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-brand-mid hover:bg-brand-section hover:shadow-md transition-all duration-200 group text-left"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${option.bg} ${option.color} group-hover:scale-110 transition-transform shrink-0`}>
                    <Icon size={20} />
                  </div>
                  <span className="font-bold text-gray-700 text-sm group-hover:text-brand-mid transition-colors">
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Background overlay for mobile (optional, but good for focus) */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default ConsultationSection;
