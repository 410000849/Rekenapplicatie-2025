import express from 'express';
import cookieParser from 'cookie-parser';

const router = express.Router();
router.use(express.json());
router.use(cookieParser());

// DATABASE CONNECTION
import { createGroupNote, getAccountNoteByCookie, addGroupIdToAccount, getAllGroupMembers, leaveGroup, setGroupDifficulty, getGroupDifficulty } from '../database.js';

// FUNCTIONS
async function joinGroep(id, cookie) {
    const [ table, _cookie ] = cookie.split(':');
    const accountNote = await getAccountNoteByCookie(_cookie);
    if (!accountNote?.table_name || !accountNote?.email) return;
    const email = accountNote.email;
    return await addGroupIdToAccount(table, email, id);
}

// API ROUTING
router.post('/create', async (req, res) => {
    const { naam, type } = req.body;
    console.log('Called create with:', naam, type);

    if (!naam || !type) return res.status(400).send({ message: 'Er ging iets verkeerd met uw input' });
    const response = await createGroupNote(naam, type);
    const { id } = response;
    
    const cookie = req.cookies['USER_TOKEN'];
    const join_resultaat = await joinGroep(id, cookie);
    if (!join_resultaat) return res.status(500).send({ message: 'Er ging iets mis tijdens het joinen van de groep' });
    return res.status(200).send({ message: 'Groep met success gecreëerd' });
})

router.post('/join', async (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(400).send({ message: 'Er ging iets verkeerd met uw input' });

    const cookie = req.cookies['USER_TOKEN'];
    const join_resultaat = await joinGroep(id, cookie);
    if (!join_resultaat) return res.status(500).send({ message: 'Er ging iets mis tijdens het joinen van de groep' });
    return res.status(200).send({ message: 'Groep met success gejoint' });
})

router.post('/leave', async (req, res) => {
    const [ table, cookie ] = req?.cookies?.['USER_TOKEN'].split(':');
    if (!table || !cookie) return res.status(400).send({ success: false, message: 'No active session found' });
    const { email } = await getAccountNoteByCookie(cookie);
    if (!email) return res.status(500).send({ success: false, message: 'Something went wrong' });
    
    const status = await leaveGroup(table, email)
    if (status == true) return res.status(200).send({ success: true, message: 'Successfully left group' });
    res.status(500).send({ success: false, message: 'Something went wrong' });
})

router.get('/current', async (req, res) => {
    const cookie = req.cookies['USER_TOKEN'].split(':')[1];
    if (!cookie) return res.status(400).send({ success: false, message: "No active cookie found" });
    const accountNote = await getAccountNoteByCookie(cookie);
    if (!accountNote) return res.status(500).send({ success: false, message: "Something went wrong" });
    if (!accountNote['groep id']) return res.status(200).send({ success: false, message: "Not in a group" });
    const group_id = accountNote?.['groep id'];
    
    const allMembers = await getAllGroupMembers(group_id);
    if (!allMembers) return res.status(500).send({ success: false, message: "Something went wrong" });

    const group_members = allMembers.map(member => {
        if ('punten' in member) return { naam: member.naam, rol: member.table_name, punten: member.punten };
        return { naam: member.naam, rol: member.table_name };
    });    return res.status(200).send({ success: true, group_id, group_members });
})

router.post('/difficulty', async (req, res) => {
    const { game1Difficulty, game2Difficulty } = req.body;
    if (!game1Difficulty || !game2Difficulty) {
        return res.status(400).send({ success: false, message: 'Moeilijkheidsgraad voor beide games is vereist' });
    }

    const validDifficulties = ['easy', 'medium', 'hard', 'adaptive'];
    if (!validDifficulties.includes(game1Difficulty) || !validDifficulties.includes(game2Difficulty)) {
        return res.status(400).send({ success: false, message: 'Ongeldige moeilijkheidsgraad' });
    }

    const cookieHeader = req.cookies['USER_TOKEN'];
    if (!cookieHeader) return res.status(400).send({ success: false, message: "No active session found" });
    
    const cookie = cookieHeader.split(':')[1];
    if (!cookie) return res.status(400).send({ success: false, message: "No active session found" });
    
    const accountNote = await getAccountNoteByCookie(cookie);
    if (!accountNote) return res.status(500).send({ success: false, message: "Something went wrong" });
    if (!accountNote['groep id']) return res.status(400).send({ success: false, message: "Not in a group" });
    
    // Check if user is a teacher (docent)
    if (accountNote.table_name !== 'docent') {
        return res.status(403).send({ success: false, message: "Alleen docenten kunnen moeilijkheidsgraad instellen" });
    }

    const group_id = accountNote['groep id'];
    const result = await setGroupDifficulty(group_id, game1Difficulty, game2Difficulty);
    
    if (result) {
        return res.status(200).send({ success: true, message: 'Moeilijkheidsgraad succesvol ingesteld' });
    } else {
        return res.status(500).send({ success: false, message: 'Er ging iets mis bij het instellen van de moeilijkheidsgraad' });
    }
})

router.get('/difficulty', async (req, res) => {
    const cookieHeader = req.cookies['USER_TOKEN'];
    if (!cookieHeader) return res.status(400).send({ success: false, message: "No active session found" });
    
    const cookie = cookieHeader.split(':')[1];
    if (!cookie) return res.status(400).send({ success: false, message: "No active session found" });
    
    const accountNote = await getAccountNoteByCookie(cookie);
    if (!accountNote) return res.status(500).send({ success: false, message: "Something went wrong" });
    if (!accountNote['groep id']) return res.status(400).send({ success: false, message: "Not in a group" });
    
    const group_id = accountNote['groep id'];
    const difficulties = await getGroupDifficulty(group_id);
    
    return res.status(200).send({ success: true, difficulties });
})

export default router;