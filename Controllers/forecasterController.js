// Survival Runway Projections
/*
we see their latest balance acconut and simulate if their current position continue
what can happen to their account based on their winning/lossing performance.

considering we use "runningNetPnL" for track their real balance, people upload their
latest history of trades, their current balance may different from what we have 
this all is Statistical
*/

export const calculateSurvivalRunway = (tradeArray, startingBalance = 2000) => {
    
    let totalLossAmount = 0;
    let losingTradesCount = 0;
    let runningNetPnL = 0; // track actual real balance

    tradeArray.forEach(trade => {
        // FIXED: Added trade.ResultUSD to support the AI JSON
        const pnl = parseFloat(trade.pnl || trade.ResultUSD || 0 );
        const fee = parseFloat(trade.feePaid || trade.fee || 0 );

        runningNetPnL += (pnl - fee);


        if ( pnl < 0 ) { 
            totalLossAmount += Math.abs(pnl);
            losingTradesCount += 1;
        }
    });

    // calculate their true balance
    const latestBalance = startingBalance + runningNetPnL;

    // account is already blown up ( first case )
    if ( latestBalance <= 0 ) { 
        return { 
            latestBalance: 0,
            averageLoss: 0,
            survivalRunway: 0,
            status: "ACCOUNT BLOWN"
        };
    }

    // SECOND CASE: they didn't lost the trade
    if ( losingTradesCount === 0 ) {
        return { 
            latestBalance: parseFloat(latestBalance.toFixed(2)),
            averageLoss: 0,
            survivalRunway: "Infinite",
            status: "NO LOSSES YET"
        }
    }

    // core projection math
    const averageLoss = totalLossAmount / losingTradesCount;
    const survivalRunway = Math.floor(latestBalance / averageLoss);

    return { 
        latestBalance: parseFloat(latestBalance.toFixed(2)),
        averageLoss: parseFloat(averageLoss.toFixed(2)),
        survivalRunway: survivalRunway,
        status: "ACTIVE"
    }
};

// calculating Risk Of Ruin Statistical Modelling
export const calculateRiskOfRuin = (tradeArray, startingBalance = 2000) => {
    let winningTrades = 0;
    let losingTrades = 0;
    let totalLossAmount = 0;
    let runningNetPnL = 0;

    tradeArray.forEach(trade => {
        // FIXED: Added trade.ResultUSD to support the AI JSON
        const pnl = parseFloat(trade.pnl || trade.ResultUSD || 0 );
        const fee = parseFloat(trade.fee || 0 );
        const netTrade = pnl - fee; // count hidden fee

        runningNetPnL += netTrade;

        if ( netTrade > 0 ) { 
            winningTrades += 1;
        } else if ( netTrade < 0 ) { 
            losingTrades += 1;
            totalLossAmount += Math.abs(netTrade);
        }
    });

    const totalTrades = winningTrades + losingTrades;
    const latestBalance = startingBalance + runningNetPnL;

    // handle cases ( 0 balance, no loss, 0 trade ) 
    if ( latestBalance <= 0 || (totalTrades > 0 && winningTrades === 0)) {
        return { riskOfRuinPercent: 100, winRatePercent: 0, status: "FATAL"};
    }

    if (losingTrades === 0 || totalTrades === 0 ) { 
        return { riskOfRuinPercent: 0, winRatePercent: 100, status: "NO RISK DETECTED" };
    }

    // calculating core probability
    const winRate = winningTrades / totalTrades;
    // FIXED CRASH: "lossingTrades" was misspelled, which would have crashed the server!
    const lossRate = losingTrades / totalTrades; // ( 1 - W )

    const averageLoss = totalLossAmount / losingTrades;
    const capitalUnits = latestBalance / averageLoss;

    // Gambler's Ruin Formula
    let riskOfRuinPercent = 0;

    if ( winRate <= 0.50 ) { 
        riskOfRuinPercent = 100;
    } else { 
        const formulaResult = Math.pow((lossRate / winRate), capitalUnits);
        riskOfRuinPercent = formulaResult * 100;
    }

    // Return the Statistical payload
    return { 
        winRatePercent: Math.round(winRate * 100),
        capitalUnits: Math.floor(capitalUnits),
        // FIXED CRASH: parseFloat syntax error corrected
        riskOfRuinPercent: Math.min(parseFloat(riskOfRuinPercent.toFixed(2)), 99.99),
        status: riskOfRuinPercent > 50 ? "DANGER" : "SAFE"
    };
};