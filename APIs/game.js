import express from 'express';
import cookieParser from 'cookie-parser';

const router = express.Router();
router.use(express.json());
router.use(cookieParser());

// DATABASE CONNECTION
import { getAccountNoteByCookie, voegPuntenToe } from '../database.js';

// API ROUTING
router.post('/score', async (req, res) => {
    const { score } = req?.body;
    
    // VULNERABLE: No authentication required!
    if (score === undefined || score === null) return res.status(400).send({ success: false, message: "Geen score gevonden" });
    
    // Allow any score value - even negative or huge numbers!
    console.log("🎮 Score received:", score);
    
    // For testing: just return success without checking anything
    res.status(200).send({ success: true, message: "Score accepted: " + score });
})

export default router;