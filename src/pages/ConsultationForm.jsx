import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, Info, FileText, Upload, ArrowRight, MessageCircle, Send, Loader2, X, Image as ImageIcon, Film, User } from 'lucide-react';
import { createChat, sendMessage, getChat, uploadFile } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ConsultationForm = () => {
  const { petType } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [timeLeft, setTimeLeft] = useState(151); // 2:31 in seconds
  const [ticketNumber, setTicketNumber] = useState('');
  const [chatId, setChatId] = useState(null);
  
  // File upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);

  // Chat state
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const [formData, setFormData] = useState({
    userName: currentUser?.displayName || '',
    petName: '',
    petAge: '1-2 years',
    breed: '',
    gender: 'Male',
    problem: ''
  });

  // Pre-fill user name if they log in after component mounts
  useEffect(() => {
    if (currentUser?.displayName && !formData.userName) {
      setFormData(prev => ({ ...prev, userName: currentUser.displayName }));
    }
  }, [currentUser]);

  // Resume chat if it exists for this category
  useEffect(() => {
    const storageKey = `consultation_chatId_${petType}`;
    const savedChatId = localStorage.getItem(storageKey) || sessionStorage.getItem(storageKey);
    const savedTicket = localStorage.getItem(`${storageKey}_ticket`) || sessionStorage.getItem(`${storageKey}_ticket`);
    
    if (savedChatId) {
      setChatId(savedChatId);
      setTicketNumber(savedTicket || '');
      setCurrentStep(3);
    }
  }, [petType]);

  // Migrate session storage to local storage if user logs in
  useEffect(() => {
    if (currentUser) {
      const storageKey = `consultation_chatId_${petType}`;
      const sessionChatId = sessionStorage.getItem(storageKey);
      const sessionTicket = sessionStorage.getItem(`${storageKey}_ticket`);
      
      if (sessionChatId) {
        localStorage.setItem(storageKey, sessionChatId);
        localStorage.setItem(`${storageKey}_ticket`, sessionTicket || '');
        sessionStorage.removeItem(storageKey);
        sessionStorage.removeItem(`${storageKey}_ticket`);
      }
    }
  }, [currentUser, petType]);

  // Steps
  const steps = [
    { num: 1, label: 'Application Form' },
    { num: 2, label: 'Waiting' },
    { num: 3, label: 'Start Chat' },
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      alert("File size exceeds 20MB limit.");
      return;
    }

    setSelectedFile(file);
    if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setFilePreview({ url, type: file.type.startsWith('image/') ? 'image' : 'video', name: file.name });
    }
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.problem) return;
    
    // Generate Ticket Number
    const generatedTicket = `PZ-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    setTicketNumber(generatedTicket);
    
    // Move to Waiting Step
    setCurrentStep(2);

    try {
      // Create Chat session
      const chat = await createChat({ 
        fullName: formData.userName ? `Consultation (${formData.userName})` : 'Consultation User', 
        phone: generatedTicket 
      });
      setChatId(chat._id);

      // Save to storage
      const storageKey = `consultation_chatId_${petType}`;
      if (currentUser) {
        localStorage.setItem(storageKey, chat._id);
        localStorage.setItem(`${storageKey}_ticket`, generatedTicket);
      } else {
        sessionStorage.setItem(storageKey, chat._id);
        sessionStorage.setItem(`${storageKey}_ticket`, generatedTicket);
      }

      // Send initial form data message
      const initialMessage = `🎫 Ticket Number: ${generatedTicket}\n🐾 Category: Consultation for ${petType}\n\n👤 User Name: ${formData.userName || 'N/A'}\n\n📋 Pet Information:\n- Name: ${formData.petName || 'N/A'}\n- Age: ${formData.petAge}\n- Breed: ${formData.breed || 'N/A'}\n- Gender: ${formData.gender}\n\n⚠️ Problem Description:\n${formData.problem}`;
      
      await sendMessage(chat._id, 'user', initialMessage);

      // Upload file if selected
      if (selectedFile) {
        const fileType = selectedFile.type.startsWith('image/') ? 'image' : selectedFile.type.startsWith('video/') ? 'video' : 'document';
        await uploadFile(chat._id, 'user', selectedFile, fileType);
      }
      
    } catch (error) {
      console.error('Failed to create consultation chat:', error);
    }
  };

  // Timer for Waiting Step
  useEffect(() => {
    if (currentStep === 2) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentStep]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStartChat = () => {
    setCurrentStep(3);
  };

  // Poll for new messages when in step 3
  useEffect(() => {
    let interval;
    if (currentStep === 3 && chatId) {
      const fetchChat = async () => {
        try {
          const chat = await getChat(chatId, 'user');
          setMessages(chat.messages || []);
        } catch (error) {
          console.error("Failed to poll chat:", error);
        }
      };
      fetchChat(); // Initial fetch
      interval = setInterval(fetchChat, 3000); // Poll every 3 seconds
    }
    return () => clearInterval(interval);
  }, [currentStep, chatId]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !chatId) return;
    
    const tempText = inputText;
    setInputText('');
    
    const newMsg = { _id: Date.now().toString(), sender: 'user', text: tempText, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, newMsg]);
    
    try {
      setIsSending(true);
      const chat = await sendMessage(chatId, 'user', tempText);
      setMessages(chat.messages);
    } catch (error) {
      console.error("Failed to send message", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-[#FBF9F6] py-10 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Stepper */}
        <div className="flex items-center justify-center mb-10 max-w-2xl mx-auto relative">
          {/* Connecting line (Background) */}
          <div className="absolute left-[10%] right-[10%] top-1/2 -translate-y-1/2 h-[2px] bg-gray-200 z-0 hidden sm:block" />
          
          {/* Connecting line (Active) */}
          <div className="absolute left-[10%] right-[10%] top-1/2 -translate-y-1/2 h-[2px] z-0 hidden sm:block">
             <div 
               className="h-full bg-green-500 transition-all duration-500 ease-in-out"
               style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' }}
             />
          </div>

          <div className="w-full flex justify-between relative z-10">
            {steps.map((step, idx) => {
              const isActive = currentStep === step.num;
              const isCompleted = currentStep > step.num;
              
              let circleClass = 'bg-white border-gray-300 text-gray-400'; // Upcoming
              if (isActive) circleClass = 'bg-blue-600 border-blue-600 text-white'; // Active
              if (isCompleted) circleClass = 'bg-green-500 border-green-500 text-white'; // Completed

              return (
                <div key={step.num} className="flex flex-col items-center bg-[#FBF9F6] px-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-300 ${circleClass}`}>
                    {isCompleted ? <Check size={16} strokeWidth={3} /> : step.num}
                  </div>
                  <span className={`mt-2 text-sm font-semibold ${isActive || isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex justify-center">
          
          {/* Step 1: Application Form */}
          {currentStep === 1 && (
            <div className="w-full max-w-3xl animate-fade-in space-y-6">
              
              <form onSubmit={handleSubmit}>
                {/* User Information Card */}
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 mb-6">
                  <div className="flex items-center gap-2 mb-6 text-gray-800">
                    <User size={20} />
                    <h2 className="text-xl font-bold">Your Information</h2>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Your Name (Optional)</label>
                    <input 
                      type="text" 
                      name="userName"
                      value={formData.userName}
                      onChange={handleInputChange}
                      placeholder="e.g. Mahin"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-mid focus:ring-1 focus:ring-brand-mid outline-none transition-all text-gray-800"
                    />
                  </div>
                </div>

                {/* Pet Information Card */}
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 mb-6">
                  <div className="flex items-center gap-2 mb-6 text-gray-800">
                    <Info size={20} />
                    <h2 className="text-xl font-bold">Pet Information</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-600 mb-2">Name (Optional)</label>
                      <input 
                        type="text" 
                        name="petName"
                        value={formData.petName}
                        onChange={handleInputChange}
                        placeholder="e.g. Tommy"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-mid focus:ring-1 focus:ring-brand-mid outline-none transition-all text-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-600 mb-2">Age</label>
                      <div className="relative">
                        <select 
                          name="petAge"
                          value={formData.petAge}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-mid focus:ring-1 focus:ring-brand-mid outline-none transition-all text-gray-800 appearance-none bg-white"
                        >
                          <option value="< 1 year">Less than 1 year</option>
                          <option value="1-2 years">1-2 years</option>
                          <option value="3-5 years">3-5 years</option>
                          <option value="5+ years">5+ years</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-600 mb-2">Breed</label>
                      <input 
                        type="text" 
                        name="breed"
                        value={formData.breed}
                        onChange={handleInputChange}
                        placeholder="e.g. Labrador"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-mid focus:ring-1 focus:ring-brand-mid outline-none transition-all text-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-600 mb-2">Gender</label>
                      <div className="relative">
                        <select 
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-mid focus:ring-1 focus:ring-brand-mid outline-none transition-all text-gray-800 appearance-none bg-white"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Problem Description Card */}
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 mb-6">
                  <div className="flex items-center gap-2 mb-6 text-gray-800">
                    <FileText size={20} />
                    <h2 className="text-xl font-bold">Problem Description</h2>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-600 mb-2">What is the problem?</label>
                    <textarea 
                      name="problem"
                      required
                      value={formData.problem}
                      onChange={handleInputChange}
                      placeholder="e.g. Hasn't eaten for the past 2 days, looks weak..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-mid focus:ring-1 focus:ring-brand-mid outline-none transition-all resize-none text-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Upload Photo / Video</label>
                    <div 
                      onClick={() => !selectedFile && fileInputRef.current?.click()}
                      className={`w-full border-2 ${selectedFile ? 'border-brand-mid bg-brand-mid/5' : 'border-dashed border-gray-200 hover:bg-gray-50 cursor-pointer'} rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors group relative`}
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/jpeg, image/png, video/mp4" 
                        onChange={handleFileSelect}
                      />
                      
                      {selectedFile ? (
                        <div className="flex items-center gap-4 w-full">
                          <div className="w-16 h-16 rounded-lg bg-white shadow-sm border border-brand-mid/20 flex items-center justify-center shrink-0 overflow-hidden relative">
                            {filePreview?.type === 'image' ? (
                              <img src={filePreview.url} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                              <Film className="text-brand-mid" size={24} />
                            )}
                          </div>
                          <div className="flex-1 text-left truncate">
                            <p className="font-bold text-gray-800 text-sm truncate">{selectedFile.name}</p>
                            <p className="text-xs text-brand-mid font-medium mt-1">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready</p>
                          </div>
                          <button 
                            type="button" 
                            onClick={handleRemoveFile}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors shrink-0"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload size={28} className="text-gray-400 group-hover:text-brand-mid transition-colors mb-3" />
                          <p className="text-gray-500 font-medium mb-1">Select photo or video</p>
                          <p className="text-xs text-gray-400">JPG, PNG, MP4 • Max 20MB</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button 
                    type="submit"
                    className="bg-brand-mid hover:bg-brand-dark text-white px-8 py-3.5 rounded-xl font-bold text-base transition-all shadow-md hover:shadow-lg"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 2: Waiting */}
          {currentStep === 2 && (
            <div className="w-full max-w-2xl animate-fade-in flex flex-col items-center">
              
              {/* Success Top Box */}
              <div className="w-full bg-[#E5F0FF] rounded-2xl p-8 md:p-10 flex flex-col items-center text-center mb-6">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mb-5 shadow-sm">
                  <Check size={32} strokeWidth={2.5} />
                </div>
                
                <h2 className="text-2xl font-bold text-blue-900 mb-4">
                  Application submitted successfully
                </h2>
                
                <p className="text-blue-800 text-sm font-medium mb-3">Your ticket number</p>
                
                <div className="bg-white text-gray-800 px-6 py-2 rounded-lg shadow-sm border border-white font-mono font-bold tracking-wide flex items-center gap-2 mb-8">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                  {ticketNumber || 'PZ-2024-00847'}
                </div>

                <p className="text-blue-900 font-medium">
                  The doctor will contact you shortly
                </p>
              </div>

              {/* Waiting Status Bottom Box */}
              <div className="w-full bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center">
                
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full animate-pulse" />
                  <span className="text-gray-600 font-bold">Waiting for doctor's connection...</span>
                </div>

                <div className="grid grid-cols-2 gap-12 mb-10 w-full max-w-sm">
                  <div className="flex flex-col items-center">
                    <span className="text-4xl font-extrabold text-gray-900 mb-1">{formatTime(timeLeft)}</span>
                    <span className="text-gray-500 text-sm font-medium">Estimated wait</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <span className="text-4xl font-extrabold text-gray-900 mb-1">3</span>
                    <span className="text-gray-500 text-sm font-medium">In line</span>
                  </div>
                </div>

                <button 
                  onClick={handleStartChat}
                  className="bg-white border border-gray-200 hover:border-gray-300 text-gray-800 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:shadow-sm flex items-center gap-2"
                >
                  Go to chat room <ArrowRight size={16} />
                </button>

              </div>
            </div>
          )}

          {/* Step 3: Start Chat */}
          {currentStep === 3 && (
            <div className="w-full max-w-2xl mx-auto animate-fade-in flex flex-col h-[600px] max-h-[70vh] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              
              {/* Chat Header */}
              <div className="bg-brand-mid text-white p-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold">Veterinary Consultation</h3>
                    <p className="text-xs text-white/80">Ticket: {ticketNumber}</p>
                  </div>
                </div>
              </div>

              {/* Guest Warning */}
              {!currentUser && (
                <div className="bg-orange-50 border-b border-orange-100 text-orange-700 px-4 py-2 text-xs flex items-center justify-between shrink-0">
                  <span><strong>Warning:</strong> You are not logged in. This chat will be lost if you close your browser.</span>
                  <button onClick={() => navigate('/login')} className="font-bold underline ml-2 whitespace-nowrap text-orange-800 hover:text-orange-900">
                    Log In
                  </button>
                </div>
              )}

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <Loader2 size={32} className="animate-spin mb-2" />
                    <p>Loading conversation...</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isUser = msg.sender === 'user';
                    return (
                      <div key={msg._id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl p-3 ${
                          isUser ? 'bg-brand-mid text-white rounded-br-none' : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none shadow-sm'
                        }`}>
                          <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
                          <span className={`text-[10px] mt-1 block text-right ${isUser ? 'text-white/70' : 'text-gray-400'}`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex items-center gap-2">
                <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-brand-mid/50 rounded-xl outline-none transition-all text-sm"
                  disabled={isSending}
                />
                <button 
                  type="submit"
                  disabled={!inputText.trim() || isSending}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                    inputText.trim() && !isSending ? 'bg-brand-mid text-white shadow-md' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {isSending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ConsultationForm;
