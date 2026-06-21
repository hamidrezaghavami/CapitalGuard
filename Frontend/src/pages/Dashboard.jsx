import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function Dashboard() {
  const [isDragging, setIsDragging] = useState(false);
  const [startingBalance, setStartingBalance] = useState(""); 
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { getToken } = useAuth();
  
  const [metrics, setMetrics] = useState({
    totalProfit: 0.00, winRate: 0.0, totalTrades: 0, profitFactor: 0.0,
    marginCallProb: 0.0, maxCapitalBleed: 0.0, portfolioVulnerability: 100, riskStatus: "SAFE",
    daysUntilLiquidation: 0, burnRate: 0, longevityStatus: "Active"
  });

  const [chartData, setChartData] = useState([]);
  const [chartStartLine, setChartStartLine] = useState(0);

  useEffect(() => {
    const cachedTrades = localStorage.getItem("capitalGuard_trades");
    const cachedAnalytics = localStorage.getItem("capitalGuard_analytics");
    const cachedBalance = localStorage.getItem("capitalGuard_balance");

    if (cachedTrades && cachedAnalytics && cachedBalance) {
      const trades = JSON.parse(cachedTrades);
      const analytics = JSON.parse(cachedAnalytics);
      const baseBalance = parseFloat(cachedBalance);
      
      setChartStartLine(baseBalance);
      setStartingBalance(cachedBalance);

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
        let runningBalance = baseBalance;
        const curveData = [];
        curveData.push({ tradeNumber: 0, equity: baseBalance });

        trades.forEach((trade, index) => {
          const pnl = parseFloat(trade.pnl || trade.ResultUSD || trade.profitOrLoss || 0);
          const fee = parseFloat(trade.feePaid || trade.fee || trade.commission || 0);
          runningBalance += (pnl - fee);
          curveData.push({ tradeNumber: index + 1, equity: parseFloat(runningBalance.toFixed(2)) });
        });
        setChartData(curveData);
      }
    }
  }, []);

  const processFile = async (file) => {
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
        alert("File too large! Please upload a trade history file smaller than 2MB.");
        setIsLoading(false);
        return;
    }

    const formData = new FormData();
    formData.append("tradingLog", file);
    formData.append("startingBalance", startingBalance);

    try {
      const token = await getToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/accountants/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) throw new Error("Backend rejected the file!");

      const backendData = await response.json();
      const analytics = backendData.analytics;
      const baseBalance = parseFloat(backendData.startingBalance || startingBalance);

      setChartStartLine(baseBalance);

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

      let runningBalance = baseBalance;
      const curveData = [];
      curveData.push({ tradeNumber: 0, equity: baseBalance });

      if (backendData.trades && backendData.trades.length > 0) {
        backendData.trades.forEach((trade, index) => {
          const pnl = parseFloat(trade.pnl || trade.ResultUSD || trade.profitOrLoss || 0);
          const fee = parseFloat(trade.feePaid || trade.fee || trade.commission || 0);
          runningBalance += (pnl - fee);
          curveData.push({ tradeNumber: index + 1, equity: parseFloat(runningBalance.toFixed(2)) });
        });

        setChartData(curveData);
        localStorage.setItem("capitalGuard_trades", JSON.stringify(backendData.trades));
        localStorage.setItem("capitalGuard_analytics", JSON.stringify(analytics));
        localStorage.setItem("capitalGuard_balance", baseBalance.toString());
      }
      
      setSelectedFile(null);
      setIsLoading(false);

    } catch (err) {
      console.error("Error uploading to backend:", err);
      alert("Failed to connect to backend. Make sure your app.js is running!");
      setIsLoading(false);
    }
  };

  const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const onDrop = (e) => { e.preventDefault(); setIsDragging(false); const file = e.dataTransfer.files[0]; if (file) setSelectedFile(file); };
  const onFileSelect = (e) => { const file = e.target.files[0]; if (file) setSelectedFile(file); e.target.value = null; };

  const handleAnalyzeClick = async () => {
    // STRICT GUARD: Force them to enter a balance!
    if (!startingBalance || startingBalance.trim() === "") {
      alert("Please enter your exact starting balance first!");
      return;
    }
    
    if (!selectedFile) return;
    setIsLoading(true);
    await processFile(selectedFile);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const currentEquity = payload[0].value;
      const isProfit = currentEquity >= chartStartLine;
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
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Capital Guardian</h1>
        <p className="text-muted">Your dedicated accountant, risk manager, and financial forecaster.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 relative overflow-hidden group border border-[#10B981]/20 shadow-[0_0_30px_rgba(16,185,129,0.15)] bg-gradient-to-b from-[#10B981]/[0.03] to-transparent">
          <div className="absolute top-0 right-0 bg-[#10B981]/10 px-3 py-1 rounded-bl-lg text-[10px] text-[#10B981] font-mono uppercase border-b border-l border-[#10B981]/20">THE-ACCOUNTANT</div>
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-1">THE ACCOUNTANT</h3>
          <p className="text-xs text-muted mb-6">Real-time trading analytics</p>
          <div className={`text-4xl font-bold mb-8 tracking-tight ${metrics.totalProfit >= 0 ? 'text-white' : 'text-red-400'}`}>
            {metrics.totalProfit < 0 ? '-' : ''}${Math.abs(metrics.totalProfit).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm"><span className="text-muted">Win Rate</span><span className="font-mono text-white">{metrics.winRate}%</span></div>
            <div className="w-full h-[1px] bg-[#1F2937]" />
            <div className="flex justify-between items-center text-sm"><span className="text-muted">Total Trade Volume</span><span className="font-mono text-white">{metrics.totalTrades} Executed</span></div>
            <div className="w-full h-[1px] bg-[#1F2937]" />
            <div className="flex justify-between items-center text-sm"><span className="text-muted">Profit Factor</span><span className="font-mono text-white">{metrics.profitFactor}</span></div>
          </div>
        </div>

        <div className="glass-panel p-6 relative overflow-hidden group border border-[#3B82F6]/20 shadow-[0_0_30px_rgba(59,130,246,0.05)] bg-gradient-to-b from-[#3B82F6]/[0.03] to-transparent">
          <div className="absolute top-0 right-0 bg-[#3B82F6]/10 px-3 py-1 rounded-bl-lg text-[10px] text-[#3B82F6] font-mono uppercase border-b border-l border-[#3B82F6]/20">RISK-MANAGER</div>
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-1">PORTFOLIO VULNERABILITY</h3>
          <p className="text-xs text-muted mb-6">Measures the risk of a single over-leveraged trade wiping your capital.</p>
          <div className="text-4xl font-bold text-white mb-6 tracking-tight">{metrics.portfolioVulnerability}%</div>
          <div className="flex justify-center mb-6">
            <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)] ${metrics.portfolioVulnerability > 50 ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'border-[#3B82F6]'}`}>
               <span className={`text-[10px] font-bold tracking-widest uppercase ${metrics.portfolioVulnerability > 50 ? 'text-red-400' : 'text-white'}`}>{metrics.riskStatus}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm"><span className="text-muted">Maximum Capital Bleed</span><span className="font-mono text-white">{metrics.maxCapitalBleed}%</span></div>
            <div className="w-full h-[1px] bg-[#1F2937]" />
            <div className="flex justify-between items-center text-sm"><span className="text-muted">Margin Call Probability</span><span className="font-mono text-white">{metrics.marginCallProb}%</span></div>
          </div>
        </div>

        <div className="glass-panel p-6 relative overflow-hidden group border border-[#EF4444]/20 shadow-[0_0_30px_rgba(239,68,68,0.05)] bg-gradient-to-b from-[#EF4444]/[0.03] to-transparent">
          <div className="absolute top-0 right-0 bg-[#EF4444]/10 px-3 py-1 rounded-bl-lg text-[10px] text-[#EF4444] font-mono uppercase border-b border-l border-[#EF4444]/20">THE-FORECASTER</div>
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-1">DAYS UNTIL LIQUIDATION</h3>
          <p className="text-xs text-muted mb-6">Projects your exact survival timeline based on capital bleed and trading fees.</p>
          <div className="text-4xl font-bold text-white mb-8 tracking-tight">{metrics.daysUntilLiquidation === "Infinite" ? "∞" : metrics.daysUntilLiquidation} <span className="text-xl text-gray-400">Days</span></div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm"><span className="text-muted">Burn Rate</span><span className="font-mono text-white">${metrics.burnRate}/mo</span></div>
            <div className="w-full h-[1px] bg-[#1F2937]" />
            <div className="flex justify-between items-center text-sm"><span className="text-muted">Cash Flow Deficit</span><span className="font-mono text-white">${metrics.totalProfit < 0 ? Math.abs(metrics.totalProfit).toFixed(2) : "0.00"}</span></div>
            <div className="w-full h-[1px] bg-[#1F2937]" />
            <div className="flex justify-between items-center text-sm"><span className="text-muted">Longevity Status</span><span className={`font-mono ${metrics.longevityStatus === 'ACCOUNT BLOWN' ? 'text-red-500' : 'text-gray-500'}`}>{metrics.longevityStatus}</span></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        <div className="lg:col-span-1 flex flex-col">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2">DROP YOUR TRADE HISTORY</h3>
          <p className="text-xs text-muted mb-4 leading-relaxed">
            Export your last 50 trades from your broker, enter what your starting balance was at that time, and drop the file below.
          </p>

          <div className="mb-4">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Starting Balance ($)</label>
            <input 
              type="number" 
              value={startingBalance}
              onChange={(e) => setStartingBalance(e.target.value)}
              className="w-full bg-[#131A28] border border-[#1F2937] text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#3B82F6] font-mono transition-all shadow-inner"
              placeholder="Enter exact balance, or your best guess!"
            />
          </div>
          
          {!selectedFile ? (
            <label 
              htmlFor="mobile-upload" onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
              className={`flex-1 min-h-[160px] rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-6 transition-all cursor-pointer ${
                isDragging ? 'border-[#3B82F6] bg-[#3B82F6]/10' : 'border-[#1F2937] bg-[#131A28] hover:border-[#3B82F6]/50 hover:bg-[#1C263A]'
              }`}
            >
              <input type="file" id="mobile-upload" className="hidden" accept=".csv,.json" onChange={onFileSelect}/>
              <div className="text-4xl mb-3">📤</div>
              <p className="text-sm font-bold text-white mb-1">Upload File</p>
              <p className="text-xs text-muted text-center">CSV/JSON (Max 2MB)</p>
            </label>
          ) : (
            <div className="flex-1 min-h-[160px] rounded-xl border-2 border-[#10B981] bg-[#10B981]/10 flex flex-col items-center justify-center p-6 transition-all">
              <div className="text-4xl mb-2">✅</div>
              <p className="text-sm font-bold text-white mb-1">File Ready!</p>
              <p className="text-xs text-[#10B981] mb-5 max-w-[200px] truncate">{selectedFile.name}</p>
              
              <button 
                onClick={handleAnalyzeClick} 
                disabled={isLoading}
                className="bg-[#3B82F6] hover:bg-[#2563EB] disabled:bg-[#1D4ED8] text-white font-bold py-2.5 px-6 rounded-lg transition-all flex items-center justify-center min-w-[160px] shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing...</span>
                  </div>
                ) : (
                  "Analyze Now"
                )}
              </button>

              {!isLoading && (
                <button 
                  onClick={() => setSelectedFile(null)} 
                  className="text-[10px] font-bold text-gray-500 hover:text-white mt-4 tracking-wider uppercase transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 flex flex-col">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2">Capital Longevity Graph</h3>
          <p className="text-xs text-muted mb-6 leading-relaxed">Your real-time Capital curve showing your trade performance.</p>
          <div className="flex-1 glass-panel flex flex-col p-6 min-h-[250px] relative">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 15, right: 15, left: 15, bottom: 5 }}>
                  <XAxis dataKey="tradeNumber" hide={true} />
                  <YAxis domain={['auto', 'auto']} stroke="#9CA3AF" fontSize={10} width={70} tickMargin={8} tickFormatter={(value) => `$${value}`} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3B82F6', strokeWidth: 1, strokeDasharray: '5 5' }} />
                  <ReferenceLine y={chartStartLine} stroke="#EF4444" strokeDasharray="3 3" opacity={0.5} />
                  <Line type="monotone" dataKey="equity" stroke="#3B82F6" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#F59E0B', stroke: '#FFFFFF', strokeWidth: 2 }} animationDuration={1500}/>
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