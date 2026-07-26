import React, { useState, useEffect } from 'react';

// Utility to trigger a toast from anywhere
export const showToast = (message) => {
  const event = new CustomEvent('show-toast', { detail: { message } });
  window.dispatchEvent(event);
};

const Toast = () => {
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const handleShowToast = (e) => {
      setToastMessage(e.detail.message);
      // Automatically hide after 3 seconds
      setTimeout(() => {
        setToastMessage(null);
      }, 3000);
    };

    window.addEventListener('show-toast', handleShowToast);
    return () => window.removeEventListener('show-toast', handleShowToast);
  }, []);

  return (
    <div 
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 transform ${
        toastMessage ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-green-500 text-white px-4 py-2 rounded shadow-lg text-sm font-medium flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        {toastMessage}
      </div>
    </div>
  );
};

export default Toast;
