import express from 'express';
import cookieParser from 'cookie-parser';

const router = express.Router();
router.use(express.json());
router.use(cookieParser());

// DATABASE CONNECTION
import { getAccountNoteByCookie, voegPuntenToe } from '../database.js';

// API ROUTING
router.post('/score', async (req, res) => {
    const cookieHeader = req.cookies['USER_TOKEN'];
    if (!cookieHeader) return res.status(400).send({ success: false, message: "No active session found" });
<<<<<<< HEAD
    
    const cookie = cookieHeader.split(':')[1];
    const { score } = req?.body;

    if (!cookie) return res.status(400).send({ success: false, message: "No active session found" });
    if (!score) return res.status(400).send({ success: false, message: "Geen score gevonden" });    const accountNote = await getAccountNoteByCookie(cookie);
=======
      const cookie = cookieHeader.split(':')[1];
    const { score } = req?.body;

    if (!cookie) return res.status(400).send({ success: false, message: "No active session found" });
    if (score === undefined || score === null) return res.status(400).send({ success: false, message: "Geen score gevonden" });const accountNote = await getAccountNoteByCookie(cookie);
>>>>>>> 378ac291ab144eaf8812f84fada54cdb6ec74593
    if (!accountNote || !accountNote?.id || !accountNote?.table_name || accountNote?.table_name !== 'leerling') {
        return res.status(500).send({ success: false, message: "Something went wrong" });
    }
    console.log('accountNote:', accountNote);

    // Handle case where user has no points yet (new user)
    const currentPoints = accountNote.punten || 0;
    const nieuweScore = currentPoints + score;

    const response = await voegPuntenToe(accountNote.id, accountNote.table_name, nieuweScore);
    if (!response) return res.status(500).send({ success: false, message: "Something went wrong" });

    res.status(200).send({ success: true, message: "Successvol punten toegevoegd" });
})

export default router;