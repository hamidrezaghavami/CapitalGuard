import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function Dashboard() {
  const [isDragging, setIsDragging] = useState(false);
  const { getToken } = useAuth();
  
  const [metrics, setMetrics] = useState({
    // The Accountant
    totalProfit: 0.00,
    winRate: 0.0,
    totalTrades: 0,
    profitFactor: 0.0,
    // Risk Manager
    marginCallProb: 0.0,
    maxCapitalBleed: 0.0,
    portfolioVulnerability: 100, 
    riskStatus: "SAFE",
    // Forecaster
    daysUntilLiquidation: 0,
    burnRate: 0,
    longevityStatus: "Active"
  });

  const [chartData, setChartData] = useState([]);

  // Load saved data when returning to Dashboard
  useEffect(() => {
    const cachedTrades = localStorage.getItem("capitalGuard_trades");
    const cachedAnalytics = localStorage.getItem("capitalGuard_analytics");

    if (cachedTrades && cachedAnalytics) {
      const trades = JSON.parse(cachedTrades);
      const analytics = JSON.parse(cachedAnalytics);

      setMetrics({
        totalProfit: analytics.accountant?.totalProfit || 0,
        winRate: analytics.accountant?.winRate || 0,
        totalTrades: analytics.accountant?.totalTrades || 0,
        profitFactor: analytics.accountant?.profitFactor || 0,
        
        marginCallProb: analytics.forecaster?.riskOfRuin?.riskOfRuinPercent || 0,
        maxCapitalBleed: 100 - (analytics.riskOfficer?.distanceToDanger?.disciplineScore || 100),
        portfolioVulnerability: analytics.forecaster?.riskOfRuin?.riskOfRuinPercent || 0,
        riskStatus: analytics.forecaster?.riskOfRuin?.status || "SAFE",
        
        daysUntilLiquidation: analytics.forecaster?.runway?.survivalRunway || 0,
        burnRate: analytics.forecaster?.runway?.averageLoss || 0,
        longevityStatus: analytics.forecaster?.runway?.status || "Active"
      });

      if (trades && trades.length > 0) {
        let runningBalance = 2000;
        const curveData = [];
        curveData.push({ tradeNumber: 0, equity: 2000 });

        trades.forEach((trade, index) => {
          const pnl = parseFloat(trade.pnl || trade.ResultUSD || trade.profitOrLoss || 0);
          const fee = parseFloat(trade.feePaid || trade.fee || trade.commission || 0);
          
          runningBalance += (pnl - fee);

          curveData.push({
            tradeNumber: index + 1,
            equity: parseFloat(runningBalance.toFixed(2))
          });
        });

        setChartData(curveData);
      }
    }
  }, []);

  // --- NEW: Reusable File Upload Logic for both Drop & Mobile Tap ---
  const processFile = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("tradingLog", file);

    try {
      const token = await getToken();

      const response = await fetch("http://localhost:3000/api/accountants/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Backend rejected the file!");
      }

      const backendData = await response.json();
      const analytics = backendData.analytics;

      // Update State
      setMetrics({
        totalProfit: analytics.accountant?.totalProfit || 0,
        winRate: analytics.accountant?.winRate || 0,
        totalTrades: analytics.accountant?.totalTrades || 0,
        profitFactor: analytics.accountant?.profitFactor || 0,
        
        marginCallProb: analytics.forecaster?.riskOfRuin?.riskOfRuinPercent || 0,
        maxCapitalBleed: 100 - (analytics.riskOfficer?.distanceToDanger?.disciplineScore || 100),
        portfolioVulnerability: analytics.forecaster?.riskOfRuin?.riskOfRuinPercent || 0,
        riskStatus: analytics.forecaster?.riskOfRuin?.status || "SAFE",
        
        daysUntilLiquidation: analytics.forecaster?.runway?.survivalRunway || 0,
        burnRate: analytics.forecaster?.runway?.averageLoss || 0,
        longevityStatus: analytics.forecaster?.runway?.status || "Active"
      });

      // Build dynamic equity curve
      let runningBalance = 2000;
      const curveData = [];
      curveData.push({ tradeNumber: 0, equity: 2000 });

      if (backendData.trades && backendData.trades.length > 0) {
        backendData.trades.forEach((trade, index) => {
          const pnl = parseFloat(trade.pnl || trade.ResultUSD || trade.profitOrLoss || 0);
          const fee = parseFloat(trade.feePaid || trade.fee || trade.commission || 0);
          
          runningBalance += (pnl - fee);

          curveData.push({
            tradeNumber: index + 1,
            equity: parseFloat(runningBalance.toFixed(2))
          });
        });

        setChartData(curveData);

        // SAVE DATA TO LOCAL STORAGE
        localStorage.setItem("capitalGuard_trades", JSON.stringify(backendData.trades));
        localStorage.setItem("capitalGuard_analytics", JSON.stringify(analytics));
      }

    } catch (err) {
      console.error("Error uploading to backend:", err);
      alert("Failed to connect to backend. Make sure your app.js is running!");
    }
  };

  // Drag handlers
  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    await processFile(e.dataTransfer.files[0]);
  };

  // NEW: Mobile / Click handler
  const onFileSelect = async (e) => {
    await processFile(e.target.files[0]);
    e.target.value = null; // Reset input so they can upload the same file again if needed
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const currentEquity = payload[0].value;
      const isProfit = currentEquity >= 2000;
      
      return (
        <div className="bg-[#131A28] border border-[#1F2937] p-3 rounded-lg shadow-xl backdrop-blur-md">
          <p className="text-xs text-muted mb-1 font-mono uppercase tracking-widest">Trade {payload[0].payload.tradeNumber}</p>
          <p className={`font-mono font-bold text-lg ${isProfit ? 'text-[#10B981]' : 'text-red-400'}`}>
            ${currentEquity.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-16">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
          Capital Guardian
        </h1>
        <p className="text-muted">
          Your dedicated accountant, risk manager, and financial forecaster.
        </p>
      </div>

      {/* METRIC CARDS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* CARD 1: THE ACCOUNTANT */}
        <div className="glass-panel p-6 relative overflow-hidden group border border-[#10B981]/20 shadow-[0_0_30px_rgba(16,185,129,0.15)] bg-gradient-to-b from-[#10B981]/[0.03] to-transparent">
          <div className="absolute top-0 right-0 bg-[#10B981]/10 px-3 py-1 rounded-bl-lg text-[10px] text-[#10B981] font-mono uppercase border-b border-l border-[#10B981]/20">
            THE-ACCOUNTANT
          </div>
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-1">THE ACCOUNTANT</h3>
          <p className="text-xs text-muted mb-6">Real-time trading analytics</p>
          
          <div className={`text-4xl font-bold mb-8 tracking-tight ${metrics.totalProfit >= 0 ? 'text-white' : 'text-red-400'}`}>
            {metrics.totalProfit < 0 ? '-' : ''}${Math.abs(metrics.totalProfit).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted">Win Rate</span>
              <span className="font-mono text-white">{metrics.winRate}%</span>
            </div>
            <div className="w-full h-[1px] bg-[#1F2937]" />
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted">Total Trade Volume</span>
              <span className="font-mono text-white">{metrics.totalTrades} Executed</span>
            </div>
            <div className="w-full h-[1px] bg-[#1F2937]" />
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted">Profit Factor</span>
              <span className="font-mono text-white">{metrics.profitFactor}</span>
            </div>
          </div>
        </div>

        {/* CARD 2: RISK MANAGER */}
        <div className="glass-panel p-6 relative overflow-hidden group border border-[#3B82F6]/20 shadow-[0_0_30px_rgba(59,130,246,0.05)] bg-gradient-to-b from-[#3B82F6]/[0.03] to-transparent">
          <div className="absolute top-0 right-0 bg-[#3B82F6]/10 px-3 py-1 rounded-bl-lg text-[10px] text-[#3B82F6] font-mono uppercase border-b border-l border-[#3B82F6]/20">
            RISK-MANAGER
          </div>
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-1">PORTFOLIO VULNERABILITY</h3>
          <p className="text-xs text-muted mb-6">Measures the risk of a single over-leveraged trade wiping your capital.</p>
          
          <div className="text-4xl font-bold text-white mb-6 tracking-tight">{metrics.portfolioVulnerability}%</div>
          
          <div className="flex justify-center mb-6">
            <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)] ${metrics.portfolioVulnerability > 50 ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'border-[#3B82F6]'}`}>
               <span className={`text-[10px] font-bold tracking-widest uppercase ${metrics.portfolioVulnerability > 50 ? 'text-red-400' : 'text-white'}`}>
                 {metrics.riskStatus}
               </span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted">Maximum Capital Bleed</span>
              <span className="font-mono text-white">{metrics.maxCapitalBleed}%</span>
            </div>
            <div className="w-full h-[1px] bg-[#1F2937]" />
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted">Margin Call Probability</span>
              <span className="font-mono text-white">{metrics.marginCallProb}%</span>
            </div>
          </div>
        </div>

        {/* CARD 3: THE FORECASTER */}
        <div className="glass-panel p-6 relative overflow-hidden group border border-[#EF4444]/20 shadow-[0_0_30px_rgba(239,68,68,0.05)] bg-gradient-to-b from-[#EF4444]/[0.03] to-transparent">
          <div className="absolute top-0 right-0 bg-[#EF4444]/10 px-3 py-1 rounded-bl-lg text-[10px] text-[#EF4444] font-mono uppercase border-b border-l border-[#EF4444]/20">
            THE-FORECASTER
          </div>
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-1">DAYS UNTIL LIQUIDATION</h3>
          <p className="text-xs text-muted mb-6">Projects your exact survival timeline based on capital bleed and trading fees.</p>
          
          <div className="text-4xl font-bold text-white mb-8 tracking-tight">
            {metrics.daysUntilLiquidation === "Infinite" ? "∞" : metrics.daysUntilLiquidation} <span className="text-xl text-gray-400">Days</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted">Burn Rate</span>
              <span className="font-mono text-white">${metrics.burnRate}/mo</span>
            </div>
            <div className="w-full h-[1px] bg-[#1F2937]" />
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted">Cash Flow Deficit</span>
              <span className="font-mono text-white">${metrics.totalProfit < 0 ? Math.abs(metrics.totalProfit).toFixed(2) : "0.00"}</span>
            </div>
            <div className="w-full h-[1px] bg-[#1F2937]" />
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted">Longevity Status</span>
              <span className={`font-mono ${metrics.longevityStatus === 'ACCOUNT BLOWN' ? 'text-red-500' : 'text-gray-500'}`}>{metrics.longevityStatus}</span>
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM ACTION & CHART ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        
        {/* NEW MOBILE-FRIENDLY UPLOAD ZONE */}
        <div className="lg:col-span-1 flex flex-col">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2">DROP YOUR TRADE HISTORY</h3>
          <p className="text-xs text-muted mb-6 leading-relaxed">
            Export your CSV or JSON from your broker or exchange and drop it here to begin the analysis.
          </p>
          
          <label 
            htmlFor="mobile-upload"
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`flex-1 min-h-[200px] rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-6 transition-all cursor-pointer ${
              isDragging 
                ? 'border-[#3B82F6] bg-[#3B82F6]/10' 
                : 'border-[#1F2937] bg-[#131A28] hover:border-[#3B82F6]/50 hover:bg-[#1C263A]'
            }`}
          >
            {/* Hidden Input that triggers when the box is tapped! */}
            <input 
              type="file" 
              id="mobile-upload" 
              className="hidden" 
              accept=".csv,.json" 
              onChange={onFileSelect}
            />
            
            <div className="text-4xl mb-3">📤</div>
            <p className="text-sm font-bold text-white mb-1">Upload Trade History</p>
            <p className="text-xs text-muted text-center">Tap or Drop CSV/JSON</p>
          </label>
        </div>

        {/* REAL DYNAMIC CHART ZONE */}
        <div className="lg:col-span-2 flex flex-col">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2">Capital Longevity Graph</h3>
          <p className="text-xs text-muted mb-6 leading-relaxed">
            Your real-time Capital curve. showing your trade performance.
          </p>
          
          <div className="flex-1 glass-panel flex flex-col p-6 min-h-[250px] relative">
            
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={chartData} 
                  margin={{ top: 15, right: 15, left: 15, bottom: 5 }}
                >
                  <XAxis dataKey="tradeNumber" hide={true} />
                  
                  <YAxis 
                    domain={['auto', 'auto']} 
                    stroke="#9CA3AF" 
                    fontSize={10}
                    width={70}
                    tickMargin={8}
                    tickFormatter={(value) => `$${value}`} 
                  />
                  
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3B82F6', strokeWidth: 1, strokeDasharray: '5 5' }} />
                  
                  <ReferenceLine y={2000} stroke="#EF4444" strokeDasharray="3 3" opacity={0.5} />
                  
                  <Line 
                    type="monotone" 
                    dataKey="equity" 
                    stroke="#3B82F6" 
                    strokeWidth={3} 
                    dot={false}
                    activeDot={{ r: 6, fill: '#F59E0B', stroke: '#FFFFFF', strokeWidth: 2 }}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center opacity-30">
                <p className="text-muted text-sm font-mono uppercase tracking-widest">Waiting for Trade Data...</p>
              </div>
            )}
            
          </div>
        </div>

      </div>
    </div>
  );
}