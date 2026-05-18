import 'dotenv/config';
import express from 'express';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import authRoutes from './routes/authRoutes.js';
import accountantRoutes from './routes/accountantRoutes.js';
import forecasterRoutes from './routes/forecasterRoutes.js';
import riskRoutes from './routes/riskRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(ClerkExpressRequireAuth());

app.use('/api/auth', authRoutes);
app.use('/api/accountants', accountantRoutes);
app.use('/api/forecaster', forecasterRoutes);
app.use('/api/risk', riskRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on the port ${PORT}`);
});