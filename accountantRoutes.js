import express from "express";
import multer from "multer";
import path from "path";

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
    res.json({
        message: "File uploaded Successfully!",
        fileDetails: req.file
    });
});

export default router;