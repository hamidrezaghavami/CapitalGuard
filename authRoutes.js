import express from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

const router = express.Router();

// adding middleware of Clerk require Auth for Authentication of Signin/SignUp page
router.get('/user-status', ClerkExpressRequireAuth, (req, res) => {
    res.json({ message: "Authenticated!"});
});

export default router;