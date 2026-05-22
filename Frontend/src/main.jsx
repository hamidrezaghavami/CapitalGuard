// The entry point. It boots up React and wraps your app in the Clerk authentication provider.
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'
import { dark } from '@clerk/themes'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

function EnvKeyWarning() {
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#050810',
      color: '#F3F4F6',
      fontFamily: "'Inter', sans-serif",
      padding: '20px',
      textAlign: 'center'
    }}>
      <div style={{
        maxWidth: '450px',
        padding: '30px',
        borderRadius: '16px',
        border: '1px solid #1F2937',
        backgroundColor: '#131A28',
        boxShadow: '0 0 40px rgba(59, 130, 246, 0.1)'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔑</div>
        <h2 style={{ fontSize: '22px', fontWeight: 600, marginBottom: '12px' }}>Authentication Required</h2>
        <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
          Please add your Clerk Publishable Key to your <code>.env</code> file in the <code>Frontend</code> folder:
        </p>
        <div style={{
          backgroundColor: '#050810',
          border: '1px solid #1F2937',
          borderRadius: '8px',
          padding: '12px',
          fontFamily: 'monospace',
          fontSize: '13px',
          color: '#3B82F6',
          textAlign: 'left',
          marginBottom: '20px',
          wordBreak: 'break-all'
        }}>
          VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
        </div>
        <p style={{ color: '#9CA3AF', fontSize: '13px' }}>
          After saving the key, restart your dev server.
        </p>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {PUBLISHABLE_KEY ? (
      <ClerkProvider 
        publishableKey={PUBLISHABLE_KEY}
        appearance={{
          baseTheme: dark,
          variables: {
            colorPrimary: '#3B82F6',
            colorBackground: '#0F172A',
            colorInputBackground: '#050810',
            colorInputText: '#E2E8F0',
            colorText: '#E2E8F0',
            colorTextSecondary: '#94A3B8',
          }
        }}
      >
        <App />
      </ClerkProvider>
    ) : (
      <EnvKeyWarning />
    )}
  </React.StrictMode>
)