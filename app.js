import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import authRoutes from './routes/authRoutes.js';
import accountantRoutes from './routes/accountantRoutes.js';
import forecasterRoutes from './routes/forecasterRoutes.js';
import riskRoutes from './routes/riskRoutes.js';
// control API traffic to your core calculation engines
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = process.env.PORT || 3000;

// secure HTTP headers sent from your server to the browser
app.use(cors({
    origin: 'http://localhost:5173', // React URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet());
app.use(express.json());

// Protect core math engines from DDoS or script abuse
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, 
    message: { error: "Too many requests from this IP, please try again after 15 minutes." }
});

// security Guard (Rate Limiting)
app.use('/api/auth', limiter);
app.use('/api/accountants', limiter);
app.use('/api/forecaster', limiter);
app.use('/api/risk', limiter);

// Routers with Clerk Security Applied ONLY to Protected Routes
app.use('/api/auth', authRoutes);
app.use('/api/accountants', ClerkExpressRequireAuth(), accountantRoutes);
app.use('/api/forecaster', ClerkExpressRequireAuth(), forecasterRoutes);
app.use('/api/risk', ClerkExpressRequireAuth(), riskRoutes);

// Error Handler to nicely catch Clerk "Unauthorized" rejections without crashing the server
app.use((err, req, res, next) => {
  if (err.message === 'Unauthenticated' || err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: "Unauthorized: Invalid or missing Clerk Token" });
  }
  next(err);
});

app.listen(PORT, () => {
    console.log(`Server is running on the port ${PORT}`);
});