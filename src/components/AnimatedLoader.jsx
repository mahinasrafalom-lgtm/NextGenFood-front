import React from 'react';

const AnimatedLoader = () => {
  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden select-none" style={{ background: 'linear-gradient(135deg, #FFF8F0 0%, #FFF0E6 30%, #FFFAF5 60%, #FFF5EB 100%)' }}>
      
      {/* Floating hearts & sparkles */}
      <div className="cl-floats">
        <div className="cl-float cl-heart" style={{ left: '12%', animationDelay: '0s' }}>♥</div>
        <div className="cl-float cl-sparkle" style={{ left: '22%', animationDelay: '1.5s' }}>✦</div>
        <div className="cl-float cl-heart" style={{ left: '35%', animationDelay: '3s' }}>♥</div>
        <div className="cl-float cl-sparkle" style={{ left: '55%', animationDelay: '0.8s' }}>✧</div>
        <div className="cl-float cl-heart" style={{ left: '70%', animationDelay: '2.2s' }}>♥</div>
        <div className="cl-float cl-sparkle" style={{ left: '82%', animationDelay: '3.5s' }}>✦</div>
        <div className="cl-float cl-heart" style={{ left: '90%', animationDelay: '1s' }}>♥</div>
      </div>

      {/* Main cat scene */}
      <div className="cl-scene">
        <svg viewBox="0 0 200 220" className="cl-cat-svg" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="bodyGrad" cx="50%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#FFE8D0" />
              <stop offset="100%" stopColor="#FFCFA0" />
            </radialGradient>
            <radialGradient id="cheekL" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFB6C8" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#FFB6C8" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="cheekR" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFB6C8" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#FFB6C8" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="noseGrad" cx="45%" cy="35%" r="55%">
              <stop offset="0%" stopColor="#FF9EB5" />
              <stop offset="100%" stopColor="#F27A97" />
            </radialGradient>
            <radialGradient id="eyeShine" cx="35%" cy="30%" r="40%">
              <stop offset="0%" stopColor="#665544" />
              <stop offset="100%" stopColor="#3A2A1A" />
            </radialGradient>
            <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
              <feOffset dx="0" dy="2" />
              <feComponentTransfer><feFuncA type="linear" slope="0.08" /></feComponentTransfer>
              <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Tail */}
          <g className="cl-tail">
            <path d="M 152 170 Q 175 155 180 130 Q 185 110 175 100" 
              stroke="#FFCFA0" strokeWidth="10" fill="none" strokeLinecap="round" />
            <path d="M 175 100 Q 170 93 178 90" 
              stroke="#F28522" strokeWidth="8" fill="none" strokeLinecap="round" />
          </g>

          {/* Body */}
          <g filter="url(#softShadow)">
            <ellipse cx="100" cy="172" rx="52" ry="40" fill="url(#bodyGrad)" />
            {/* Belly */}
            <ellipse cx="100" cy="178" rx="32" ry="26" fill="#FFF4E8" />
          </g>

          {/* Back paws */}
          <ellipse cx="62" cy="198" rx="18" ry="10" fill="#FFCFA0" />
          <ellipse cx="138" cy="198" rx="18" ry="10" fill="#FFCFA0" />
          {/* Paw pads */}
          <ellipse cx="62" cy="200" rx="10" ry="6" fill="#FFE8D6" />
          <ellipse cx="138" cy="200" rx="10" ry="6" fill="#FFE8D6" />
          {/* Tiny toe beans on back paws */}
          <circle cx="56" cy="197" r="2.5" fill="#FFD4BE" />
          <circle cx="62" cy="195" r="2.5" fill="#FFD4BE" />
          <circle cx="68" cy="197" r="2.5" fill="#FFD4BE" />
          <circle cx="132" cy="197" r="2.5" fill="#FFD4BE" />
          <circle cx="138" cy="195" r="2.5" fill="#FFD4BE" />
          <circle cx="144" cy="197" r="2.5" fill="#FFD4BE" />

          {/* Front paws */}
          <g className="cl-paw-left">
            <ellipse cx="76" cy="194" rx="12" ry="8" fill="#FFCFA0" />
            <ellipse cx="76" cy="196" rx="7" ry="4" fill="#FFE8D6" />
          </g>
          <g className="cl-paw-right">
            <ellipse cx="124" cy="194" rx="12" ry="8" fill="#FFCFA0" />
            <ellipse cx="124" cy="196" rx="7" ry="4" fill="#FFE8D6" />
          </g>

          {/* Head */}
          <g className="cl-head" filter="url(#softShadow)">
            <ellipse cx="100" cy="105" rx="50" ry="46" fill="url(#bodyGrad)" />
            
            {/* Forehead stripe */}
            <path d="M 100 62 L 96 78 L 100 74 L 104 78 Z" fill="#F2A050" opacity="0.4" />

            {/* Left ear */}
            <g className="cl-ear-left">
              <path d="M 58 78 L 52 40 L 82 65 Z" fill="#FFCFA0" />
              <path d="M 62 74 L 58 48 L 78 67 Z" fill="#FFB6C8" opacity="0.5" />
            </g>
            {/* Right ear */}
            <g className="cl-ear-right">
              <path d="M 142 78 L 148 40 L 118 65 Z" fill="#FFCFA0" />
              <path d="M 138 74 L 142 48 L 122 67 Z" fill="#FFB6C8" opacity="0.5" />
            </g>

            {/* Face white patch */}
            <ellipse cx="100" cy="115" rx="30" ry="24" fill="#FFF6EE" opacity="0.6" />

            {/* Eyes */}
            <g className="cl-eyes">
              {/* Left eye */}
              <g className="cl-eye-group">
                <ellipse cx="80" cy="102" rx="13" ry="14" fill="white" />
                <ellipse cx="80" cy="103" rx="10" ry="11" fill="url(#eyeShine)" />
                {/* Pupil */}
                <ellipse cx="80" cy="104" rx="5.5" ry="7" fill="#1A1008" />
                {/* Big shine */}
                <circle cx="76" cy="99" r="4" fill="white" opacity="0.9" />
                {/* Small shine */}
                <circle cx="84" cy="106" r="2" fill="white" opacity="0.6" />
                {/* Tiny sparkle */}
                <circle cx="74" cy="104" r="1" fill="white" opacity="0.5" />
              </g>
              {/* Right eye */}
              <g className="cl-eye-group">
                <ellipse cx="120" cy="102" rx="13" ry="14" fill="white" />
                <ellipse cx="120" cy="103" rx="10" ry="11" fill="url(#eyeShine)" />
                <ellipse cx="120" cy="104" rx="5.5" ry="7" fill="#1A1008" />
                <circle cx="116" cy="99" r="4" fill="white" opacity="0.9" />
                <circle cx="124" cy="106" r="2" fill="white" opacity="0.6" />
                <circle cx="114" cy="104" r="1" fill="white" opacity="0.5" />
              </g>
            </g>

            {/* Eye blink overlay */}
            <g className="cl-blink">
              <ellipse cx="80" cy="102" rx="14" ry="15" fill="url(#bodyGrad)" />
              <ellipse cx="120" cy="102" rx="14" ry="15" fill="url(#bodyGrad)" />
              {/* Closed eye lines */}
              <path d="M 68 103 Q 80 110 92 103" stroke="#AA7755" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M 108 103 Q 120 110 132 103" stroke="#AA7755" strokeWidth="2" fill="none" strokeLinecap="round" />
            </g>

            {/* Blush / cheeks */}
            <ellipse cx="64" cy="116" rx="10" ry="7" fill="url(#cheekL)" />
            <ellipse cx="136" cy="116" rx="10" ry="7" fill="url(#cheekR)" />

            {/* Nose */}
            <path d="M 97 118 Q 100 115 103 118 Q 100 122 97 118 Z" fill="url(#noseGrad)" />

            {/* Mouth */}
            <path d="M 100 122 Q 93 128 88 126" stroke="#CC8866" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M 100 122 Q 107 128 112 126" stroke="#CC8866" strokeWidth="1.5" fill="none" strokeLinecap="round" />

            {/* Whiskers */}
            <g className="cl-whiskers" opacity="0.5">
              <line x1="42" y1="110" x2="68" y2="115" stroke="#CC9966" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="40" y1="118" x2="67" y2="120" stroke="#CC9966" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="44" y1="126" x2="68" y2="124" stroke="#CC9966" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="158" y1="110" x2="132" y2="115" stroke="#CC9966" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="160" y1="118" x2="133" y2="120" stroke="#CC9966" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="156" y1="126" x2="132" y2="124" stroke="#CC9966" strokeWidth="1.2" strokeLinecap="round" />
            </g>
          </g>

          {/* Shadow on ground */}
          <ellipse cx="100" cy="212" rx="55" ry="6" fill="black" opacity="0.05" className="cl-shadow" />
        </svg>
      </div>

      {/* Paw trail */}
      <div className="cl-paw-trail">
        {[0,1,2,3,4].map(i => (
          <span key={i} className="cl-paw-step" style={{ animationDelay: `${i * 0.35}s` }}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="#F28522" opacity="0.5">
              <ellipse cx="12" cy="17" rx="6" ry="5" />
              <circle cx="6" cy="10" r="3" />
              <circle cx="12" cy="7" r="3" />
              <circle cx="18" cy="10" r="3" />
            </svg>
          </span>
        ))}
      </div>

      {/* Text */}
      <div className="cl-text">
        <h2 className="cl-title">NexGen Veterinary</h2>
        <p className="cl-sub">
          Preparing your store
          <span className="cl-dot-wrap">
            <span className="cl-dot" style={{ animationDelay: '0s' }}>.</span>
            <span className="cl-dot" style={{ animationDelay: '0.25s' }}>.</span>
            <span className="cl-dot" style={{ animationDelay: '0.5s' }}>.</span>
          </span>
        </p>
      </div>

      {/* Progress */}
      <div className="cl-prog-track">
        <div className="cl-prog-bar" />
      </div>

      <style dangerouslySetInnerHTML={{ __html: CSS }} />
    </div>
  );
};

