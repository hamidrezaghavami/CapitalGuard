// Distance to Danger (SL violations)
export const calculateDistanceToDanger = (tradesArray) => {
    let totalLosingTrades = 0;
    let rulesBrokenTrades = 0;

    let plannedRiskBuy = entryPrice - stopLoss;
    let plannedRiskShort = entryPrice - exitPrice;
    
    // clean and extract numbers for specific trade
    const DistanceToDanger = tradesArray.forEach(trade => {

        const pnl = parseFloat(trade.pnl || 0 );
        const entryPrice = parseFloat(trade.entryPrice || 0 );
        const exitPrice = parseFloat(trade.exitPrice || 0 );
        const stopLoss = parseFloat(trade.stopLoss || 0 );
        
        // skip winning trades
        if ( pnL >= 0 ) {
            return;
        }
        
        totalLosingTrades += 1;
        
        // Distance to Danger Math Comparison
        let plannedRisk = Math.abs(entryPrice - stopLoss);
        let actualLoss = Math.abs(entryPrice - exitPrice);

        if ( actualLoss > plannedRisk ) {
            rulesBrokenTrades += 1;
        }
        
    });

    // calculate final KPI core test out of 100
    const disciplineScore = totalLosingTrades > 0
    ? ((totalLosingTrades - rulesBrokenTrades) / totalLosingTrades ) * 100 : 100;
    // if Discipline Score is equal to TotalLost bigger than 0 then print 
    // totalLost - brokenTrade => result of them 

    return { 
        totalLosingTrades,
        disciplineScore: Math.round(disciplineScore)
    };
};

// Pull-Back / Stop-Loss Triggers caclualtion 
export const calculatePsychologicalDrawdown = (tradesArray) => {
    
    const tagCounts = { strategic: 0, greed: 0, fear: 0, fomo: 0, revenge: 0 };
    const taglosses = { strategic: 0, greed: 0, fear: 0, fomo: 0, revenge: 0 };
    let totalCashLoss = 0;

    // loop for see every trade for tag
    tradesArray.forEach(trade => {
        const pnl = parseFloat(trade.pnl || 0 );

        if ( pnl >= 0 ) return;

        totalCashLoss += Math.abs(pnl);

        // normalise the tag strim
        const tag = trade.psychologyTag ? trade.psychologyTag.trim().toLowerCase() : "";

        // if the tag maches one of our buckets
        if ( tagCounts.hasOwnProperty(tag)) { 
            tagCounts[tag] += 1;
            tagLosses[tag] += Math.abs(pnl);
        }

        // finding which emotions caused the most financial damage
        let dominantEmotion = "none";
        let maxEmotionLoss = 0;

        for ( const tag in tagLosses ) {

            if ( tag === "strategic" ) continue;

            if ( tagLosses[tag] > maxEmotionLoss ) { 
                maxEmotionLoss = tagLosses[tag];
                dominantEmotion = tag;
            }
        }
    });

    // trigger warning if emotional loss consume more than 50% of total damage
    const emotionalLossTrade = tradeCashLoss - tagLosses.strategic;
    const haltTradingWarning = totalCashLoss > 0 && ( emotionalLossTrade / totalCashLoss ) > 0.50;

    // return everything to show on your dashboards
    return { 
        tagCounts,
        tagLosses,
        totalCashLoss: Math.round(totalCashLoss),
        dominantEmotion,
        haltTradingWarning
    };
};