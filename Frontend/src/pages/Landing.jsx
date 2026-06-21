import React, { useState } from 'react';
import { SignInButton } from '@clerk/clerk-react';

const Landing = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div 
      className="relative min-h-screen bg-[#0A0E17] text-white flex flex-col font-sans overflow-hidden selection:bg-cyan-500/30"
      onMouseMove={handleMouseMove}
    >
      {/* Custom CSS for the smooth floating card animations */}
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
            100% { transform: translateY(0px); }
          }
          .animate-float-1 { animation: float 6s ease-in-out infinite; }
          .animate-float-2 { animation: float 7s ease-in-out infinite 1s; }
          .animate-float-3 { animation: float 8s ease-in-out infinite 2s; }
          .animate-float-4 { animation: float 6.5s ease-in-out infinite 3s; }
        `}
      </style>

      {/* Interactive Glowing Cursor Spotlight */}
      <div 
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-0"
        style={{
          background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 255, 255, 0.05), transparent 40%)`
        }}
      />

      {/* TOP HEADER */}
      <header className="relative z-50 flex items-center justify-between px-8 py-6 w-full max-w-7xl mx-auto border-b border-[#1F2937]/30">
        {/* Logo */}
        <div className="text-2xl font-bold tracking-tight cursor-pointer flex items-center">
          <span className="text-white">Capital</span><span className="text-gray-300">Guard</span>
        </div>
        
        {/* Center Nav (Only Platform) */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-400">
          <a href="#" className="text-white border-b-2 border-cyan-400 pb-1">Platform</a>
        </nav>

        {/* Right Button */}
        <div className="hidden md:block">
          <SignInButton mode="modal">
            <button className="bg-cyan-400 text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-cyan-300 transition-colors shadow-[0_0_15px_rgba(34,211,238,0.3)]">
              Launch Dashboard
            </button>
          </SignInButton>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 relative z-10 flex flex-col items-center w-full max-w-7xl mx-auto px-4 mt-12">
        
        {/* Headlines */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-white">
            Guard Your Capital
          </h1>
          <p className="text-gray-400 text-lg md:text-xl mb-4 leading-relaxed">
            Advanced AI-driven portfolio tracking and institutional-grade risk management.
          </p>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            The world's most advanced digital vault for institutional grade asset protection and sovereign management.
          </p>
        </div>

        {/* CENTERPIECE (Image + 4 Floating Cards) */}
        <div className="relative w-full max-w-[800px] h-[400px] md:h-[500px] flex items-center justify-center mb-16">
          
          {/* Subtle Background Waves Mockup */}
          <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
            <div className="w-[120%] h-[120%] border-[0.5px] border-cyan-900 rounded-[40%] animate-[spin_60s_linear_infinite]"></div>
            <div className="absolute w-[100%] h-[100%] border-[0.5px] border-cyan-800 rounded-[45%] animate-[spin_40s_linear_infinite_reverse]"></div>
          </div>

          {/* Floating Coins Image */}
          <img 
            src="/screen.png" 
            alt="CapitalGuard 3D Coins" 
            className="relative z-10 w-64 h-64 md:w-[450px] md:h-[450px] object-contain drop-shadow-[0_0_80px_rgba(34,211,238,0.1)] pointer-events-none"
          />

          {/* CARD 1: Top Left */}
          <div className="absolute top-[5%] left-0 md:-left-12 bg-[#121826]/90 backdrop-blur-md border border-[#1F2937] p-5 rounded-2xl shadow-2xl z-20 w-48 hidden sm:block animate-float-1">
            <div className="flex items-center space-x-2 mb-2">
              <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" /></svg>
              <span className="text-[10px] text-gray-300 font-bold tracking-wider uppercase">Encrypted Assets</span>
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">$1.2B</div>
          </div>

          {/* CARD 2: Top Right */}
          <div className="absolute top-[0%] right-0 md:-right-8 bg-[#121826]/90 backdrop-blur-md border border-[#1F2937] p-5 rounded-2xl shadow-2xl z-20 w-52 hidden sm:block animate-float-2">
            <div className="flex items-center space-x-2 mb-2">
              <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
              <span className="text-[10px] text-gray-300 font-bold tracking-wider uppercase">Active Protections</span>
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">24/7 Monitoring</div>
          </div>

          {/* CARD 3: Bottom Left */}
          <div className="absolute bottom-[0%] left-0 md:-left-8 bg-[#121826]/90 backdrop-blur-md border border-[#1F2937] p-5 rounded-2xl shadow-2xl z-20 w-48 hidden sm:block animate-float-3">
            <div className="flex items-center space-x-2 mb-2">
              <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              <span className="text-[10px] text-gray-300 font-bold tracking-wider uppercase">AI Market Insights</span>
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">Active</div>
          </div>

          {/* CARD 4: Bottom Right */}
          <div className="absolute bottom-[5%] right-0 md:-right-12 bg-[#121826]/90 backdrop-blur-md border border-[#1F2937] p-5 rounded-2xl shadow-2xl z-20 w-48 hidden sm:block animate-float-4">
            <div className="flex items-center space-x-2 mb-2">
              <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              <span className="text-[10px] text-gray-300 font-bold tracking-wider uppercase">Security Score</span>
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">99.9%</div>
          </div>
        </div>

        {/* BOTTOM CTA */}
        <div className="flex flex-col items-center mt-4">
          <div className="flex gap-1 text-yellow-500 mb-2 text-sm">
            ★★★★★
          </div>
          <span className="text-[11px] tracking-widest text-gray-400 uppercase mb-8 font-semibold">Trusted by 10,000+ Traders</span>
          
          <SignInButton mode="modal">
            <button className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-black transition-all duration-200 bg-cyan-400 rounded-full hover:bg-cyan-300 hover:scale-105 shadow-[0_0_40px_rgba(34,211,238,0.3)] hover:shadow-[0_0_60px_rgba(34,211,238,0.5)] focus:outline-none">
              Launch Dashboard 
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
          </SignInButton>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="relative z-50 bg-[#0E131F] border-t border-[#1F2937] mt-24 py-8 px-8 flex flex-col md:flex-row justify-between items-center w-full">
        <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
          <div className="text-xl font-bold tracking-tight mb-2">
            <span className="text-white">Capital</span><span className="text-gray-400">Guard</span>
          </div>
          <p className="text-[10px] text-gray-500 tracking-wider">© 2026 CapitalGuard. Institutional Grade Security.</p>
        </div>
        <a href="mailto:hamidr.ghavami@gmail.com" className="text-[11px] text-gray-400 font-medium tracking-wider hover:text-white transition-colors">
          Contact
          </a>
      </footer>

    </div>
  );
};

export default Landing;