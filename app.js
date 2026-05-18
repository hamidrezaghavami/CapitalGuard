import "dotenv/config";
import express from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import accountantRoutes from "./routes/accountantRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(ClerkExpressRequireAuth());

app.use('/api/auth', authRouter);
app.use('/api/accountants', accountantRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on the port ${PORT}`);
});