const CSS = `
/* ===== Scene ===== */
.cl-scene {
  width: 180px;
  height: 200px;
  margin-bottom: 4px;
  animation: cl-float 3s ease-in-out infinite;
}
.cl-cat-svg { width: 100%; height: 100%; }

@keyframes cl-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

/* ===== Head tilt ===== */
.cl-head {
  transform-origin: 100px 140px;
  animation: cl-headTilt 5s ease-in-out infinite;
}
@keyframes cl-headTilt {
  0%, 100% { transform: rotate(0deg); }
  30% { transform: rotate(4deg); }
  70% { transform: rotate(-4deg); }
}

/* ===== Blink ===== */
.cl-blink {
  opacity: 0;
  animation: cl-blinkAnim 4s ease-in-out infinite;
}
@keyframes cl-blinkAnim {
  0%, 38%, 42%, 100% { opacity: 0; }
  40% { opacity: 1; }
}

/* ===== Ear twitch ===== */
.cl-ear-left {
  transform-origin: 70px 70px;
  animation: cl-earL 3s ease-in-out infinite;
}
.cl-ear-right {
  transform-origin: 130px 70px;
  animation: cl-earR 3.5s ease-in-out infinite;
}
@keyframes cl-earL {
  0%, 85%, 100% { transform: rotate(0deg); }
  90% { transform: rotate(-6deg); }
}
@keyframes cl-earR {
  0%, 80%, 100% { transform: rotate(0deg); }
  85% { transform: rotate(6deg); }
}

/* ===== Tail ===== */
.cl-tail {
  transform-origin: 152px 170px;
  animation: cl-tailWag 1.5s ease-in-out infinite;
}
@keyframes cl-tailWag {
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(8deg); }
}

/* ===== Paws ===== */
.cl-paw-left {
  transform-origin: 76px 194px;
  animation: cl-pawL 1.8s ease-in-out infinite;
}
.cl-paw-right {
  transform-origin: 124px 194px;
  animation: cl-pawR 1.8s ease-in-out infinite 0.9s;
}
@keyframes cl-pawL {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}
@keyframes cl-pawR {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

/* ===== Whiskers ===== */
.cl-whiskers {
  animation: cl-whisk 2.5s ease-in-out infinite;
}
@keyframes cl-whisk {
  0%, 100% { transform: scaleX(1); }
  50% { transform: scaleX(1.04); }
}

/* ===== Shadow ===== */
.cl-shadow {
  animation: cl-shadowPulse 3s ease-in-out infinite;
}
@keyframes cl-shadowPulse {
  0%, 100% { rx: 55; opacity: 0.05; }
  50% { rx: 48; opacity: 0.03; }
}

/* ===== Floating hearts/sparkles ===== */
.cl-floats { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.cl-float {
  position: absolute;
  bottom: -30px;
  font-size: 14px;
  opacity: 0;
  animation: cl-riseUp 7s ease-in infinite;
}
.cl-heart { color: #FFB6C8; }
.cl-sparkle { color: #FFD700; font-size: 12px; }
@keyframes cl-riseUp {
  0%   { opacity: 0; transform: translateY(0) scale(0.5) rotate(0deg); }
  15%  { opacity: 0.7; transform: translateY(-80px) scale(1) rotate(15deg); }
  85%  { opacity: 0.3; transform: translateY(-85vh) scale(0.8) rotate(-10deg); }
  100% { opacity: 0; transform: translateY(-100vh) scale(0.4) rotate(20deg); }
}

/* ===== Paw trail ===== */
.cl-paw-trail {
  display: flex;
  gap: 14px;
  height: 24px;
  margin-top: 6px;
  margin-bottom: 10px;
}
.cl-paw-step {
  opacity: 0;
  animation: cl-pawPop 1.75s ease-in-out infinite;
}
@keyframes cl-pawPop {
  0%   { opacity: 0; transform: scale(0.3) translateY(4px); }
  25%  { opacity: 0.7; transform: scale(1.15) translateY(-2px); }
  50%  { opacity: 1; transform: scale(1) translateY(0); }
  75%  { opacity: 0.5; transform: scale(0.9) translateY(1px); }
  100% { opacity: 0; transform: scale(0.4) translateY(4px); }
}

/* ===== Text ===== */
.cl-text { text-align: center; margin-top: 2px; }
.cl-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: #3A2A1A;
  letter-spacing: -0.3px;
  margin-bottom: 4px;
}
.cl-sub {
  font-size: 0.9rem;
  color: #998877;
  font-weight: 500;
}
.cl-dot-wrap { letter-spacing: 2px; margin-left: 2px; }
.cl-dot {
  display: inline-block;
  font-weight: 800;
  color: #F28522;
  font-size: 1.3rem;
  animation: cl-dotJump 1.2s ease-in-out infinite;
}
@keyframes cl-dotJump {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

/* ===== Progress ===== */
.cl-prog-track {
  width: 160px;
  height: 4px;
  background: #F0E6DD;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 14px;
}
.cl-prog-bar {
  width: 35%;
  height: 100%;
  background: linear-gradient(90deg, #F9B37E, #F28522);
  border-radius: 4px;
  animation: cl-slide 2s ease-in-out infinite;
}
@keyframes cl-slide {
  0%   { transform: translateX(-120%); }
  100% { transform: translateX(400%); }
}
`;

export default AnimatedLoader;
