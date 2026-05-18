/*takes any messy exchange file and strictly 
translates it into your single CapitalGuard schema before 
the math engines touch it. */

const normalizeTrade = (rawTrade) => { 
    return { 
        entryPrice: parseFloat(rawTrade.entryPrice || rawTrade.Exec_Price || rawTrade.Px || 0),

        pnl: parseFloat(rawTrade.PnL || rawTrade.profit || rawTrade.realizedPnL || 0),

        fee: parseFloat(rawTrade.fee || rawTrade.comission || rawTrade.feePaid || 0),

        assetName: rawTrade.symbol || rawTrade.ticker || rawTrade.asset || "Unknown"
    };
};