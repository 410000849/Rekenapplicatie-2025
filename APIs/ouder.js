import express from 'express';
import cookieParser from 'cookie-parser';

const router = express.Router();
router.use(express.json());
router.use(cookieParser());

// DATABASE CONNECTION
import { getAccountNoteByCookie, getNoteById, getGroupNoteById, getAllGroupMembers } from '../database.js';

// API ROUTING
router.get('/leerling', async (req, res) => {
    const cookieHeader = req.cookies['USER_TOKEN'];
    if (!cookieHeader) return res.status(400).send({ success: false, message: "No active session found" });
    
    const cookie = cookieHeader.split(':')[1];
    if (!cookie) return res.status(400).send({ success: false, message: "No active session found" });
    const accountNote = await getAccountNoteByCookie(cookie);
    if (!accountNote) return res.status(500).send({ success: false, message: "Something went wrong" });

    // leerling info
    const leerling_id = accountNote?.["leerling id"];
    if (!leerling_id) return res.status(200).send({ success: false, message: "Geen leerling gevonden" });

    const leerling = await getNoteById('leerling', leerling_id);
    if (!leerling) return res.status(500).send({ success: false, message: "Something went wrong" });

    // groep info
    const groep_id = leerling?.['groep id'];
    if (!groep_id) return res.status(200).send({ success: true, data: leerling });

    const groep = await getGroupNoteById(groep_id);
    if (!groep) return res.status(500).send({ success: false, message: "Something went wrong" });
    const { naam: groep_naam, type: groep_type } = groep;
    leerling['groep naam'] = groep_naam;
    leerling['groep type'] = groep_type;

    if (leerling?.cookie) delete leerling.cookie;
    if (leerling?.wachtwoord) delete leerling.wachtwoord;

    return res.status(200).send({ success: true, data: leerling });
})

router.get('/groep', async (req, res) => {
    const cookieHeader = req.cookies['USER_TOKEN'];
    if (!cookieHeader) return res.status(400).send({ success: false, message: "No active session found" });
    
    const cookie = cookieHeader.split(':')[1];
    if (!cookie) return res.status(400).send({ success: false, message: "No active session found" });
    const accountNote = await getAccountNoteByCookie(cookie);
    if (!accountNote) return res.status(500).send({ success: false, message: "Something went wrong" });

    // leerling info
    const leerling_id = accountNote?.["leerling id"];
    if (!leerling_id) return res.status(500).send({ success: false, message: "Something went wrong" });

    const leerling = await getNoteById('leerling', leerling_id);
    if (!leerling) return res.status(500).send({ success: false, message: "Something went wrong" });
    if (!leerling['groep id']) return res.status(200).send({ success: false, message: "Not in a group" });
    const group_id = leerling?.['groep id'];

    console.log(group_id);
    
    const allMembers = await getAllGroupMembers(group_id);
    if (!allMembers) return res.status(500).send({ success: false, message: "Something went wrong" });

    const group_members = allMembers.map(member => {
        if ('punten' in member) return { naam: member.naam, rol: member.table_name, punten: member.punten };
        return { naam: member.naam, rol: member.table_name };
    });

    return res.status(200).send({ success: true, group_id, group_members });
})

export default router;