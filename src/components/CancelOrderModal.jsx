import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

const CancelOrderModal = ({ isOpen, onClose, onConfirm, loading }) => {
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const predefinedReasons = [
    "I changed my mind",
    "Found a better price elsewhere",
    "Ordered by mistake",
    "Delivery time is too long",
    "Other"
  ];

  if (!isOpen) return null;

  const handleConfirm = () => {
    const finalReason = reason === 'Other' ? customReason : reason;
    if (!finalReason) {
      alert('Please select or provide a reason for cancellation.');
      return;
    }
    onConfirm(finalReason);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col scale-100 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-red-50/50">
          <div className="flex items-center gap-2">
            <AlertCircle size={20} className="text-red-500" />
            <h2 className="text-lg font-bold text-gray-900">Cancel Order</h2>
          </div>
          <button 
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6 space-y-5">
          <p className="text-sm text-gray-600">
            We're sorry to see you cancel. Please let us know why you are cancelling this order:
          </p>
          
          <div className="space-y-3">
            {predefinedReasons.map((r, idx) => (
              <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" 
                  name="cancelReason" 
                  value={r}
                  checked={reason === r}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-4 h-4 text-brand-mid focus:ring-brand-mid border-gray-300"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">{r}</span>
              </label>
            ))}
          </div>

          {reason === 'Other' && (
            <div className="mt-3 animate-in fade-in slide-in-from-top-2">
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Please specify your reason..."
                className="w-full border border-gray-300 rounded-xl p-3 text-sm outline-none focus:border-brand-mid focus:ring-1 focus:ring-brand-mid resize-none"
                rows="3"
                required
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
          >
            Keep Order
          </button>
          <button 
            onClick={handleConfirm}
            disabled={loading || !reason || (reason === 'Other' && !customReason.trim())}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors flex items-center justify-center min-w-[140px] disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Confirm Cancel'
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default CancelOrderModal;
