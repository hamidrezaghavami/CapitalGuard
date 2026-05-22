import React, { useState, useEffect } from 'react';

export default function Journal() {
  const [trades, setTrades] = useState([]);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

  useEffect(() => {
    // Function to load trades and only update if data changed
    const syncTrades = () => {
      const cachedTrades = localStorage.getItem("capitalGuard_trades");
      if (cachedTrades) {
        setTrades((prevTrades) => {
          // Prevent infinite re-renders by only updating state if the data actually changed
          if (JSON.stringify(prevTrades) !== cachedTrades) {
            return JSON.parse(cachedTrades);
          }
          return prevTrades;
        });
      }
    };

    // 1. Sync immediately on page render
    syncTrades();

    // 2. Poll every 1 second to sync background uploads instantly
    const interval = setInterval(syncTrades, 1000);

    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  // Dismiss dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = () => {
      setOpenDropdownIndex(null);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  // Update tag and persist immediately to localStorage
  const handleTagChange = (index, newTag) => {
    const updatedTrades = [...trades];
    updatedTrades[index] = {
      ...updatedTrades[index],
      tag: newTag
    };
    setTrades(updatedTrades);
    localStorage.setItem("capitalGuard_trades", JSON.stringify(updatedTrades));
    setOpenDropdownIndex(null);
  };

  const toggleDropdown = (e, index) => {
    e.stopPropagation(); // Prevents click-outside listener from instantly closing it
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };

  // Icon Styling Helper
  const getIconStyle = (asset) => {
    const assetLower = asset.toLowerCase();
    if (assetLower.includes("btc")) return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    if (assetLower.includes("eth")) return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
    if (assetLower.includes("sol")) return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
    if (assetLower.includes("xau") || assetLower.includes("gold")) return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    if (assetLower.includes("nas") || assetLower.includes("us100")) return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    return "bg-slate-500/10 text-slate-400 border-slate-500/20";
  };

  // Icon Character Helper
  const getIconChar = (asset) => {
    const assetLower = asset.toLowerCase();
    if (assetLower.includes("btc")) return "₿";
    if (assetLower.includes("eth")) return "Ξ";
    if (assetLower.includes("sol")) return "S";
    if (assetLower.includes("xau") || assetLower.includes("gold")) return "Au";
    if (assetLower.includes("nas") || assetLower.includes("us100")) return "N";
    return asset.charAt(0).toUpperCase();
  };

  // Volume Unit Helper
  const getVolumeUnit = (asset) => {
    const assetLower = asset.toLowerCase();
    if (assetLower.includes("btc")) return " BTC";
    if (assetLower.includes("eth")) return " ETH";
    if (assetLower.includes("sol")) return " SOL";
    if (assetLower.includes("xau") || assetLower.includes("gold")) return " Oz";
    return " Lots";
  };

  // Tag Badge Styling Helper
  const getTagBadgeStyle = (tag) => {
    if (!tag) return "bg-gray-800/20 text-gray-500 border-gray-800/40 hover:border-gray-700/60";
    const tagUpper = tag.toUpperCase();
    if (tagUpper === "STRATEGY" || tagUpper === "STRATUGY") {
      return "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20";
    }
    if (tagUpper === "REVENGE" || tagUpper === "REVENAGE") {
      return "bg-red-500/10 text-red-400 border-red-500/20";
    }
    if (tagUpper === "NEWS") {
      return "bg-white/10 text-white border-white/20";
    }
    if (tagUpper === "EMOTION") {
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    }
    return "bg-gray-800/20 text-gray-500 border-gray-800/40";
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-16">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-1">
            Trading Journal
          </h1>
          <p className="text-sm text-gray-400">
            A comprehensive, custom-categorized record of your ledger executions.
          </p>
        </div>
      </div>

      {/* HORIZONTAL CARDS LEDGER */}
      <div className="flex flex-col gap-3">
        {trades.length > 0 ? (
          trades.map((trade, index) => {
            const pnl = parseFloat(trade.pnl || trade.ResultUSD || trade.profitOrLoss || 0);
            const fee = parseFloat(trade.fee || trade.Fee || trade.commission || 0);
            const asset = trade.symbol || trade.Asset || trade.Symbol || "BTC/USDT";
            const type = trade.type || trade.Direction || "BUY";
            
            const entryPrice = trade.entry || trade.EntryPrice || trade.Entry || 0;
            const exitPrice = trade.exit || trade.ExitPrice || trade.Exit || 0;
            
            // Fixed: Now reads "TargetPoint" from your data
            const tp = trade.tp || trade.TakeProfit || trade.TP || trade.TargetPoint || 0;
            const sl = trade.sl || trade.StopLoss || trade.SL || 0;
            
            // Fixed: Now reads "VolumeLot" from your data
            const volume = trade.volume || trade.Volume || trade.Size || trade.VolumeLot || 0;
            
            const dateTime = trade.date || trade.DateTime || trade.Date || "N/A";
            
            const activeTag = trade.tag || null;

            return (
              <div
                key={index}
                className={`glass-panel p-5 flex flex-col md:flex-row md:items-center justify-between border shadow-xl rounded-xl transition-all duration-300 relative ${
                  openDropdownIndex === index 
                    ? 'z-30 border-blue-500/30 bg-[#121826]' 
                    : 'z-10 border-gray-800/40 bg-gradient-to-b from-white/[0.01] to-transparent hover:border-gray-700/30'
                }`}
              >
                {/* 1. LEFT: ASSET / DIRECTION / TIME */}
                <div className="flex items-center space-x-4 mb-4 md:mb-0 shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border ${getIconStyle(asset)}`}>
                    {getIconChar(asset)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-base font-bold text-white tracking-tight">{asset}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold tracking-wider uppercase border ${
                        type.toUpperCase() === 'BUY' || type.toUpperCase() === 'LONG'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                      }`}>
                        {type}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono block mt-0.5">{dateTime}</span>
                  </div>
                </div>

                {/* 2. MIDDLE: CORE STATS GRID */}
                <div className="grid grid-cols-3 md:flex md:items-center gap-x-4 gap-y-3 mb-4 md:mb-0 grow md:justify-center md:px-8">
                  {/* Entry */}
                  <div className="flex flex-col md:w-20">
                    <span className="text-[9px] text-gray-500 font-bold tracking-widest uppercase mb-0.5">ENTRY</span>
                    <span className="text-xs font-semibold font-mono text-gray-300">
                      {entryPrice ? `$${parseFloat(entryPrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '—'}
                    </span>
                  </div>

                  {/* Exit */}
                  <div className="flex flex-col md:w-20">
                    <span className="text-[9px] text-gray-500 font-bold tracking-widest uppercase mb-0.5">EXIT</span>
                    <span className="text-xs font-semibold font-mono text-gray-300">
                      {exitPrice ? `$${parseFloat(exitPrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '—'}
                    </span>
                  </div>

                  {/* TP */}
                  <div className="flex flex-col md:w-20">
                    <span className="text-[9px] text-gray-500 font-bold tracking-widest uppercase mb-0.5">TP</span>
                    <span className="text-xs font-semibold font-mono text-green-400/90">
                      {tp ? `$${parseFloat(tp).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '—'}
                    </span>
                  </div>

                  {/* SL */}
                  <div className="flex flex-col md:w-20">
                    <span className="text-[9px] text-gray-500 font-bold tracking-widest uppercase mb-0.5">SL</span>
                    <span className="text-xs font-semibold font-mono text-red-400/90">
                      {sl ? `$${parseFloat(sl).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '—'}
                    </span>
                  </div>

                  {/* Volume */}
                  <div className="flex flex-col md:w-24">
                    <span className="text-[9px] text-gray-500 font-bold tracking-widest uppercase mb-0.5">VOLUME</span>
                    <span className="text-xs font-semibold font-mono text-gray-300">
                      {volume ? `${parseFloat(volume).toLocaleString()}${getVolumeUnit(asset)}` : '—'}
                    </span>
                  </div>

                  {/* Fee */}
                  <div className="flex flex-col md:w-20">
                    <span className="text-[9px] text-gray-500 font-bold tracking-widest uppercase mb-0.5">FEE</span>
                    <span className="text-xs font-semibold font-mono text-gray-500">
                      ${fee.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* 3. RIGHT: RESULT & DYNAMIC TAG DROPDOWN */}
                <div className="flex items-center space-x-6 min-w-[200px] justify-between md:justify-end shrink-0 border-t border-gray-800/40 md:border-t-0 pt-3 md:pt-0">
                  {/* Result */}
                  <div className="flex flex-col md:items-end">
                    <span className="text-[9px] text-gray-500 font-bold tracking-widest uppercase mb-0.5">RESULT</span>
                    <span className={`text-base font-bold font-mono tracking-tight ${pnl >= 0 ? 'text-[#10B981]' : 'text-red-400'}`}>
                      {pnl >= 0 ? '+' : ''}${pnl.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  {/* Interactive Tags */}
                  <div className="relative">
                    <button
                      onClick={(e) => toggleDropdown(e, index)}
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold tracking-widest uppercase border transition-all duration-200 cursor-pointer ${getTagBadgeStyle(activeTag)}`}
                    >
                      {activeTag || '—'}
                    </button>

                    {/* Popover Dropdown */}
                    {openDropdownIndex === index && (
                      <div 
                        className="absolute right-0 mt-2 w-36 bg-[#0F1420] border border-gray-800/80 rounded-xl shadow-2xl p-1.5 z-50 flex flex-col gap-0.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="text-[8px] text-gray-500 font-extrabold tracking-widest uppercase px-2.5 py-1 border-b border-gray-800/50 mb-1">
                          SELECT TAG
                        </div>
                        
                        <button
                          onClick={() => handleTagChange(index, 'STRATEGY')}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-[9px] font-extrabold tracking-widest uppercase text-[#10B981] hover:bg-[#10B981]/10 transition-colors"
                        >
                          STRATEGY
                        </button>

                        <button
                          onClick={() => handleTagChange(index, 'REVENGE')}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-[9px] font-extrabold tracking-widest uppercase text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          REVENGE
                        </button>

                        <button
                          onClick={() => handleTagChange(index, 'NEWS')}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-[9px] font-extrabold tracking-widest uppercase text-white hover:bg-white/10 transition-colors"
                        >
                          NEWS
                        </button>

                        <button
                          onClick={() => handleTagChange(index, 'EMOTION')}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-[9px] font-extrabold tracking-widest uppercase text-yellow-400 hover:bg-yellow-500/10 transition-colors"
                        >
                          EMOTION
                        </button>

                        <button
                          onClick={() => handleTagChange(index, null)}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-[8px] font-bold tracking-widest uppercase text-gray-500 hover:bg-gray-800/30 transition-colors border-t border-gray-800/50 mt-1"
                        >
                          CLEAR TAG
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            );
          })
        ) : (
          <div className="glass-panel p-6 flex flex-col items-center justify-center py-16 opacity-40 text-center border-dashed border-gray-800 rounded-xl bg-white/[0.01]">
            <span className="text-4xl mb-4">📓</span>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-1">LEDGER IS EMPTY</h3>
            <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
              No trading data found. Head back to the dashboard and upload your trade history file to sync.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}