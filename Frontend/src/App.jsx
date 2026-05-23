// Your main layout and router. It checks the user's secure token 
// and decides whether to show the Login screen or the main Dashboard.
import React, { useState } from 'react'
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/clerk-react'
import AuthGuard from './components/AuthGuard'
import Dashboard from './pages/Dashboard'
import Journal from './pages/Journal'

export default function App() {
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <>
      <SignedOut>
        <AuthGuard />
      </SignedOut>

      <SignedIn>
        <div className="flex flex-col md:flex-row min-h-screen bg-[#0A0E17]">
          
          {/* DESKTOP SIDEBAR NAVIGATION (Hidden on Mobile) */}
          <aside className="hidden md:flex w-64 border-r border-[#1F2937] bg-[#131A28] flex-col justify-between p-6 shrink-0 z-50">
            <div>
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center p-1 shadow-[0_0_15px_rgba(59,130,246,0.4)]">
                  <img src="/image.png" alt="Capital Guard Logo" className="w-full h-full object-contain brightness-110" />
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight leading-none">CapitalGuard</h2>
              </div>
              <nav className="space-y-1">
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'dashboard' ? 'bg-[#1C263A] text-white border-l-4 border-[#3B82F6]' : 'text-gray-400 hover:text-white hover:bg-[#1C263A]/50'
                  }`}
                >
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" /></svg>
                  <span>Dashboard</span>
                </button>
                <button 
                  onClick={() => setActiveTab('journal')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'journal' ? 'bg-[#1C263A] text-white border-l-4 border-[#3B82F6]' : 'text-gray-400 hover:text-white hover:bg-[#1C263A]/50'
                  }`}
                >
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  <span>Trading Journal</span>
                </button>
              </nav>
            </div>
            <div className="border-t border-[#1F2937] pt-4 flex items-center space-x-3">
              <UserButton afterSignOutUrl="/" userProfileProps={{ appearance: { elements: { footer: "hidden" } } }} />
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-white truncate">{user?.firstName || user?.username || 'Trader'}</p>
                <p className="text-[10px] text-gray-400 truncate">{user?.primaryEmailAddress?.emailAddress || 'Subscribed'}</p>
              </div>
            </div>
          </aside>

          {/* MOBILE BOTTOM NAVIGATION (Visible only on Phones) */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#131A28]/95 backdrop-blur-md border-t border-[#1F2937] flex items-center justify-around z-50 px-2 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
            <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center justify-center w-full h-full pt-1 ${activeTab === 'dashboard' ? 'text-[#3B82F6]' : 'text-gray-500'}`}>
              <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" /></svg>
              <span className="text-[9px] font-bold tracking-wider uppercase">Dashboard</span>
            </button>
            
            <div className="flex flex-col items-center justify-center w-full h-full pt-2">
              <UserButton afterSignOutUrl="/" />
            </div>

            <button onClick={() => setActiveTab('journal')} className={`flex flex-col items-center justify-center w-full h-full pt-1 ${activeTab === 'journal' ? 'text-[#3B82F6]' : 'text-gray-500'}`}>
              <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              <span className="text-[9px] font-bold tracking-wider uppercase">Journal</span>
            </button>
          </nav>

          {/* MAIN APPLICATION WORKSPACE */}
          <main className="flex-1 flex flex-col h-screen overflow-y-auto pb-20 md:pb-0 relative">
            <header className="h-14 md:h-16 border-b border-[#1F2937] px-4 md:px-8 flex items-center justify-between bg-[#131A28]/80 backdrop-blur-md sticky top-0 z-40 shrink-0">
              <div className="flex items-center space-x-3 md:space-x-4">
                {/* Mobile Logo */}
                <div className="md:hidden w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center p-0.5 shadow-[0_0_10px_rgba(59,130,246,0.4)]">
                  <img src="/image.png" alt="Logo" className="w-full h-full object-contain brightness-110" />
                </div>
                <h1 className="text-base md:text-lg font-bold text-white capitalize hidden sm:block">{activeTab}</h1>
                <div className="h-4 w-[1px] bg-[#1F2937] hidden sm:block" />
                <div className="flex items-center space-x-2 text-[10px] md:text-xs">
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#10B981] animate-pulse" />
                  <span className="text-gray-400">Live Sync</span>
                </div>
              </div>
              <div className="flex items-center space-x-1.5 md:space-x-2 text-[9px] md:text-xs font-semibold tracking-wider uppercase">
                <span className="text-gray-500 hidden sm:block">SERVER GATEWAY</span>
                <span className="text-[#10B981]">SECURED</span>
              </div>
            </header>

            <div className="p-4 md:p-8 flex-1">
              {activeTab === 'dashboard' && <Dashboard />}
              {activeTab === 'journal' && <Journal />}
            </div>
          </main>

        </div>
      </SignedIn>
    </>
  )
}