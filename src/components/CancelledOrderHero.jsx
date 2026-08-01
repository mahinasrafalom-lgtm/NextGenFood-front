import React from 'react';
import { XCircle, ShieldAlert } from 'lucide-react';

const CancelledOrderHero = ({ reason }) => {
  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-br from-red-900 via-red-950 to-black p-8 md:p-12 rounded-2xl border border-red-500/20 shadow-2xl isolate group">
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-red-500/10 blur-[80px] rounded-full pointer-events-none transition-transform duration-1000 group-hover:scale-150" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none transition-transform duration-1000 group-hover:scale-150" />
      
      {/* Particles effect overlay (CSS driven) */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-20 pointer-events-none [mask-image:linear-gradient(to_bottom,white,transparent)]" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12 max-w-4xl mx-auto">
        
        {/* 3D Floating Icon Area */}
        <div className="relative flex-shrink-0 perspective-1000">
          {/* Main 3D Container */}
          <div className="w-32 h-32 md:w-40 md:h-40 relative transform-style-3d animate-float-3d transition-transform duration-500 group-hover:rotate-y-12 group-hover:rotate-x-12">
            {/* Glossy Backdrop */}
            <div className="absolute inset-0 bg-gradient-to-tr from-red-600 to-red-400 rounded-3xl opacity-20 blur-xl" />
            
            {/* 3D Box front face */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md border border-white/20 rounded-3xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_20px_40px_rgba(0,0,0,0.5)] flex items-center justify-center transform translate-z-10">
              <XCircle className="w-16 h-16 md:w-20 md:h-20 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]" strokeWidth={1.5} />
            </div>
            
            {/* Glowing rings */}
            <div className="absolute inset-[-20%] rounded-full border border-red-500/30 animate-spin-slow opacity-50" style={{ transform: 'translateZ(-10px)' }} />
            <div className="absolute inset-[-40%] rounded-full border border-red-500/10 animate-spin-slow-reverse opacity-50" style={{ transform: 'translateZ(-20px)' }} />
          </div>
        </div>

        {/* Text Content */}
        <div className="flex-1 text-center md:text-left space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest backdrop-blur-sm shadow-[0_0_10px_rgba(239,68,68,0.2)]">
            <ShieldAlert size={14} />
            Order Terminated
          </div>
          
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-md">
            Order Has Been <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500">Cancelled</span>
          </h2>
          
          <div className="bg-black/40 backdrop-blur-md rounded-xl p-5 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] transform transition-transform duration-500 hover:scale-[1.02]">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Cancellation Reason</p>
            <p className="text-lg md:text-xl font-medium text-red-200">
              {reason || 'No specific reason provided.'}
            </p>
          </div>
          
          <p className="text-sm text-gray-400 max-w-lg mx-auto md:mx-0">
            Any processing payments will be refunded to your original payment method automatically within 3-5 business days. 
          </p>
        </div>
        
      </div>
    </div>
  );
};

export default CancelledOrderHero;
