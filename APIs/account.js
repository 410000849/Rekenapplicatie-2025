import express from 'express';

const router = express.Router();
router.use(express.json());

// DATABASE CONNECTION
import { getAccountNote } from '../database.js';

// API ROUTING
router.post('/login', async (req, res) => {
    const { email } = req.body;
    const response = await getAccountNote(email);
    res.status(200).send(response);
})

router.post('/signup', async (req, res) => {
    const { email } = req.body;
    const response = await getAccountNote(email);
    res.status(200).send(response);
})

export default router;