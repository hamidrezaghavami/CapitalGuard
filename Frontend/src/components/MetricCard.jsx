/*A reusable visual box to cleanly display "The Accountant,"
"The Risk Officer," and "The Forecaster" data without cluttering your main dashboard file.*/
import React from 'react'

export default function MetricCard({ title, subtitle, value, trend, color = 'blue', children }) {
  // Map color names to design system token classes
  const colorMap = {
    green: {
      text: 'text-green',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]',
      border: 'hover:border-[#10B981]/30'
    },
    blue: {
      text: 'text-blue',
      glow: 'shadow-[0_0_20px_rgba(59,130,246,0.15)]',
      border: 'hover:border-[#3B82F6]/30'
    },
    amber: {
      text: 'text-amber',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]',
      border: 'hover:border-[#F59E0B]/30'
    },
    red: {
      text: 'text-red',
      glow: 'shadow-[0_0_20px_rgba(239,68,68,0.15)]',
      border: 'hover:border-[#EF4444]/30'
    }
  }

  const currentTheme = colorMap[color] || colorMap.blue

  return (
    <div className={`glass-panel p-5 relative overflow-hidden transition-all duration-300 ${currentTheme.border} ${currentTheme.glow}`}>
      
      {/* Sleek top label info */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">{title}</span>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
        {trend && (
          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10 ${currentTheme.text}`}>
            {trend}
          </span>
        )}
      </div>

      {/* Primary Value Display */}
      {value && (
        <div className="mb-4">
          <h3 className="text-3xl font-extrabold text-white tracking-tight font-mono select-all">
            {value}
          </h3>
        </div>
      )}

      {/* Render children (gauges, graphs, list audits) */}
      {children && (
        <div className="mt-2 w-full">
          {children}
        </div>
      )}
    </div>
  )
}