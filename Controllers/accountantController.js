// mathematical for Nominal vs. fee Drain Analysis
export const calculateFeeDrain = (tradesArray, initialBalance = 2000) => {
    let totalFees = 0;
    let grossPnL = 0;
    let grossProfitOnly = 0;
    let grossLossOnly = 0;
    let winningTrades = 0;
    
    const startingBalance = parseFloat(initialBalance) || 2000;
    let currentEquity = startingBalance;
    const equityCurve = [currentEquity];

    const journalHistory = tradesArray.map(trade => {
        // Use ?? to safely handle exact $0.00 trades
        const pnl = parseFloat(trade.pnl ?? trade.profitOrLoss ?? trade.PnL ?? trade.ResultUSD ?? 0);
        const fee = parseFloat(trade.fee ?? trade.commission ?? trade.feePaid ?? 0);
        
        const netTradePnL = pnl - fee;
        grossPnL += pnl;
        totalFees += fee;

        if (netTradePnL > 0) {
            grossProfitOnly += netTradePnL;
            winningTrades++;
        } else if (netTradePnL < 0) {
            grossLossOnly += Math.abs(netTradePnL);
        }
        
        currentEquity += netTradePnL;
        equityCurve.push(currentEquity);

        return { 
            dateTime: trade.entry_date || trade.dateTime || trade.date || trade.DateTime || new Date().toISOString(),
            assetName: trade.symbol || trade.assetName || trade.name || "Unknown",
            entryPrice: parseFloat(trade.entry_price || trade.entryPrice || 0),
            exitPrice: parseFloat(trade.exit_price || trade.exitPrice || 0),
            stopLoss: parseFloat(trade.sl || trade.stopLoss || trade.SL || 0),
            takingProfit: parseFloat(trade.tp || trade.takingProfit || trade.TP || 0),
            positionSize: parseFloat(trade.volume || trade.positionSize || trade.size || 0),
            pnl: netTradePnL,
            feePaid: fee,
            psychologyTag: trade.psychologyTag || trade.tag || "",
        }
    });

    const netPnL = grossPnL - totalFees;
    
    const winRate = tradesArray.length > 0 ? parseFloat(((winningTrades / tradesArray.length) * 100).toFixed(1)) : 0;
    // RESTORED: Profit Factor calculation
    const profitFactor = grossLossOnly > 0 ? parseFloat((grossProfitOnly / grossLossOnly).toFixed(2)) : (grossProfitOnly > 0 ? 99.99 : 0);

    return { 
        startingBalance,
        endingBalance: startingBalance + netPnL,
        grossEarnings: startingBalance + grossPnL,
        totalFeesDeducted: totalFees,
        totalTrades: tradesArray.length,
        totalProfit: netPnL,
        winRate: winRate,
        profitFactor: profitFactor,
        equityCurve: equityCurve,          
        journalHistory: journalHistory     
    };
};