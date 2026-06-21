import React, { useState } from 'react';
import { SignInButton } from '@clerk/clerk-react';

const Landing = () => {
  // This state tracks your mouse position for the glow effect
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div 
      className="relative min-h-screen bg-[#0B0F19] text-white overflow-hidden font-sans flex items-center justify-center selection:bg-cyan-500/30"
      onMouseMove={handleMouseMove}
    >
      {/* 1. The Interactive Glowing Cursor Spotlight */}
      <div 
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-0"
        style={{
          background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 255, 255, 0.06), transparent 50%)`
        }}
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 flex flex-col items-center">
        
        {/* Top Left Logo (No other nav links, keeping it ultra-minimal) */}
        <div className="absolute top-8 left-8 text-2xl font-bold tracking-wider">
          <span className="text-cyan-400">Capital</span>Guard
        </div>

        {/* Centerpiece Container (Floating Coins & Cards) */}
        <div className="relative w-full max-w-[600px] h-[400px] md:h-[500px] mx-auto mb-8 mt-12 flex items-center justify-center">
          
          {/* Your Custom 3D Coins Image */}
          <img 
            src="/screen.png" 
            alt="CapitalGuard 3D Coins" 
            className="w-80 h-80 md:w-[500px] md:h-[500px] object-contain drop-shadow-[0_0_80px_rgba(34,211,238,0.15)] pointer-events-none z-10"
          />

          {/* Glassmorphism Card 1: Left */}
          <div className="absolute top-1/4 -left-4 md:-left-20 bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl text-left shadow-xl hidden sm:block z-20">
            <h4 className="text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">Encrypted Assets</h4>
            <p className="text-3xl font-semibold">$1.2B</p>
          </div>

          {/* Glassmorphism Card 2: Right */}
          <div className="absolute bottom-1/4 -right-4 md:-right-20 bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl text-left shadow-xl hidden sm:block z-20">
            <h4 className="text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">Security Score</h4>
            <p className="text-3xl font-semibold">99.9%</p>
          </div>
        </div>

        {/* Headlines */}
        <div className="text-center z-20">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">
            Guard Your Capital
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Advanced AI-driven portfolio tracking and institutional-grade risk management.
          </p>

          {/* Glowing Call to Action Button with Clerk SignIn wrapper */}
          <SignInButton mode="modal">
            <button 
              className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-black transition-all duration-200 bg-cyan-400 rounded-full hover:bg-cyan-300 hover:scale-105 shadow-[0_0_40px_rgba(34,211,238,0.4)] hover:shadow-[0_0_60px_rgba(34,211,238,0.6)] focus:outline-none"
            >
              Launch Dashboard 
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
          </SignInButton>
        </div>

        {/* Trust Badge below Button */}
        <div className="mt-12 flex flex-col items-center opacity-70">
          <div className="flex gap-1 text-yellow-500 mb-2 text-lg">
            ★★★★★
          </div>
          <span className="text-xs tracking-widest text-gray-400 uppercase">Trusted by 10,000+ Traders</span>
        </div>

        {/* Minimal Footer */}
        <div className="absolute bottom-6 left-8 text-xs text-gray-600 tracking-wide">
          © 2026 CapitalGuard. Institutional Grade Security.
        </div>
      </div>
    </div>
  );
};

export default Landing;