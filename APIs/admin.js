import express from 'express';
import cookieParser from 'cookie-parser';

const router = express.Router();
router.use(express.json());
router.use(cookieParser());

// DATABASE CONNECTION
import { getAccountNoteByCookie, allNameAndEmails, allGroups } from '../database.js';

// API ROUTING
router.get('/alledocenten', async (req, res) => {
    const cookie = req.cookies['USER_TOKEN'].split(':')[1];
    if (!cookie) return res.status(400).send({ success: false, message: "No active cookie found" });
    const accountNote = await getAccountNoteByCookie(cookie);
    if (!accountNote) return res.status(500).send({ success: false, message: "Something went wrong" });
    
    const alleDocenten = await allNameAndEmails('docent');
    if (!alleDocenten) return res.status(500).send({ success: false, message: "Geen docenten kunnen vinden" });

    return res.status(200).send({ success: true, alleDocenten });
})

router.get('/alleleerlingen', async (req, res) => {
    const cookie = req.cookies['USER_TOKEN'].split(':')[1];
    if (!cookie) return res.status(400).send({ success: false, message: "No active cookie found" });
    const accountNote = await getAccountNoteByCookie(cookie);
    if (!accountNote) return res.status(500).send({ success: false, message: "Something went wrong" });
    
    const alleLeerlingen = await allNameAndEmails('leerling');
    if (!alleLeerlingen) return res.status(500).send({ success: false, message: "Geen leerlingen kunnen vinden" });

    return res.status(200).send({ success: true, alleLeerlingen });
})

router.get('/alleouders', async (req, res) => {
    const cookie = req.cookies['USER_TOKEN'].split(':')[1];
    if (!cookie) return res.status(400).send({ success: false, message: "No active cookie found" });
    const accountNote = await getAccountNoteByCookie(cookie);
    if (!accountNote) return res.status(500).send({ success: false, message: "Something went wrong" });
    
    const alleOuders = await allNameAndEmails('ouder');
    if (!alleOuders) return res.status(500).send({ success: false, message: "Geen ouders kunnen vinden" });

    return res.status(200).send({ success: true, alleOuders });
})

router.get('/allegroepen', async (req, res) => {
    const cookie = req.cookies['USER_TOKEN'].split(':')[1];
    if (!cookie) return res.status(400).send({ success: false, message: "No active cookie found" });
    const accountNote = await getAccountNoteByCookie(cookie);
    if (!accountNote) return res.status(500).send({ success: false, message: "Something went wrong" });
    
    const alleGroepen = await allGroups();
    console.log(alleGroepen);
    if (!alleGroepen) return res.status(500).send({ success: false, message: "Geen groepen kunnen vinden" });

    return res.status(200).send({ success: true, alleGroepen });
})


export default router;