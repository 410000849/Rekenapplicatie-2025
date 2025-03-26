import express from 'express';

const router = express.Router();
router.use(express.json());

// DATABASE CONNECTION
import { test } from '../database.js';

// API ROUTING
router.post('/login', async (req, res) => {
    const { userId } = req.body;
    const response = await test(userId);
    res.status(200).send(response);
})

export default router;