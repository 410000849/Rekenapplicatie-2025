import express from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
const saltRounds = 10;

const router = express.Router();
router.use(express.json());

// DATABASE CONNECTION
import { createAccountNote, loginAccountNote, setCookie, getAccountNoteByCookie, getNoteByEmail } from '../database.js';

// API ROUTING
router.post('/login', async (req, res) => {
    const { email, password, table } = req.body;
    if (!email || !password || !table) return res.status(400).send({ message: 'Er ging iets verkeerd met uw input' });
    await login(res, table, email, password);
})

router.post('/signup', async (req, res) => {
    const { username: naam, email, password: wachtwoord, birth_date: geboortedatum, table } = req.body;
    if (!naam || !email || !wachtwoord || !geboortedatum || !table) return res.status(400).send({ message: 'Er ging iets verkeerd met uw input' });
    let leerling_id;

    if (table == 'ouder') {
        const kind_email = req.body.kind_email;
        if (!kind_email) return res.status(400).send({ message: 'Er ging iets verkeerd met uw input' });

        const leerling = await getNoteByEmail('leerling', kind_email);
        if (!leerling) return res.status(500).send({ message: 'Er ging iets verkeerd' });

        leerling_id = leerling.id;
    }

    const unhashedPassword = wachtwoord;
    bcrypt.hash(wachtwoord, saltRounds, async function (err, hash) {
        try {
            const response = await createAccountNote(naam, email, hash, geboortedatum, table, table == 'ouder' ? leerling_id : null);
            if (!response) return res.status(500).send({ message: 'Er ging iets verkeerd' });

            const { id: _id, naam: _naam, email: _email, wachtwoord: _wachtwoord } = response;
            if (!_id || !_naam || !_email || !_wachtwoord) return res.status(500).send({ message: 'Er ging iets verkeerd' });

            await login(res, table, _email, unhashedPassword);
        } catch(err) {
            return res.status(500).send({ message: 'Er ging iets mis tijdens het aanmaken van een account' });
        }
    });
})

router.post('/logout', async (req, res) => {
    if (req?.cookies?.['USER_TOKEN']) {
        await res.clearCookie('USER_TOKEN');
        res.status(200).send({ message: "Sucessfully logged out" });
    };
})

router.get('/current', async (req, res) => {
    const cookie = req.cookies['USER_TOKEN'].split(':')[1];
    if (!cookie) return res.status(400).send({ success: false, message: "No active session found" });
    const accountNote = await getAccountNoteByCookie(cookie);
    if (!accountNote) return res.status(500).send({ success: false, message: "Something went wrong" });

    return res.status(200).send({ success: true, data: accountNote });
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

    res.status(200).send({ message: 'Log in successvol' });
}

export default router;