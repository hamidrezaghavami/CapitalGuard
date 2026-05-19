import express from 'express';
import { calculateDistanceToDanger, calculatePsychologicalDrawdown } from '../Controllers/riskController.js';
import { normalizeTrade } from '../utils/dataNormalizer.js';

const router = express.Router();

// POST router: /api/risk/analyze
router.post('/analyze', (req, res) => {
    try { 
        const { tradesArray } = req.body;

        if (!tradesArray || !Array.isArray(tradesArray)) { 
            return res.status(400).json({
                success: false, 
                message: "A valid trades array is required to run the Risk Officer."
            });
        }

        const cleanTrades = tradesArray.map(trade => normalizeTrade(trade));
        const dangerData = calculateDistanceToDanger(cleanTrades);
        const psychologyData = calculatePsychologicalDrawdown(cleanTrades);

        res.status(200).json({
            success: true,
            metrics: {
                distanceToDanger: dangerData, 
                psychology: psychologyData
            }
        });
    } catch (error) { 
        console.log("Risk Officer Engine Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during risk analysis."
        });
    }
});
export default router;