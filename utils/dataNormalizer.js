/*takes any messy exchange file and strictly 
translates it into your single CapitalGuard schema before 
the math engines touch it. */

export const normalizeTrade = (rawTrade) => { 
    return { 
        dateTime: rawTrade.entry_date || rawTrade.date || rawTrade.DateTime || new Date().toISOString(),
        assetName: rawTrade.symbol || rawTrade.ticker || rawTrade.asset || "Unknown",
        side: rawTrade.side || rawTrade.type || rawTrade.Direction || "BUY",
        entryPrice: parseFloat(rawTrade.entry_price || rawTrade.entryPrice || rawTrade.Exec_Price || 0),
        exitPrice: parseFloat(rawTrade.exit_price || rawTrade.exitPrice || rawTrade.ExitPrice || 0),
        stopLoss: parseFloat(rawTrade.sl || rawTrade.stopLoss || rawTrade.SL || 0),
        takingProfit: parseFloat(rawTrade.tp || rawTrade.takingProfit || rawTrade.TP || 0),
        positionSize: parseFloat(rawTrade.volume || rawTrade.size || rawTrade.VolumeLot || 0),
        pnl: parseFloat(rawTrade.pnl ?? rawTrade.PnL ?? rawTrade.profit ?? 0),
        fee: parseFloat(rawTrade.fee ?? rawTrade.commission ?? rawTrade.feePaid ?? 0),
        psychologyTag: rawTrade.tag || rawTrade.psychologyTag || ""
    };
};