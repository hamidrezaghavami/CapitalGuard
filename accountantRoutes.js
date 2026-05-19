import express from 'express';
import multer from 'multer';
import path from 'path';
import csvParser from 'csv-parser';
import fs from 'fs';
import { normalizeTrade } from '../utils/dataNormalizer.js';
import { calculateFeeDrain } from '../Controllers/accountantController.js';
import { calculateSurvivalRunway, calculateRiskOfRuin } from '../Controllers/forecasterController.js';
import { calculateDistanceToDanger, calculatePsychologicalDrawdown} from '../controllers/riskController.js';

const router = express.Router();

// storage configuration for taking CSV/JSON history from User
const storage = multer.diskStorage({
    destination: (req, file, cb) => { 
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => { 
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// file type Guard (Filter)
const fileFilter = (req, file, cb ) => { 
    const allowedType = ['.csv', '.json']; // only these formats are allowed
    const ext = path.extname(file.originalname).toLowerCase();

    if ( allowedType.includes(ext)) { 
        cb(null, true); // accept file in those formats
    } else { 
        cb(new Error('Invalid file type. Only CSV and JSON are allowed.'), false);
    }
}

// initialise Multer with our rules
const upload = multer({ storage: storage, fileFilter: fileFilter });

// the router for taking file from user by uploading on website
router.post('/upload', upload.single('tradingLog'), (req, res) => {

    if (!req.file) { // safety check, did they upload the file?
        return res.status(400).json({ message: "Please upload a file. "});
    }

    const filePath = req.file.path; // take file JSON trade
    const fileType = req.file.mimetype; // it's JSON or CSV

    // JSON branch
    if (fileType === 'application/json') { 
        try { 
            const rawData = fs.readFileSync(filePath, 'utf-8');
            const parsedData = JSON.parse(rawData);

            // where data loaded
            const chartMetrics = calculateFeeDrain(parsedData);
            return res.json({
                message: "JSON file parsed and analyzed successfully!",
                analytics: chartMetrics,
                trades: parsedData
            });
        } catch (err) {
            return res.status(500).json({ error: "Failed to parse JSON file." });
        }
    }

    if (fileType === 'text/csv') { 
        const results = [];

        fs.createReadStream(filePath)
        .pipe(csvParser()) 
        .on('data', (data) => { 
            // Translate the messy raw row into our strict schema
            const cleanTrade = normalizeTrade(data);
            results.push(cleanTrade);
        })
        .on('end', () => {
            const accountantMetrics = calculateFeeDrain(results);

            const dangerData = calculateDistanceToDanger(results);
            const phychologyData = calculatePsychologicalDrawdown(results);

            const runwayData = calculateSurvivalRunway(results);
            const ruinData = calculateRiskOfRuin(results);

            return res.json({
                message: "Dashboard data completely analyzed!",
                analytics: {
                    accountant: accountantMetrics,
                    riskOfficer: { distanceToDanger: dangerData, phychology: phychologyData },
                    forecaster: { runway: runwayData, riskOfRuin: ruinData }
                },
                trades: results
            });

        })
        .on('error', (err) => { 
            return res.status(500).json({ error: "Failed to parse CSV file!." });
        });
    }
}); // we did Data Ingestion & Routing

export default router;