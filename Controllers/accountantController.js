// mathematical for Nominal vs. fee Drain Analysis
export const calculateFeeDrain = (tradesArray) => {
    let totalFees = 0;
    let grossPnL = 0;
    const startingBalance = 2000; // baseline account Balance $2K

    // loop through the array from router
    const journalHistory = tradesArray.map(trade => {

        const pnl = parseFloat(trade.profitOrLoss || trade.PnL || 0 );
        const fee = parseFloat(trade.fee || trade.commission || 0 );

        grossPnL += pnl;
        totalFees += fee;

        // tag is exist or upload file, defualt tag
        const existingTag = trade.psychologyTag || trade.tag || "";

        // return clean mapped Obj for Automatic Trading Journal
        return { 
            dateTime: trade.dateTime || trade.date || new Date().toISOString(),
            assetName: trade.assetName || trade.name || "Unknown",
            entryPrice: parseFloat(trade.entryPrice || 0),
            exitPrice: parseFloat(trade.exitPrice || 0 ),
            stopLoss: parseFloat(trade.stopLoss || trade.SL || 0 ),
            takingProfit: parseFloat(trade.takingProfit || trade.TP || 0 ),
            positionSize: parseFloat(trade.positionSize || trade.size || 0 ),
            pnl: pnl - fee,
            feePaid: fee,
            psychologyTag: existingTag,
            tagColor: getTagColor(existingTag)
        }
    });

    const netPnL = grossPnL - totalFees;
    const endingBalance = startingBalance + netPnL;

    return { 
        startingBalance,
        endingBalance,
        grossEarnings: startingBalance + grossPnL,
        totalFeesDeducted: totalFees,
        totalTrades: tradesArray.length
    };
};