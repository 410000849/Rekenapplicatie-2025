import express from 'express';

const router = express.Router();
router.use(express.json());

// DATABASE CONNECTION
import { createGroupNote } from '../database.js';

// API ROUTING
router.post('/create', async (req, res) => {
    const { naam, type } = req.body;
    if (!id || !naam || !type) return res.status(400).send({ message: 'Er ging iets verkeerd met uw input' });
    const response = await createGroupNote(id, naam, type);
    console.log(response);
})

router.post('/join', async (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(400).send({ message: 'Er ging iets verkeerd met uw input' });
    //
})

export default router;