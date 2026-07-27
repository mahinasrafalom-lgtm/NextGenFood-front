import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { MessageCircle, X, ArrowLeft, MoreVertical, Paperclip, Smile, Mic, Send, Image as ImageIcon, Loader2, FileText, Volume2, Play, Pause } from 'lucide-react';
import { createChat, getChat, sendMessage, uploadFile } from '../services/api';

const API_BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5005';

const CustomAudioPlayer = ({ src, sender }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio(src);
    audioRef.current = audio;

    const setAudioData = () => {
      setDuration(audio.duration);
    };

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, [src]);

  const togglePlayPause = () => {
    const prevValue = isPlaying;
    setIsPlaying(!prevValue);
    if (!prevValue) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  const formatTime = (time) => {
    if (isNaN(time) || !isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Static waveform bars based on the image
  const bars = [14, 20, 16, 26, 20, 32, 22, 14, 18, 30, 24, 18, 22, 28, 20, 16, 24, 20, 32, 26, 18, 24, 18, 14];

  const isUser = sender === 'user';
  const containerClass = isUser ? 'bg-transparent text-white' : 'bg-transparent text-gray-800';
  const btnBg = isUser ? 'bg-white/20 hover:bg-white/30' : 'bg-gray-200 hover:bg-gray-300';
  const iconColor = isUser ? 'text-white' : 'text-brand-mid';
  const barColor = isUser ? 'bg-white/40' : 'bg-gray-300';
  const barActiveColor = isUser ? 'bg-white' : 'bg-brand-mid';

  const progressPercentage = duration ? (currentTime / duration) : 0;

  return (
    <div className={`flex items-center gap-3 min-w-[200px] sm:w-[240px] mb-1 ${containerClass}`}>
      <button 
        onClick={togglePlayPause}
        className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-colors ${btnBg}`}
      >
        {isPlaying ? <Pause size={20} className={iconColor} fill="currentColor" /> : <Play size={20} className={`ml-1 ${iconColor}`} fill="currentColor" />}
      </button>

      <div className="flex-1 flex items-center gap-[2.5px] h-8 relative">
        {bars.map((height, i) => {
          const isActive = (i / bars.length) <= progressPercentage;
          return (
            <div 
              key={i} 
              className={`w-[3px] rounded-full transition-colors duration-200 ${isActive ? barActiveColor : barColor}`}
              style={{ height: `${height}px` }}
            />
          );
        })}
      </div>

      <div className="text-[12px] font-bold min-w-[36px] text-right pr-1">
        {formatTime(currentTime > 0 ? currentTime : duration)}
      </div>
    </div>
  );
};

const ChatWidget = () => {
  // 0 = closed, 1 = welcome, 2 = lead form, 3 = active chat
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ fullName: '', phone: '' });
  const [chatId, setChatId] = useState(localStorage.getItem('nextPetFood_chatId') || null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isStarting, setIsStarting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);
  const [chatSoundEnabled, setChatSoundEnabled] = useState(localStorage.getItem('nextPetFood_chatSound') !== 'false');
  const [isAttachmentOpen, setIsAttachmentOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [stagedFiles, setStagedFiles] = useState([]);
  const [isStagingExpanded, setIsStagingExpanded] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(null);

  const imageInputRef = useRef(null);
  const docInputRef = useRef(null);
  const allInputRef = useRef(null);

  const audioChunksRef = useRef([]);
  const audioContextRef = useRef(null);

  // Recording Timer
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Listen for external open events
  useEffect(() => {
    const handleOpenChat = () => {
      if (chatId) {
        setStep(3);
      } else {
        setStep(1);
      }
    };
    window.addEventListener('openChatWidget', handleOpenChat);
    return () => window.removeEventListener('openChatWidget', handleOpenChat);
  }, [chatId]);

  const formatRecordingTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleToggleSound = () => {
    const newState = !chatSoundEnabled;
    setChatSoundEnabled(newState);
    localStorage.setItem('nextPetFood_chatSound', newState);
  };

  const playNotificationSound = () => {
    if (!chatSoundEnabled) return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      const ctx = audioContextRef.current;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch(e) {
      console.error("Audio error", e);
    }
  };

  useEffect(() => {
    let interval;
    if (step === 3 && chatId) {
      const fetchChat = async () => {
        try {
          const chat = await getChat(chatId, 'user');
          setMessages(prev => {
            const serverMsgs = chat.messages || [];
            // Check if there are new admin messages
            const newAdminMsgs = serverMsgs.filter(m => m.sender === 'admin' && !prev.some(pm => pm._id === m._id));
            if (newAdminMsgs.length > 0) {
              playNotificationSound();
            }
            return serverMsgs;
          });
          if (chat.user) {
            setFormData(chat.user);
          }
        } catch (error) {
          console.error("Failed to poll chat:", error);
        }
      };
      fetchChat();
      interval = setInterval(fetchChat, 3000);
    }
    return () => clearInterval(interval);
  }, [step, chatId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleOpenWidget = () => {
    if (chatId) {
      setStep(3); // Resume chat
    } else {
      setStep(1); // Welcome screen
    }
  };

  const handleStartChat = async (e) => {
    e.preventDefault();
    if (formData.fullName.trim() && formData.phone.trim()) {
      setIsStarting(true);
      try {
        const chat = await createChat(formData);
        setChatId(chat._id);
        localStorage.setItem('nextPetFood_chatId', chat._id);
        setMessages(chat.messages || []);
        setStep(3);
      } catch (error) {
        console.error("Error creating chat", error);
        alert(`Failed to start chat: ${error.message}`);
      } finally {
        setIsStarting(false);
      }
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() && stagedFiles.length === 0) return;
    if (!chatId) return;
    
    const tempText = inputText;
    const filesToUpload = [...stagedFiles];
    
    setInputText('');
    setStagedFiles([]);
    
    if (filesToUpload.length > 0) {
      setIsSending(true);
      
      let currentMessages = [...messages];
      
      // Send text first if exists
      if (tempText.trim()) {
        const txtMsg = { _id: Date.now().toString() + 'txt', sender: 'user', text: tempText, timestamp: new Date().toISOString() };
        currentMessages.push(txtMsg);
        setMessages([...currentMessages]);
        try {
          const chat = await sendMessage(chatId, 'user', tempText);
          currentMessages = chat.messages;
          setMessages(currentMessages);
        } catch (error) {
          console.error("Failed to send text", error);
        }
      }
      
      // Send files sequentially
      for (let i = 0; i < filesToUpload.length; i++) {
        const fileToUpload = filesToUpload[i];
        const newMsg = { 
          _id: Date.now().toString() + i, 
          sender: 'user', 
          text: '', 
          type: fileToUpload.type, 
          fileUrl: fileToUpload.previewUrl, 
          timestamp: new Date().toISOString() 
        };
        currentMessages.push(newMsg);
        setMessages([...currentMessages]);
        
        try {
          const chat = await uploadFile(chatId, 'user', fileToUpload.file, fileToUpload.type, '');
          currentMessages = chat.messages;
          setMessages(currentMessages);
        } catch (error) {
          console.error("Failed to upload file", error);
        }
      }
      
      setIsSending(false);
    } else {
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
    }
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    setIsAttachmentOpen(false);
    
    const newStaged = [];
    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} exceeds 10MB limit.`);
        continue;
      }
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const type = isImage ? 'image' : isVideo ? 'video' : 'document';
      const tempUrl = URL.createObjectURL(file);
      newStaged.push({
        file, type, previewUrl: tempUrl, name: file.name, size: formatFileSize(file.size)
      });
    }
    
    setStagedFiles(prev => [...prev, ...newStaged]);
    setIsStagingExpanded(true);
    e.target.value = '';
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const file = new File([audioBlob], `voice-note-${Date.now()}.webm`, { type: 'audio/webm' });
        
        const tempUrl = URL.createObjectURL(file);
        
        setStagedFiles(prev => [...prev, {
          file,
          type: 'audio',
          previewUrl: tempUrl,
          name: file.name,
          size: formatFileSize(file.size)
        }]);
        setIsStagingExpanded(true);
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone", error);
      alert("Microphone access denied. Please allow microphone permissions.");
    }
  };

  const stopRecording = (send) => {
    if (mediaRecorderRef.current && isRecording) {
      if (!send) {
        mediaRecorderRef.current.onstop = () => {
          mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        };
      }
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleClose = () => {
    setStep(0);
  };

  return (
    <div className="fixed bottom-0 right-0 md:bottom-6 md:right-6 z-[90] font-sans flex flex-col items-end pointer-events-none">
      
      {step === 0 && (
        <button 
          onClick={handleOpenWidget}
          className="pointer-events-auto w-14 h-14 bg-brand-mid rounded-[28px] rounded-br-[10px] flex items-center justify-center text-white shadow-[0_4px_20px_rgba(197,160,89,0.4)] hover:bg-brand-mid hover:scale-105 active:scale-95 transition-all duration-300 mr-4 mb-[85px] md:mr-0 md:mb-0"
          aria-label="Open chat"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.03 2 11c0 2.85 1.49 5.35 3.82 7l-1.32 3.14c-.16.38.25.72.61.55l3.8-1.74a10.9 10.9 0 0 0 3.09.45c5.52 0 10-4.03 10-9s-4.48-9-10-9z"/>
            <rect x="7.5" y="9" width="9" height="2.2" rx="1" fill="#C5A059" className="group-hover:fill-orange-600" />
            <rect x="7.5" y="13.5" width="9" height="2.2" rx="1" fill="#C5A059" className="group-hover:fill-orange-600" />
          </svg>
        </button>
      )}

      {/* Chat Modal Container */}
      {step > 0 && (
        <div className="pointer-events-auto w-screen h-screen sm:w-full sm:h-full md:w-[350px] md:h-[600px] md:max-h-[calc(100vh-120px)] bg-white md:rounded-2xl shadow-2xl overflow-hidden flex flex-col border-0 md:border border-gray-100 transform origin-bottom-right transition-all duration-300">
          
          {/* ================= STEP 1: WELCOME ================= */}
          {step === 1 && (
            <div className="flex-1 bg-gradient-to-br from-brand-mid via-[#e85d00] to-[#c44500] text-white flex flex-col relative h-full overflow-hidden">
              
              {/* Animated Background Orbs */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div 
                  className="absolute w-[200px] h-[200px] rounded-full bg-white/[0.06] blur-2xl"
                  style={{ top: '10%', left: '-15%', animation: 'float-orb 8s ease-in-out infinite' }}
                />
                <div 
                  className="absolute w-[250px] h-[250px] rounded-full bg-brand-mid/[0.08] blur-3xl"
                  style={{ bottom: '20%', right: '-20%', animation: 'float-orb-reverse 10s ease-in-out infinite' }}
                />
                <div 
                  className="absolute w-[150px] h-[150px] rounded-full bg-red-400/[0.06] blur-2xl"
                  style={{ top: '50%', left: '60%', animation: 'float-orb 12s ease-in-out infinite 2s' }}
                />
              </div>

              {/* Header area */}
              <div className="flex items-start justify-between p-6 relative z-10" style={{ animation: 'fade-up 0.5s ease-out' }}>
                <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shrink-0 border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
                  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9">
                    <ellipse cx="28" cy="22" rx="10" ry="13" fill="white" />
                    <ellipse cx="72" cy="22" rx="10" ry="13" fill="white" />
                    <circle cx="12" cy="45" r="10" fill="white" />
                    <circle cx="88" cy="45" r="10" fill="white" />
                    <path d="M50 92 C15 65 22 38 50 52 C78 38 85 65 50 92Z" fill="white" />
                  </svg>
                </div>
                <button 
                  onClick={handleClose}
                  className="w-9 h-9 bg-white/10 backdrop-blur-xl hover:bg-white/25 rounded-xl flex items-center justify-center transition-all duration-300 border border-white/20"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Main Greeting Area */}
              <div className="flex-1 flex flex-col justify-center px-8 pb-12 relative z-10">
                {/* Glassmorphism greeting card */}
                <div 
                  className="bg-white/[0.08] backdrop-blur-md rounded-3xl p-7 border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
                  style={{ animation: 'fade-up 0.6s ease-out 0.15s both' }}
                >
                  <h2 
                    className="text-[26px] md:text-[22px] leading-tight font-bold mb-4 font-bengali"
                    style={{ animation: 'text-glow 3s ease-in-out infinite' }}
                  >
                    আসসালামু আলাইকুম,<br />
                    NexGen Veterinary-এ স্বাগতম।
                  </h2>
                  
                  {/* Shimmer Divider */}
                  <div className="h-[1px] bg-white/20 mb-4 relative overflow-hidden">
                    <div 
                      className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                      style={{ animation: 'shimmer-line 3s ease-in-out infinite' }}
                    />
                  </div>
                  
                  <p className="text-white/80 text-[16px] md:text-[14px] font-medium font-bengali">
                    আপনাকে কীভাবে সহযোগিতা করতে পারি?
                  </p>
                </div>
              </div>

              {/* Bottom Card Button */}
              <div className="px-5 pb-5 mt-auto relative z-10" style={{ animation: 'fade-up 0.7s ease-out 0.3s both' }}>
                <button 
                  onClick={() => setStep(2)}
                  className="w-full bg-white/95 backdrop-blur-sm rounded-2xl p-5 flex items-center gap-4 text-left shadow-[0_8px_30px_rgba(0,0,0,0.15)] hover:bg-white hover:scale-[1.02] hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)] active:scale-[0.98] transition-all duration-300"
                >
                  {/* Icon with pulse ring */}
                  <div className="relative shrink-0">
                    <div 
                      className="absolute inset-0 rounded-full bg-brand-mid/40"
                      style={{ animation: 'pulse-ring 2s ease-out infinite' }}
                    />
                    <div className="relative w-[42px] h-[42px] rounded-full bg-gradient-to-br from-[#ff8c2a] to-[#e06500] flex items-center justify-center shadow-[0_4px_15px_rgba(197,160,89,0.4)]">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-white">
                        <path d="M12 2C6.48 2 2 6.03 2 11c0 2.85 1.49 5.35 3.82 7l-1.32 3.14c-.16.38.25.72.61.55l3.8-1.74a10.9 10.9 0 0 0 3.09.45c5.52 0 10-4.03 10-9s-4.48-9-10-9z"/>
                        <rect x="7.5" y="9" width="9" height="2" rx="1" fill="white" />
                        <rect x="7.5" y="13" width="9" height="2" rx="1" fill="white" />
                      </svg>
                    </div>
                  </div>
                  <div className="font-sans">
                    <h4 className="text-gray-900 font-bold text-[15px] mb-0.5 font-bengali">মেসেজ করুন।</h4>
                    <p className="text-gray-400 text-[11px] font-medium tracking-wide">Typically replies in 1 minutes</p>
                  </div>
                </button>
              </div>
              
              <div className="text-center text-white/50 text-[10px] pb-3 font-sans font-medium tracking-widest uppercase">
                Powered by NexGen Veterinary
              </div>
            </div>
          )}

          {/* ================= STEP 2: LEAD FORM ================= */}
          {step === 2 && (
            <div className="flex flex-col h-full overflow-hidden">
              {/* Orange Header with centered logo */}
              <div className="bg-gradient-to-br from-brand-mid via-[#e85d00] to-[#c44500] text-white relative overflow-hidden flex-shrink-0">
                {/* Floating orbs */}
                <div 
                  className="absolute w-[160px] h-[160px] rounded-full bg-white/[0.06] blur-2xl pointer-events-none"
                  style={{ top: '-20%', right: '5%', animation: 'float-orb 7s ease-in-out infinite' }}
                />
                <div 
                  className="absolute w-[120px] h-[120px] rounded-full bg-brand-mid/[0.06] blur-2xl pointer-events-none"
                  style={{ bottom: '-10%', left: '10%', animation: 'float-orb-reverse 9s ease-in-out infinite' }}
                />

                {/* Top row: back & close */}
                <div className="flex items-center justify-between px-4 pt-10 md:pt-4 pb-2 relative z-10">
                  <button 
                    onClick={() => setStep(1)} 
                    className="p-2 hover:bg-white/15 rounded-xl transition-all duration-300 border border-transparent hover:border-white/20"
                  >
                    <ArrowLeft size={22} />
                  </button>
                  <button 
                    onClick={handleClose} 
                    className="p-2 hover:bg-white/15 rounded-xl transition-all duration-300 border border-transparent hover:border-white/20"
                  >
                    <X size={22} />
                  </button>
                </div>

                {/* Centered logo + name */}
                <div className="flex flex-col items-center pb-6 relative z-10" style={{ animation: 'fade-up 0.4s ease-out' }}>
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.1)] mb-3">
                    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
                      <ellipse cx="28" cy="22" rx="10" ry="13" fill="white" />
                      <ellipse cx="72" cy="22" rx="10" ry="13" fill="white" />
                      <circle cx="12" cy="45" r="10" fill="white" />
                      <circle cx="88" cy="45" r="10" fill="white" />
                      <path d="M50 92 C15 65 22 38 50 52 C78 38 85 65 50 92Z" fill="white" />
                    </svg>
                  </div>
                  <h3 
                    className="font-bold text-lg tracking-wide"
                    style={{ animation: 'text-glow 3s ease-in-out infinite' }}
                  >NexGen Veterinary</h3>
                  <p className="text-white/70 text-[12px] tracking-wider mt-0.5">Typically replies in 1 minutes</p>
                </div>
              </div>
              
              {/* Body: gray bg with white card */}
              <div className="flex-1 bg-gray-100 overflow-y-auto flex flex-col">
                <div className="px-5 pt-6 pb-6 flex-1">
                  {/* White form card */}
                  <div 
                    className="bg-white rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100"
                    style={{ animation: 'fade-up 0.5s ease-out 0.15s both' }}
                  >
                    {/* Bengali instruction text */}
                    <p className="text-center text-gray-700 text-[15px] font-medium font-bengali mb-6 leading-relaxed">
                      কাস্টমার কেয়ার প্রতিনিধির সাথে কথা বলতে নিচের তথ্য গুলো শেয়ার করুন।
                    </p>

                    <form onSubmit={handleStartChat} className="space-y-5">
                      {/* Full Name */}
                      <div style={{ animation: 'fade-up 0.5s ease-out 0.25s both' }}>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative group">
                          <input 
                            type="text" 
                            required
                            value={formData.fullName}
                            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                            className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-[15px] focus:outline-none focus:border-brand-mid focus:shadow-[0_0_0_3px_rgba(197,160,89,0.1)] transition-all duration-300 placeholder:text-gray-300"
                            placeholder="Enter your name"
                          />
                          <div className="absolute bottom-0 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-brand-mid to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                        </div>
                      </div>

                      {/* Phone Number */}
                      <div style={{ animation: 'fade-up 0.5s ease-out 0.35s both' }}>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative group">
                          <div className="flex rounded-xl overflow-hidden border border-gray-200 focus-within:border-brand-mid focus-within:shadow-[0_0_0_3px_rgba(197,160,89,0.1)] transition-all duration-300 bg-white">
                            <select className="bg-transparent border-none outline-none py-3.5 pl-3 pr-1 text-[15px] text-gray-700 font-semibold">
                              <option>+880</option>
                              <option>+1</option>
                              <option>+44</option>
                              <option>+91</option>
                            </select>
                            <div className="w-[1px] bg-gray-200 my-2.5" />
                            <input 
                              type="tel"
                              required
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                              className="flex-1 px-3 py-3.5 bg-transparent text-[15px] outline-none placeholder:text-gray-300"
                              placeholder="Your phone number here"
                            />
                          </div>
                          <div className="absolute bottom-0 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-brand-mid to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                        </div>
                      </div>

                      {/* Start Chat Button */}
                      <div style={{ animation: 'fade-up 0.5s ease-out 0.45s both' }}>
                        <button 
                          type="submit"
                          disabled={isStarting}
                          className={`w-full py-3.5 bg-white border-2 border-brand-mid text-brand-mid font-bold rounded-xl hover:bg-gradient-to-r hover:from-brand-mid hover:to-brand-dark hover:text-white hover:border-transparent hover:shadow-[0_8px_25px_rgba(197,160,89,0.25)] transition-all duration-300 active:scale-[0.97] relative overflow-hidden group ${isStarting ? 'opacity-70 pointer-events-none' : ''}`}
                        >
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden">
                            <div 
                              className="absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                              style={{ animation: 'shimmer-line 2s ease-in-out infinite' }}
                            />
                          </div>
                          <span className="relative z-10 tracking-wide flex items-center justify-center gap-2">
                            {isStarting ? <Loader2 size={18} className="animate-spin" /> : 'Start Chat'}
                          </span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Powered by footer */}
                <div className="text-center text-gray-400 text-[10px] pb-4 font-sans font-medium tracking-widest uppercase">
                  Powered by NexGen Veterinary
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 3: ACTIVE CHAT ================= */}
          {step === 3 && (
            <>
              {/* Header */}
              <div className="bg-red-600 p-4 text-white flex items-center justify-between pt-10 md:pt-4">
                <button onClick={() => setStep(2)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                  <ArrowLeft size={22} className="md:w-5 md:h-5" />
                </button>
                <div className="text-center flex-1">
                  <h3 className="font-bold text-base md:text-sm">NexGen Veterinary</h3>
                  <p className="text-white/80 text-[11px] md:text-[10px]">Active</p>
                </div>
                <div className="flex items-center gap-1 relative">
                  <button 
                    onClick={() => setIsHeaderMenuOpen(!isHeaderMenuOpen)} 
                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <MoreVertical size={20} className="md:w-[18px] md:h-[18px]" />
                  </button>
                  
                  {/* Header Dropdown */}
                  {isHeaderMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsHeaderMenuOpen(false)}></div>
                      <div className="absolute top-10 right-8 w-44 bg-white rounded-xl shadow-lg border border-gray-100 z-20 py-2">
                        <div className="px-4 py-2 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Volume2 size={16} />
                            <span className="text-sm font-medium">Chat Sound</span>
                          </div>
                          <button 
                            onClick={handleToggleSound}
                            className={`w-9 h-5 rounded-full relative transition-colors duration-200 ${chatSoundEnabled ? 'bg-blue-600' : 'bg-gray-200'}`}
                          >
                            <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-sm transition-transform duration-200 ${chatSoundEnabled ? 'left-[18px]' : 'left-0.5'}`}></div>
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  <button onClick={handleClose} className="p-1 hover:bg-white/20 rounded-full transition-colors z-20">
                    <X size={22} className="md:w-5 md:h-5" />
                  </button>
                </div>
              </div>
              
              {/* Chat Canvas */}
              <div className="flex-1 bg-gray-50 p-4 overflow-y-auto flex flex-col gap-4">
                <div className="text-center text-xs text-gray-400 my-2">Today</div>
                
                {/* Information Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm mx-auto w-[90%] max-w-[300px]">
                  <h5 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2 mb-2">Information provided</h5>
                  <div className="space-y-1.5 text-[13px]">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Name:</span>
                      <span className="font-medium text-gray-800">{formData.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Phone:</span>
                      <span className="font-medium text-gray-800">+880 {formData.phone}</span>
                    </div>
                  </div>
                </div>
                
                {messages.length === 0 && (
                  <div className="flex justify-start mb-2 mt-2">
                    <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] shadow-sm">
                      <div className="flex items-center space-x-1.5 mb-1.5">
                        <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[10px] font-bold">
                          A
                        </div>
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Support Admin</span>
                      </div>
                      <p className="text-[14px] md:text-[13px] text-gray-800">Hello {formData.fullName}! How can we assist you today?</p>
                    </div>
                  </div>
                )}

                {/* Render Messages */}
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex mb-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`rounded-2xl px-4 py-3 max-w-[85%] shadow-sm ${msg.sender === 'user' ? 'bg-brand-mid text-white rounded-tr-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm'}`}>
                      {msg.sender === 'admin' && (
                        <div className="flex items-center space-x-1.5 mb-1.5">
                          <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[10px] font-bold">
                            A
                          </div>
                          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Support Admin</span>
                        </div>
                      )}
                      <div className={`text-[14px] md:text-[13px] ${msg.sender === 'user' ? 'text-white' : 'text-gray-800'}`}>
                        {msg.type === 'image' && msg.fileUrl ? (
                          <img src={msg.fileUrl.startsWith('blob:') ? msg.fileUrl : `${API_BASE_URL}${msg.fileUrl}`} alt="uploaded" className="max-w-[200px] max-h-[200px] rounded-lg mb-1 cursor-pointer object-cover" onClick={() => setSelectedMedia({ url: msg.fileUrl.startsWith('blob:') ? msg.fileUrl : `${API_BASE_URL}${msg.fileUrl}`, type: 'image' })} />
                        ) : msg.type === 'video' && msg.fileUrl ? (
                          <div className="relative max-w-[200px] max-h-[200px] rounded-lg mb-1 cursor-pointer overflow-hidden group" onClick={() => setSelectedMedia({ url: msg.fileUrl.startsWith('blob:') ? msg.fileUrl : `${API_BASE_URL}${msg.fileUrl}`, type: 'video' })}>
                            <video src={msg.fileUrl.startsWith('blob:') ? msg.fileUrl : `${API_BASE_URL}${msg.fileUrl}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 flex items-center justify-center transition-colors">
                              <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-gray-800 shadow-md">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                              </div>
                            </div>
                          </div>
                        ) : msg.type === 'audio' && msg.fileUrl ? (
                          <CustomAudioPlayer src={msg.fileUrl.startsWith('blob:') ? msg.fileUrl : `${API_BASE_URL}${msg.fileUrl}`} sender={msg.sender} />
                        ) : msg.type === 'document' && msg.fileUrl ? (
                          <div onClick={() => setSelectedMedia({ url: msg.fileUrl.startsWith('blob:') ? msg.fileUrl : `${API_BASE_URL}${msg.fileUrl}`, type: 'document' })} className="flex items-center gap-2 bg-black/5 p-2 rounded-lg hover:bg-black/10 transition-colors mb-1 max-w-[220px] cursor-pointer">
                            <FileText size={20} className={msg.sender === 'user' ? 'text-white' : 'text-gray-500'} />
                            <span className="text-[13px] truncate font-medium">{msg.fileUrl.split('-').pop()}</span>
                          </div>
                        ) : null}
                        {msg.text && (
                          <div className={msg.type !== 'text' ? 'mt-1' : ''}>{msg.text}</div>
                        )}
                      </div>
                      <span className={`text-[10px] block mt-1 ${msg.sender === 'user' ? 'text-white/70 text-right' : 'text-gray-400 text-left'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Chat Footer */}
              <div className="bg-white border-t border-gray-200 p-3 pb-8 md:pb-3 relative">
                <input 
                  type="file" 
                  multiple
                  accept="image/png, image/jpeg, image/gif, image/jpg"
                  className="hidden" 
                  ref={imageInputRef}
                  onChange={handleFileChange}
                />
                <input 
                  type="file" 
                  multiple
                  accept="audio/mpeg, audio/ogg, video/mp4, application/pdf, application/zip, text/plain, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  className="hidden" 
                  ref={docInputRef}
                  onChange={handleFileChange}
                />
                <input 
                  type="file" 
                  multiple
                  accept="image/png, image/jpeg, image/gif, image/jpg, audio/mpeg, audio/ogg, video/mp4, application/pdf, application/zip, text/plain, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  className="hidden" 
                  ref={allInputRef}
                  onChange={handleFileChange}
                />
                {/* Attachment Popover */}
                {isAttachmentOpen && !isRecording && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsAttachmentOpen(false)}></div>
                    <div className="absolute bottom-[70px] left-3 bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.1)] border border-gray-100 z-20 w-[320px] flex overflow-hidden animate-fade-in-up">
                      <div className="flex-1 border-r border-gray-100">
                        <button onClick={() => imageInputRef.current?.click()} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors text-[13px] font-medium border-b border-gray-100">
                          <ImageIcon size={18} className="text-gray-500" /> Images
                        </button>
                        <button onClick={() => docInputRef.current?.click()} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors text-[13px] font-medium">
                          <FileText size={18} className="text-gray-500" /> Files & Documents
                        </button>
                      </div>
                      <div className="flex-1 p-3 flex items-center bg-gray-50/50">
                        <p className="text-[10px] text-gray-500 leading-relaxed font-sans">
                          Supported file format are png, jpg, jpeg, gif. Max file size 10 mb.
                          <br/><br/>
                          Files format are mp3, ogg, mv4, pdf, zip, txt, xls, xlsx. Max file size 10 mb.
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {/* Staging UI */}
                {stagedFiles.length > 0 && !isRecording && (
                  <div className="mb-3 bg-white rounded-xl shadow-[0_-4px_20px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden relative z-10 animate-fade-in-up mx-2">
                    <div 
                      className="px-4 py-2.5 flex items-center justify-between cursor-pointer border-b border-gray-50 bg-white"
                      onClick={() => setIsStagingExpanded(!isStagingExpanded)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700 font-bold text-[14px]">Files upload done</span>
                        <div className="w-3.5 h-3.5 rounded-full bg-green-500 flex items-center justify-center">
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                      </div>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-gray-400 transition-transform ${isStagingExpanded ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                    
                    {isStagingExpanded && (
                      <div className="p-4 bg-white flex flex-col max-h-[250px] overflow-y-auto">
                        <div className="flex flex-wrap gap-3">
                          {stagedFiles.map((sf, idx) => (
                            <div key={idx} className="bg-white border border-gray-200 rounded-xl p-2.5 flex items-center gap-3 shadow-sm relative w-full sm:w-[calc(50%-6px)]">
                              <button 
                                type="button" 
                                onClick={() => setStagedFiles(prev => prev.filter((_, i) => i !== idx))}
                                className="absolute top-1.5 right-1.5 text-gray-300 hover:text-red-500 p-1"
                              >
                                <X size={14} />
                              </button>
                              
                              <div className="w-10 h-10 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center shrink-0">
                                {sf.type === 'image' ? (
                                  <img src={sf.previewUrl} alt="preview" className="w-full h-full object-cover rounded-lg" />
                                ) : sf.type === 'video' ? (
                                  <video src={sf.previewUrl} className="w-full h-full object-cover rounded-lg" />
                                ) : sf.type === 'audio' ? (
                                  <Volume2 className="text-green-500" size={20} />
                                ) : (
                                  <FileText className="text-green-500" size={20} />
                                )}
                              </div>
                              
                              <div className="flex flex-col min-w-0 pr-4">
                                <span className="text-[13px] font-bold text-gray-800 truncate">{sf.name}</span>
                                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mt-0.5">{sf.size}, {sf.type}</span>
                              </div>
                            </div>
                          ))}
                          
                          <button 
                            type="button"
                            onClick={() => allInputRef.current?.click()}
                            className="w-[52px] h-[52px] rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 border-dashed flex items-center justify-center text-blue-500 transition-colors shadow-sm shrink-0"
                          >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {!isRecording ? (
                  <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <button 
                      type="button"
                      onClick={() => setIsAttachmentOpen(!isAttachmentOpen)}
                      className="w-11 h-11 rounded-full bg-[#f2f4f7] flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors shrink-0 relative z-20"
                    >
                      <Paperclip size={20} />
                    </button>
                    
                    <div className="flex-1 bg-[#f2f4f7] rounded-full flex items-center px-4 h-11">
                      <input 
                        type="text" 
                        placeholder="Write your message" 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-[14px] text-gray-700 placeholder:text-gray-500 font-sans"
                      />
                    </div>
                    
                    {inputText.trim() || stagedFiles.length > 0 ? (
                      <button type="submit" disabled={isSending} className="w-11 h-11 rounded-full bg-[#f2f4f7] flex items-center justify-center text-brand-primary hover:bg-gray-200 transition-colors shrink-0 relative z-20">
                        {isSending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className="mr-0.5" />}
                      </button>
                    ) : (
                      <button 
                        type="button"
                        onClick={startRecording}
                        className="w-11 h-11 rounded-full bg-[#f2f4f7] flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors shrink-0"
                      >
                        <Mic size={20} />
                      </button>
                    )}
                  </form>
                ) : (
                  <div className="flex items-center gap-3 w-full">
                    <button 
                      type="button"
                      onClick={() => stopRecording(false)}
                      className="w-11 h-11 rounded-full bg-[#f2f4f7] flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors shrink-0"
                    >
                      <X size={20} />
                    </button>
                    
                    <div className="flex-1 bg-gradient-to-r from-brand-mid to-[#e87010] rounded-full flex items-center justify-between px-5 h-11 shadow-sm relative overflow-hidden">
                      {/* Animated wave placeholder */}
                      <div className="flex items-center gap-1 h-full">
                        {[10, 16, 22, 16, 26, 18, 12, 16].map((h, i) => (
                          <div 
                            key={i} 
                            className="w-[3px] bg-white rounded-full" 
                            style={{ 
                              height: `${h}px`, 
                              animation: `pulse-height 1s ease-in-out infinite alternate`,
                              animationDelay: `${i * 0.1}s` 
                            }}
                          />
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-white text-[14px] font-medium tracking-wide">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_0_2px_rgba(255,255,255,1)] animate-pulse"></div>
                          {formatRecordingTime(recordingTime)}
                        </div>
                        <div className="w-[1px] h-5 bg-white/30"></div>
                        <button 
                          type="button"
                          onClick={() => stopRecording(true)}
                          className="p-1 text-white hover:text-white/80 transition-colors flex items-center justify-center"
                        >
                          <Send size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
      
      
      {selectedMedia && createPortal(
        <div className="fixed inset-0 z-[99999] bg-black/90 flex items-center justify-center p-4" style={{ pointerEvents: 'auto' }}>
          <button onClick={() => setSelectedMedia(null)} className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-[100000] p-2 bg-black/50 rounded-full">
            <X size={32} />
          </button>
          {selectedMedia.type === 'image' && (
            <img src={selectedMedia.url} className="max-w-full max-h-[90vh] object-contain rounded-lg" alt="preview" />
          )}
          {selectedMedia.type === 'video' && (
            <video src={selectedMedia.url} controls autoPlay className="max-w-full max-h-[90vh] rounded-lg shadow-2xl outline-none" />
          )}
          {selectedMedia.type === 'document' && (
            <iframe src={selectedMedia.url} className="w-full h-[90vh] max-w-5xl bg-white rounded-lg shadow-2xl" title="Document Preview" />
          )}
        </div>,
        document.body
      )}
    </div>
  );
};

export default ChatWidget;
