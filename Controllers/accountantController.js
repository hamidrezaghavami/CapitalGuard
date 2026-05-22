// mathematical for Nominal vs. fee Drain Analysis
// mathematical for Nominal vs. fee Drain Analysis
export const calculateFeeDrain = (tradesArray) => {
    let totalFees = 0;
    let grossPnL = 0;
    
    // Tracking variables for Win Rate and Profit Factor
    let grossProfitOnly = 0;
    let grossLossOnly = 0;
    let winningTrades = 0;
    
    const startingBalance = 0;

    // loop through the array from router
    const journalHistory = tradesArray.map(trade => {

        // FIXED: Added 'ResultUSD' to the OR statement so it catches your AI file!
        const pnl = parseFloat(trade.profitOrLoss || trade.PnL || trade.ResultUSD || 0 );
        const fee = parseFloat(trade.fee || trade.commission || 0 );

        grossPnL += pnl;
        totalFees += fee;

        // NEW: Calculate wins/losses for advanced metrics
        if (pnl > 0) {
            grossProfitOnly += pnl;
            winningTrades++;
        } else if (pnl < 0) {
            grossLossOnly += Math.abs(pnl);
        }

        // tag is exist or upload file, defualt tag
        const existingTag = trade.psychologyTag || trade.tag || "";

        // return clean mapped Obj for Automatic Trading Journal
        return { 
            dateTime: trade.dateTime || trade.date || trade.DateTime || new Date().toISOString(),
            assetName: trade.assetName || trade.name || trade.Symbol || "Unknown",
            entryPrice: parseFloat(trade.entryPrice || trade.EntryPrice || 0),
            exitPrice: parseFloat(trade.exitPrice || trade.ExitPrice || 0 ),
            stopLoss: parseFloat(trade.stopLoss || trade.SL || trade.StopLoss || 0 ),
            takingProfit: parseFloat(trade.takingProfit || trade.TP || trade.TargetPoint || 0 ),
            positionSize: parseFloat(trade.positionSize || trade.size || trade.VolumeLot || 0 ),
            pnl: pnl - fee,
            feePaid: fee,
            psychologyTag: existingTag,
        }
    });

    const netPnL = grossPnL - totalFees;
    const endingBalance = startingBalance + netPnL;
    
    // NEW: Calculate the final ratios
    const winRate = tradesArray.length > 0 ? ((winningTrades / tradesArray.length) * 100).toFixed(1) : 0;
    const profitFactor = grossLossOnly > 0 ? (grossProfitOnly / grossLossOnly).toFixed(2) : "∞";

    return { 
        startingBalance,
        endingBalance,
        grossEarnings: startingBalance + grossPnL,
        totalFeesDeducted: totalFees,
        totalTrades: tradesArray.length,
        // NEW: Export these EXACT names so React can instantly show them!
        totalProfit: netPnL,
        winRate: winRate,
        profitFactor: profitFactor
    };
};