import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { fetchStorefrontData, updateOrderPayment } from '../services/api';
import { Loader2, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { showToast } from '../components/Toast';

export default function Payment() {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const method = searchParams.get('method') || 'bkash';
  const navigate = useNavigate();

  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [screenshot, setScreenshot] = useState(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await fetchStorefrontData();
        setSettings(data.paymentMethods || {});
      } catch (err) {
        showToast("Failed to load payment settings");
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast("Image size should be less than 2MB", "error");
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        setScreenshot(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!transactionId && !screenshot) {
      showToast("Please provide either a Transaction ID or a Screenshot.", "error");
      return;
    }

    setSubmitting(true);
    try {
      await updateOrderPayment(orderId, {
        transactionId,
        paymentScreenshot: screenshot
      });
      showToast("Payment details submitted successfully!");
      navigate('/order-confirmation', { state: { orderId } });
    } catch (error) {
      showToast(error.message || "Failed to submit payment details.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-brand-primary mb-4" />
        <p className="text-gray-500 font-medium">Loading payment details...</p>
      </div>
    );
  }

  const methodSettings = (settings || {})[method] || {};
  const accountNumber = methodSettings.number || "Not Set by Admin";
  const qrCode = methodSettings.qr || null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-brand-primary/10 p-6 text-center border-b border-brand-primary/20">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Payment</h1>
          <p className="text-gray-600">
            Order ID: <span className="font-semibold text-gray-900">{orderId}</span>
          </p>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          
          {/* Instructions */}
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-gray-900 capitalize mb-1">Pay via {method}</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Please send the total order amount to the following {method} number using the <strong>Send Money</strong> option. After sending the money, enter the Transaction ID or upload a screenshot of the payment below.
                </p>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-4">
            <div className="text-center">
              <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-2">{method} Number</p>
              <div className="bg-gray-50 border border-gray-200 rounded-xl py-3 px-6 text-xl font-bold text-brand-primary tracking-wider">
                {accountNumber}
              </div>
            </div>
            
            {qrCode && (
              <>
                <div className="hidden md:block w-px h-24 bg-gray-200"></div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-2">Scan to Pay</p>
                  <div className="bg-white border border-gray-200 rounded-xl p-2 w-32 h-32 mx-auto">
                    <img src={qrCode} alt={`${method} QR Code`} className="w-full h-full object-contain" />
                  </div>
                </div>
              </>
            )}
          </div>

          <hr className="border-gray-100" />

          {/* Submission Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Transaction ID (TrxID)</label>
              <input 
                type="text" 
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="e.g. 7A8B9C0D"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-colors"
              />
              <p className="text-xs text-gray-500 mt-2">Enter the transaction ID you received via SMS after sending money.</p>
            </div>

            <div className="text-center font-bold text-gray-400 uppercase text-xs">OR</div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Payment Screenshot</label>
              
              <label className={`block w-full border-2 border-dashed ${screenshot ? 'border-brand-primary bg-brand-primary/5' : 'border-gray-300 bg-gray-50'} rounded-xl p-6 text-center cursor-pointer hover:bg-gray-100 transition-colors`}>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageUpload}
                />
                
                {screenshot ? (
                  <div className="flex flex-col items-center">
                    <CheckCircle2 className="w-8 h-8 text-green-500 mb-2" />
                    <span className="text-sm font-bold text-green-600 mb-1">Screenshot Uploaded</span>
                    <span className="text-xs text-gray-500">Click to change</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-gray-500">
                    <Upload className="w-8 h-8 mb-2 opacity-50" />
                    <span className="text-sm font-bold mb-1">Click to upload screenshot</span>
                    <span className="text-xs">PNG, JPG up to 2MB</span>
                  </div>
                )}
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting || (!transactionId && !screenshot)}
              className="w-full bg-brand-primary hover:bg-[#ba0036] text-white py-4 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Payment Details"
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
