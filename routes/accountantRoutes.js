import express from 'express';
import multer from 'multer';
import path from 'path';
import csvParser from 'csv-parser';
import fs from 'fs';
import { normalizeTrade } from '../utils/dataNormalizer.js';
import { calculateFeeDrain } from '../Controllers/accountantController.js';
import { calculateSurvivalRunway, calculateRiskOfRuin } from '../Controllers/forecasterController.js';
import { calculateDistanceToDanger, calculatePsychologicalDrawdown} from '../Controllers/riskController.js';

const router = express.Router();

if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => { 
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => { 
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb ) => { 
    const allowedType = ['.csv', '.json'];
    const ext = path.extname(file.originalname).toLowerCase();
    if ( allowedType.includes(ext)) { 
        cb(null, true);
    } else { 
        cb(new Error('Invalid file type. Only CSV and JSON are allowed.'), false);
    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post('/upload', upload.single('tradingLog'), (req, res) => {
    if (!req.file) { 
        return res.status(400).json({ message: "Please upload a file. "});
    }

    const filePath = req.file.path; 
    const fileType = req.file.mimetype; 
    
    // NEW: Capture custom starting balance from Frontend (Defaults to 2000 if empty)
    const customStartingBalance = parseFloat(req.body.startingBalance) || 2000;

    if (fileType === 'application/json') { 
        try { 
            const rawData = fs.readFileSync(filePath, 'utf-8');
            const parsedData = JSON.parse(rawData);
            const trades = parsedData.TradeHistory || parsedData;

            const accountantMetrics = calculateFeeDrain(trades);
            const dangerData = calculateDistanceToDanger(trades);
            const phychologyData = calculatePsychologicalDrawdown(trades);
            
            // Send custom balance to Forecaster engines
            const runwayData = calculateSurvivalRunway(trades, customStartingBalance);
            const ruinData = calculateRiskOfRuin(trades, customStartingBalance);

            return res.json({
                message: "Dashboard data completely analyzed!",
                analytics: {
                    accountant: accountantMetrics,
                    riskOfficer: { distanceToDanger: dangerData, phychology: phychologyData },
                    forecaster: { runway: runwayData, riskOfRuin: ruinData }
                },
                trades: trades,
                startingBalance: customStartingBalance // Send back to frontend so graph knows where to start
            });
        } catch (err) {
            console.error("MATH ENGINE CRASH:", err);
            return res.status(500).json({ error: "Failed to parse JSON file." });
        }
    }

    if (fileType === 'text/csv') { 
        const results = [];

        fs.createReadStream(filePath)
        .pipe(csvParser()) 
        .on('data', (data) => { 
            const cleanTrade = normalizeTrade(data);
            results.push(cleanTrade);
        })
        .on('end', () => {
            const accountantMetrics = calculateFeeDrain(results);
            const dangerData = calculateDistanceToDanger(results);
            const phychologyData = calculatePsychologicalDrawdown(results);
            
            // Send custom balance to Forecaster engines
            const runwayData = calculateSurvivalRunway(results, customStartingBalance);
            const ruinData = calculateRiskOfRuin(results, customStartingBalance);

            return res.json({
                message: "Dashboard data completely analyzed!",
                analytics: {
                    accountant: accountantMetrics,
                    riskOfficer: { distanceToDanger: dangerData, phychology: phychologyData },
                    forecaster: { runway: runwayData, riskOfRuin: ruinData }
                },
                trades: results,
                startingBalance: customStartingBalance // Send back to frontend so graph knows where to start
            });
        })
        .on('error', (err) => { 
            return res.status(500).json({ error: "Failed to parse CSV file!." });
        });
    }
}); 

export default router;