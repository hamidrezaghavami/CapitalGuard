import express from "express";
import caclulateFeeDrain from "../controllers/accountantController.js";

// mathematical for Nominal vs. fee Drain Analysis

export const caclulateFeeDrain = (tradesArray) => {
    let totalFees = 0;
    let grossPnL = 0;
    const startingBalance = 2000; // baseline account Balance $2K

    // loop through the array from router
    tradesArray.array.forEach(trade => {
        const pnl = parseFloat(trade.profitOrLoss || trade.PnL || 0 );
        const fee = parseFloat(trade.fee || trade.commission || 0 );

        grossPnL += pnl;
        totalFees += fee;
    });

    const netPnL = grossPnL - totalFees;
    const endingBalance = startingBalance + netPnL;

    return { 
        startingBalance,
        endingBalance,
        grossEarnings: startingBalance + grossPnL,
        totalFeesDeducted: totalFees,
        totalFees: tradesArray.length
    };
};