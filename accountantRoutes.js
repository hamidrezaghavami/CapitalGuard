import express from "express";
import multer from "multer";
import path from "path";
import csvParser from "csv-parser";
import fs from "fs";

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
            return res.json({
                message: "JSON file parsed Successfully!.",
                totalTrades: parsedData.length,
                trades: parsedData // raw data array 
            });
        } catch (err) {
            return res.status(500).json({ error: "Failed to parse JSON file." });
        }
    }

    if (fileType === 'text/csv') { 
        const results = [];

        // open file and pass through the CSV Steam
        fs.createReadStream(filePath)
        .pipe(csvParser()) // turn texts rows into JS objs
        .on('data', (data) => { 
            results.push(data); // push row data into array
        })
        .on('end', () => { // file fully read and we send response
            res.json({
                message: "CSV File parsed successfully!",
                totalTrades: results.length,
                trades: results
            });
        })
        .on('error', (err) => { // error handling
            res.status(500).json({ error: "Failed to parse CSV file!." });
        })
    }
}); // we did Data Ingestion & Routing

export default router;