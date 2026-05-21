// The visual sign-in/sign-up buttons that connect directly to Clerk.
import React from 'react'
import { SignIn } from '@clerk/clerk-react'

export default function AuthGuard() {
  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center bg-[#050810] font-sans antialiased selection:bg-blue-500/30">
      
      {/* Background Radial Glow */}
      <div 
        className="glow-effect absolute inset-0 pointer-events-none z-0" 
        style={{
          background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.25) 0%, rgba(29, 78, 216, 0.1) 45%, transparent 80%)'
        }}
      />

      {/* Main Content Area - Responsive width up to 380px max */}
      <main className="w-full max-w-[380px] px-4 relative z-10">
        
        {/* Core Glass Card Wrapper - Optimized vertical padding */}
        <div className="bg-[#0F172A]/85 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.6),0_0_80px_rgba(59,130,246,0.08)] backdrop-blur-2xl rounded-2xl py-6 px-6 sm:py-7 sm:px-9 w-full flex flex-col items-center">
          
        {/* Header & Logo - Tightened vertical spacing */}
        <div className="flex flex-col items-center mb-5 text-center w-full">
            
        {/* New Bright Icy Blue Logo Container (Matches your Dashboard!) */}
        <div className="w-14 h-14 mb-3 bg-blue-50 rounded-xl flex items-center justify-center p-1.5 shadow-[0_0_20px_rgba(59,130,246,0.4)]">
              <img 
                src="/image.png" 
                alt="Capital Guard Logo" 
                className="w-full h-full object-contain brightness-110"
              />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Sign in</h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-0.5">to continue to CapitalGuard Dashboard</p>
        </div>

          {/* Secure Fluid Clerk Form Injection (FIXED STYLING) */}
            <div className="w-full">
            <SignIn 
              signUpUrl="/sign-up" 
              routing="hash"
              localization={{
                // Flat keys (Clerk v4 and some v5)
                formFieldInputPlaceholder__emailAddress: 'name@gmail.com',
                formFieldInputPlaceholder__emailAddress_username: 'name@gmail.com',
                formFieldInputPlaceholder__identifier: 'name@gmail.com',
                
                // Nested keys (Strict Clerk v5+)
                signIn: {
                  start: {
                    emailAddressField: {
                      placeholder: "name@gmail.com"
                    },
                    identifierField: {
                      placeholder: "name@gmail.com"
                    }
                  }
                }
              }}
              appearance={{
                elements: {
                  cardBox: "shadow-none w-full",
                  card: "bg-transparent shadow-none border-none w-full max-w-full", 
                  header: "hidden", 
                  footer: "hidden", 
                  socialButtonsBlockButton: "bg-[#1C263A] border-[#1F2937] text-white hover:bg-[#2D3748]",
                  formFieldInput: "bg-[#0A0E17] border-[#1F2937] text-white focus:border-[#3B82F6]",
                  formFieldLabel: "text-gray-400",
                  formButtonPrimary: "bg-[#3B82F6] hover:bg-[#2563EB] text-white",
                  dividerLine: "bg-[#1F2937]",
                  dividerText: "text-gray-500"
                }
              }}
            />
          </div>

          {/* Trust Badges - Tightened vertical padding */}
          <div className="w-full mt-4 pt-4 border-t border-gray-800/60 flex justify-center space-x-6">
            <div className="flex items-center text-xs text-gray-500 font-medium">
              <svg className="w-4 h-4 mr-1.5 text-blue-500/80" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" clipRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
              </svg>
              SOC2 Type II
            </div>
            <div className="flex items-center text-xs text-gray-500 font-medium">
              <svg className="w-4 h-4 mr-1.5 text-blue-500/80" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" clipRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" />
              </svg>
              256-bit SSL
            </div>
          </div>

        </div>
      </main>

      {/* Engineer Credit Footer */}
      <footer className="absolute bottom-6 w-full text-center z-10 pointer-events-none">
        <p className="text-[10px] font-semibold tracking-[0.25em] text-gray-600 uppercase">
          ENGINEERED BY HAMID REZA GHAVAMI
        </p>
      </footer>

    </div>
  )
}