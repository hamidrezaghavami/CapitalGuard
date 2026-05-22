// Your main layout and router. It checks the user's secure token 
// and decides whether to show the Login screen or the main Dashboard.
import React, { useState } from 'react'
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/clerk-react'
import AuthGuard from './components/AuthGuard'
import Dashboard from './pages/Dashboard'
// IMPORT YOUR REAL JOURNAL COMPONENT HERE:
import Journal from './pages/Journal'

export default function App() {
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <>
      {/* 1. OUT OF THE BOX PROTECTED AUTH (STITCH UI DESIGN) */}
      <SignedOut>
        <AuthGuard />
      </SignedOut>

      {/* 2. PROTECTED INTERFACE (DASHBOARD & SHELL) */}
      <SignedIn>
        <div className="flex min-h-screen bg-[#0A0E17]">
          
          {/* LEFT SIDEBAR NAVIGATION */}
          <aside className="w-64 border-r border-[#1F2937] bg-[#131A28] flex flex-col justify-between p-6 shrink-0">
            <div>
              
              {/* App Brand Header (Custom Logo) */}
              <div className="flex items-center space-x-3 mb-8">
                
                {/* Icy light-blue background ONLY behind the logo */}
                <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center p-1 shadow-[0_0_15px_rgba(59,130,246,0.4)]">
                  <img 
                    src="/image.png" 
                    alt="Capital Guard Logo" 
                    className="w-full h-full object-contain brightness-110"
                  />
                </div>

                <h2 className="text-xl font-bold text-white tracking-tight leading-none">
                  CapitalGuard
                </h2>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-1">
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'dashboard' 
                      ? 'bg-[#1C263A] text-white border-l-4 border-[#3B82F6]' 
                      : 'text-gray-400 hover:text-white hover:bg-[#1C263A]/50'
                  }`}
                >
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
                  </svg>
                  <span>Dashboard</span>
                </button>

                <button 
                  onClick={() => setActiveTab('journal')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'journal' 
                      ? 'bg-[#1C263A] text-white border-l-4 border-[#3B82F6]' 
                      : 'text-gray-400 hover:text-white hover:bg-[#1C263A]/50'
                  }`}
                >
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>Trading Journal</span>
                </button>
              </nav>
            </div>

            {/* Bottom User Area */}
            <div className="border-t border-[#1F2937] pt-4 flex items-center space-x-3">
              <UserButton 
                afterSignOutUrl="/" 
                userProfileProps={{
                  appearance: {
                    elements: {
                      footer: "hidden"
                    }
                  }
                }}
              />
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-white truncate max-w-[140px]">
                  {user?.firstName || user?.username || 'Trader'}
                </p>
                <p className="text-[10px] text-gray-400 truncate max-w-[140px]">
                  {user?.primaryEmailAddress?.emailAddress || 'Subscribed'}
                </p>
              </div>
            </div>
          </aside>

          {/* MAIN APPLICATION WORKSPACE */}
          <main className="flex-1 flex flex-col overflow-y-auto">
            {/* Top Navigation / Status Bar */}
            <header className="h-16 border-b border-[#1F2937] px-8 flex items-center justify-between bg-[#131A28]/50 backdrop-blur-md sticky top-0 z-40">
              <div className="flex items-center space-x-4">
                <h1 className="text-lg font-bold text-white capitalize">{activeTab}</h1>
                <div className="h-4 w-[1px] bg-[#1F2937]" />
                <div className="flex items-center space-x-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                  <span className="text-gray-400">Live Feed Sync</span>
                </div>
              </div>
              
              {/* UPDATED RIGHT STATUS BADGE */}
              <div className="flex items-center space-x-2 text-xs font-semibold tracking-wider uppercase">
                <span className="text-gray-500">SERVER GATEWAY</span>
                <span className="text-[#10B981]">SECURED</span>
              </div>
            </header>

            {/* Main Page Area */}
            <div className="p-8">
              {activeTab === 'dashboard' && <Dashboard />}
              {/* Now rendering your real, auto-syncing Journal component! */}
              {activeTab === 'journal' && <Journal />}
            </div>
          </main>

        </div>
      </SignedIn>
    </>
  )
}