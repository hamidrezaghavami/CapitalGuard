import express from 'express';
import multer from 'multer';
import path from 'path';
import csvParser from 'csv-parser';
import { Readable } from 'stream';
import { normalizeTrade } from '../utils/dataNormalizer.js';
import { calculateFeeDrain } from '../Controllers/accountantController.js';
import { calculateSurvivalRunway, calculateRiskOfRuin } from '../Controllers/forecasterController.js';
import { calculateDistanceToDanger, calculatePsychologicalDrawdown, calculatePortfolioVulnerability } from '../Controllers/riskController.js';

const router = express.Router();

// 1. Set multer to hold the file in RAM
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => { 
    const allowedType = ['.csv', '.json'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedType.includes(ext)) { 
        cb(null, true);
    } else { 
        cb(new Error('Invalid file type. Only CSV and JSON are allowed.'), false);
    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post('/upload', upload.single('tradingLog'), (req, res) => {
    if (!req.file) { 
        return res.status(400).json({ message: "Please upload a file." });
    }

    const customStartingBalance = parseFloat(req.body.startingBalance);
    if (isNaN(customStartingBalance)) {
        return res.status(400).json({ error: "Starting balance is strictly required." });
    }

    // 2. Read the file type and the buffer from RAM instead of disk paths
    const fileType = req.file.mimetype; 
    const fileBuffer = req.file.buffer;

    if (fileType === 'application/json') { 
        try { 
            // 3. Convert the buffer directly to a string and parse it
            const rawData = fileBuffer.toString('utf-8');
            const parsedData = JSON.parse(rawData);
            const trades = parsedData.TradeHistory || parsedData;

            const accountantMetrics = calculateFeeDrain(trades, customStartingBalance);
            const dangerData = calculateDistanceToDanger(trades);
            const phychologyData = calculatePsychologicalDrawdown(trades);
            const vulnerabilityData = calculatePortfolioVulnerability(trades, customStartingBalance);
            const runwayData = calculateSurvivalRunway(trades, customStartingBalance);
            const ruinData = calculateRiskOfRuin(trades, customStartingBalance);

            return res.json({
                message: "Dashboard data completely analyzed!",
                analytics: {
                    accountant: accountantMetrics,
                    riskOfficer: { 
                        distanceToDanger: dangerData, 
                        psychology: psychologyData,
                        portfolioVulnerability: vulnerabilityData 
                    },
                    forecaster: { runway: runwayData, riskOfRuin: ruinData }
                },
                trades: trades,
                startingBalance: customStartingBalance
            });
        } catch (err) {
            console.error("MATH ENGINE CRASH:", err);
            return res.status(500).json({ error: "Failed to parse JSON file." });
        }
    }

    if (fileType === 'text/csv') { 
        const results = [];

        // 4. Stream the buffer into the CSV parser
        Readable.from(fileBuffer.toString('utf-8'))
        .pipe(csvParser()) 
        .on('data', (data) => { 
            const cleanTrade = normalizeTrade(data);
            results.push(cleanTrade);
        })
        .on('end', () => {
            const accountantMetrics = calculateFeeDrain(results, customStartingBalance);
            const dangerData = calculateDistanceToDanger(results);
            const phychologyData = calculatePsychologicalDrawdown(results);
            const vulnerabilityData = calculatePortfolioVulnerability(results, customStartingBalance);
            const runwayData = calculateSurvivalRunway(results, customStartingBalance);
            const ruinData = calculateRiskOfRuin(results, customStartingBalance);

            return res.json({
                message: "Dashboard data completely analyzed!",
                analytics: {
                    accountant: accountantMetrics,
                    riskOfficer: { 
                        distanceToDanger: dangerData, 
                        phychology: phychologyData,
                        portfolioVulnerability: vulnerabilityData 
                    },
                    forecaster: { runway: runwayData, riskOfRuin: ruinData }
                },
                trades: results,
                startingBalance: customStartingBalance
            });
        })
        .on('error', (err) => { 
            return res.status(500).json({ error: "Failed to parse CSV file!." });
        });
    }
}); 

export default router;