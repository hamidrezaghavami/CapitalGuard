// Survival Runway Projections
/*
we see their latest balance acconut and simulate if their current position continue
what can happen to their account based on their winning/lossing performance.

considering we use "runningNetPnL" for track their real balance, people upload their
latest history of trades, their current balance may different from what we have 
this all is Statistical
*/

// mathematical for Time-based Survival Runway
export const calculateSurvivalRunway = (tradeArray, initialBalance = 2000) => {
    const startingBalance = parseFloat(initialBalance) || 2000;
    let runningNetPnL = 0;

    // 1. Date tracking to calculate an actual time-based daily burn
    let earliestDate = new Date();
    let latestDate = new Date(0);

    tradeArray.forEach(trade => {
        const pnl = parseFloat(trade.pnl || trade.ResultUSD || 0);
        const fee = parseFloat(trade.feePaid || trade.fee || trade.commission || 0);
        const netTrade = pnl - fee;
        
        runningNetPnL += netTrade;

        // 2. Find the total timeframe the CSV covers
        const tradeDate = new Date(trade.dateTime || trade.date || trade.DateTime || new Date());
        if (tradeDate < earliestDate) earliestDate = tradeDate;
        if (tradeDate > latestDate) latestDate = tradeDate;
    });

    const latestBalance = startingBalance + runningNetPnL;

    if (latestBalance <= 0) {
        return { 
            latestBalance: 0, 
            monthlyBurnRate: 0, 
            survivalRunway: 0, 
            status: "ACCOUNT BLOWN" 
        };
    }

    if (runningNetPnL >= 0) {
        return { 
            latestBalance: parseFloat(latestBalance.toFixed(2)), 
            monthlyBurnRate: 0, 
            survivalRunway: "Infinite", 
            status: "PROFITABLE" 
        };
    }

    // 3. Calculate actual time span of the trades
    const timeDiffMs = latestDate.getTime() - earliestDate.getTime();
    let daysSpan = timeDiffMs / (1000 * 3600 * 24);
    if (daysSpan < 1) daysSpan = 1; // Prevent division by zero if all trades are on day 1

    // 4. Core projection math based on TIME, replacing the trade-count logic
    const dailyBurnRate = Math.abs(runningNetPnL) / daysSpan;
    const monthlyBurnRate = dailyBurnRate * 30;
    const survivalRunwayDays = Math.floor(latestBalance / dailyBurnRate);

    return { 
        latestBalance: parseFloat(latestBalance.toFixed(2)), 
        monthlyBurnRate: parseFloat(monthlyBurnRate.toFixed(2)), 
        survivalRunway: survivalRunwayDays, // Now accurately outputs DAYS
        status: "ACTIVE" 
    };
};

// calculating Risk Of Ruin Statistical Modelling
export const calculateRiskOfRuin = (tradeArray, initialBalance = 2000) => {
    const startingBalance = parseFloat(initialBalance) || 2000;
    let winningTrades = 0;
    let losingTrades = 0;
    let totalLossAmount = 0;
    let runningNetPnL = 0;

    tradeArray.forEach(trade => {
        const pnl = parseFloat(trade.pnl || trade.ResultUSD || 0);
        const fee = parseFloat(trade.feePaid || trade.fee || trade.commission || 0);
        const netTrade = pnl - fee; 

        runningNetPnL += netTrade;

        // Group purely by the true net result
        if (netTrade > 0) { 
            winningTrades += 1;
        } else if (netTrade < 0) { 
            losingTrades += 1;
            totalLossAmount += Math.abs(netTrade);
        }
    });

    const totalTrades = winningTrades + losingTrades;
    const latestBalance = startingBalance + runningNetPnL;

    if (latestBalance <= 0 || (totalTrades > 0 && winningTrades === 0)) {
        return { riskOfRuinPercent: 100, winRatePercent: 0, status: "FATAL"};
    }

    if (losingTrades === 0 || totalTrades === 0) { 
        return { riskOfRuinPercent: 0, winRatePercent: 100, status: "SAFE" };
    }

    const winRate = winningTrades / totalTrades;
    const lossRate = losingTrades / totalTrades;
    const averageLoss = totalLossAmount / losingTrades;
    const capitalUnits = latestBalance / averageLoss;

    let riskOfRuinPercent = 0;

    // Gambler's Ruin Formula
    if (winRate <= 0.50) { 
        // With negative expectancy (<= 50% WR), ruin is mathematically guaranteed
        riskOfRuinPercent = 100;
    } else { 
        const formulaResult = Math.pow((lossRate / winRate), capitalUnits);
        riskOfRuinPercent = formulaResult * 100;
    }

    return { 
        winRatePercent: Math.round(winRate * 100),
        capitalUnits: Math.floor(capitalUnits),
        riskOfRuinPercent: Math.min(parseFloat(riskOfRuinPercent.toFixed(2)), 99.99),
        status: riskOfRuinPercent > 50 ? "DANGER" : "SAFE"
    };
};