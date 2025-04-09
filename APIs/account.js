import express from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
const saltRounds = 10;

const router = express.Router();
router.use(express.json());

// DATABASE CONNECTION
import { createAccountNote, loginAccountNote, setCookie } from '../database.js';

// API ROUTING
router.post('/login', async (req, res) => {
    const { email, password, table } = req.body;
    if (!email || !password || !table) return res.status(400).send({ message: 'Er ging iets verkeerd met uw input' });
    await login(res, table, email, password);
})

router.post('/signup', async (req, res) => {
    const { username: naam, email, password: wachtwoord, birth_date: geboortedatum, table } = req.body;
    if (!naam || !email || !wachtwoord || !geboortedatum || !table) return res.status(400).send({ message: 'Er ging iets verkeerd met uw input' });

    const unhashedPassword = wachtwoord;
    bcrypt.hash(wachtwoord, saltRounds, async function (err, hash) {
        const response = await createAccountNote(naam, email, hash, geboortedatum, table);
        
        try {
            if (!response) return res.status(500).send({ message: 'Er ging iets verkeerd' });
            const { id, naam, email, wachtwoord } = response;
            if (!id || !naam || !email || !wachtwoord) return res.status(500).send({ message: 'Er ging iets verkeerd' });

            await login(res, table, email, unhashedPassword);
        } catch(err) {
            if (!response) return res.status(500).send({ message: 'Er ging iets verkeerd' });
            console.log('Er ging iets verkeerd tijdens het signing up:', err);
        }
    });
})

async function login(res, table, email, wachtwoord) {
    if (!res || !email || !wachtwoord || !table) return res.status(500).send({ message: 'Er ging iets verkeerd' });

    // INPUT CHECK
    const response = await loginAccountNote(email, wachtwoord, table);
    if (!response) return res.status(400).send({ message: 'Gebruikersnaam of wachtwoord is incorrect' });

    // LOGIN SUCCESS
    const uniqueString = await crypto.randomBytes(100).toString('hex');
    const cookie_response = await setCookie(table, email, uniqueString, res);
    if (!cookie_response) return res.status(500).send({ message: 'Er ging iets verkeerd' });

    res.status(200).send({ message: 'Successfully created user' });
}

export default router;