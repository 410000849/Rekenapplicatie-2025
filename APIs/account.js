import express from 'express';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';
const saltRounds = 10;

const router = express.Router();
router.use(express.json());

// DATABASE CONNECTION
import { getAccountNote, createAccountNote } from '../database.js';

// API ROUTING
router.post('/login', async (req, res) => {
    const { email } = req.body;
    const response = await getAccountNote(email);
    res.status(200).send(response);
})

router.post('/signup', async (req, res) => {
    const { username: naam, email, password: wachtwoord, birth_date: geboortedatum, table } = req.body;
    if (!naam, !email, !wachtwoord, !geboortedatum, !table) return res.status(400).send({ message: 'Something went wrong with your input' });

    bcrypt.hash(wachtwoord, saltRounds, async function (err, hash) {
        const response = await createAccountNote(naam, email, hash, geboortedatum, table);
        
        try {
            if (!response) return res.status(500).send({ message: 'Something went wrong' });
            const { id, naam, email, wachtwoord } = response;
            if (!id || !naam || !email || !wachtwoord) return res.status(500).send({ message: 'Something went wrong' });

            await login(res, table, email, hash);
        } catch(err) {
            if (!response) return res.status(500).send({ message: 'Something went wrong' });
            console.log('Something went wrong signing up:', err);
        }
    });
})

async function login(res, table, email, wachtwoord) {
    if (!res || !email || !wachtwoord) return res.status(500).send({ message: 'Something went wrong' });

    // ATTEMPT LOGIN
    const response = await loginAccountNote(email, wachtwoord, table);

    // LOGIN SUCCESS
    const uniqueString = await crypto.randomBytes(100).toString('hex');
    res.cookie('USER_TOKEN', `${table}:${uniqueString}`, { httpOnly: true, secure: true, sameSite: 'Strict' });
    res.status(200).send({ message: 'Successfully created user' });
}

export default router;