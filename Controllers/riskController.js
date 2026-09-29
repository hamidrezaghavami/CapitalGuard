export const calculateDistanceToDanger = (tradesArray) => {
    let totalLosingTrades = 0;
    let rulesBrokenTrades = 0;

    tradesArray.forEach(trade => {
        // 1. Calculate TRUE net PnL including hidden fees
        const rawPnl = parseFloat(trade.pnl || trade.ResultUSD || 0);
        const fee = parseFloat(trade.feePaid || trade.fee || trade.commission || 0);
        const netPnL = rawPnl - fee;

        const entryPrice = parseFloat(trade.entryPrice || trade.EntryPrice || 0);
        const exitPrice = parseFloat(trade.exitPrice || trade.ExitPrice || 0);
        const stopLoss = parseFloat(trade.stopLoss || trade.StopLoss || trade.SL || 0);
        
        // Skip winning trades based on NET result
        if (netPnL >= 0) return;
        
        totalLosingTrades += 1;
        
        // 2. Immediate rule break: Trading without a Stop Loss
        if (stopLoss === 0) {
            rulesBrokenTrades += 1;
            return;
        }

        const plannedRisk = Math.abs(entryPrice - stopLoss);
        const actualLoss = Math.abs(entryPrice - exitPrice);

        // 3. Rule break: Market went further against you than your SL allowed
        if (actualLoss > plannedRisk) {
            rulesBrokenTrades += 1;
        }
    });

    const disciplineScore = totalLosingTrades > 0
        ? ((totalLosingTrades - rulesBrokenTrades) / totalLosingTrades) * 100 
        : 100;

    return { 
        totalLosingTrades,
        disciplineScore: Math.round(disciplineScore)
    };
};

// Pull-Back / Stop-Loss Triggers calculation 
export const calculatePsychologicalDrawdown = (tradesArray) => {
    const tagCounts = { strategic: 0, greed: 0, fear: 0, fomo: 0, revenge: 0 };
    const tagLosses = { strategic: 0, greed: 0, fear: 0, fomo: 0, revenge: 0 };
    let totalCashLoss = 0;

    tradesArray.forEach(trade => {
        const rawPnl = parseFloat(trade.pnl || trade.ResultUSD || 0);
        const fee = parseFloat(trade.feePaid || trade.fee || trade.commission || 0);
        const netPnL = rawPnl - fee;

        if (netPnL >= 0) return;

        totalCashLoss += Math.abs(netPnL);

        const tag = trade.psychologyTag ? trade.psychologyTag.trim().toLowerCase() : "";

        if (tagCounts.hasOwnProperty(tag)) { 
            tagCounts[tag] += 1;
            tagLosses[tag] += Math.abs(netPnL);
        }
    }); 
    
    let dominantEmotion = "none";
    let maxEmotionLoss = 0;

    for (const tag in tagLosses) {
        if (tag === "strategic") continue;
        if (tagLosses[tag] > maxEmotionLoss) { 
            maxEmotionLoss = tagLosses[tag];
            dominantEmotion = tag;
        }
    }

    const emotionalLossTrade = totalCashLoss - tagLosses.strategic;
    const haltTradingWarning = totalCashLoss > 0 && (emotionalLossTrade / totalCashLoss) > 0.50;
    
    return { 
        tagCounts,
        tagLosses,
        totalCashLoss: Math.round(totalCashLoss),
        dominantEmotion,
        haltTradingWarning
    };
};

// NEW: This drives the middle "PORTFOLIO VULNERABILITY" card
export const calculatePortfolioVulnerability = (tradesArray, initialBalance = 2000) => {
    const startingBalance = parseFloat(initialBalance) || 2000;
    let maxSingleLoss = 0;
    let currentEquity = startingBalance;

    tradesArray.forEach(trade => {
        const rawPnl = parseFloat(trade.pnl || trade.ResultUSD || 0);
        const fee = parseFloat(trade.feePaid || trade.fee || trade.commission || 0);
        const netTrade = rawPnl - fee;
        
        currentEquity += netTrade;

        if (netTrade < 0 && Math.abs(netTrade) > maxSingleLoss) {
            maxSingleLoss = Math.abs(netTrade);
        }
    });

    // Vulnerability: What % of your starting capital did your worst trade wipe out?
    const portfolioVulnerability = startingBalance > 0 
        ? (maxSingleLoss / startingBalance) * 100 
        : 0;

    // Capital Bleed: Overall % drawdown from the starting balance
    const netPnL = currentEquity - startingBalance;
    const maximumCapitalBleed = netPnL < 0 
        ? (Math.abs(netPnL) / startingBalance) * 100 
        : 0;

    // Margin Call Prob: Spikes heavily if a single trade risks more than 5%
    const marginCallProbability = portfolioVulnerability > 5 
        ? portfolioVulnerability * 1.5 
        : portfolioVulnerability;

    // Status shifts to DANGER if drawdown exceeds 20% or single trade risk exceeds 5%
    const status = portfolioVulnerability > 5 || maximumCapitalBleed > 20 
        ? "DANGER" 
        : "SAFE";

    return {
        portfolioVulnerability: parseFloat(portfolioVulnerability.toFixed(2)),
        maximumCapitalBleed: parseFloat(maximumCapitalBleed.toFixed(2)),
        marginCallProbability: Math.min(parseFloat(marginCallProbability.toFixed(2)), 99.99),
        status: status
    };
};