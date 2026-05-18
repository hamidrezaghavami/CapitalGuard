import express from "express";
import { calculateSurvivalRunway, calculateRiskOfRuin } from "./Controllers/forecasterController";

const router = express.Router();

// POST route: /api/forecaster/analyze
router.post('/analyze', (req, res) => {
    try {
        // extract data send from front dashboard
        const { tradesArray, startingBalance } = req.body;

        if (!tradesArray || !Array.isArray(tradesArray)) { 
            return res.status(400).json({
                success: false,
                message: "A valid trades array is required to run the Forecaster."
            })
        }

        const survivalData = calculateSurvivalRunway(tradesArray, startingBalance);
        const ruinData = calculateRiskOfRuin(tradesArray, startingBalance);

        // pack the result send back to UI
        return res.status(200).json({
            success: true,
            metrics: {
                runway: survivalData,
                riskOfRuin: ruinData
            }
        });
    } catch (error) {  // check if there is error send back to backend
        console.log("Forecaster Engine Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during mathematical forecasting."
        });
    }
});

export default router;