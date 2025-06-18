import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
const db = new sqlite3.Database('database.sqlite');

db.serialize();

// DATABASE FUNCTIONS
function getNoteByEmail(table, email) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM ${table} WHERE email = ?`, [email], (err, row) => {
            if (err) return reject(err);
            resolve(row || null);
        });
    });
}

function getNoteById(table, id) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM ${table} WHERE id = ?`, [id], (err, row) => {
            if (err) return reject(err);
            resolve(row || null);
        });
    });
}

function getGroupNoteById(id) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM groep WHERE id = ?`, [id], (err, row) => {
            if (err) return reject(err);
            resolve(row || null);
        });
    });
}

function getAccountNoteByCookie(cookie) {
    return new Promise((resolve, reject) => {
        const tables = ['admin', 'docent', 'ouder', 'leerling'];

        let index = 0;

        function checkNextTable() {
            if (index >= tables.length) return resolve(null);

            const table = tables[index];
            db.get(`SELECT *, ? as table_name FROM ${table} WHERE cookie = ?`, [table, cookie], (err, row) => {
                if (err) return reject(err);
                if (row) return resolve(row);

                index++;
                checkNextTable();
            });
        }

        checkNextTable();
    });
}

function getAllGroupMembers(group_id) {
    return new Promise((resolve, reject) => {
        const tables = ['admin', 'docent', 'ouder', 'leerling'];
        const results = [];
        let completed = 0;

        tables.forEach(table => {
            db.all(
                `SELECT *, ? AS table_name FROM ${table} WHERE "groep id" = ?`,
                [table, group_id],
                (err, rows) => {
                    if (err) return reject(err);
                    if (rows && rows.length > 0) {
                        results.push(...rows);
                    }

                    completed++;
                    if (completed === tables.length) {
                        resolve(results);
                    }
                }
            );
        });
    });
}

async function createAccountNote(naam, email, hash, geboortedatum, table, leerling_id) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT email FROM ${table} WHERE email = ?`, [email], (err, row) => {
            if (err) return reject(err);
            if (row) return reject(new Error(`Email '${email}' bestaat al in de tabel '${table}'`));
            const isOuder = table === "ouder";

            const columns = `naam, email, geboortedatum, wachtwoord${isOuder ? ", \`leerling id\`" : ""}`;
            const placeholders = isOuder ? "?, ?, ?, ?, ?" : "?, ?, ?, ?";
            const values = isOuder ? [naam, email, geboortedatum, hash, leerling_id] : [naam, email, geboortedatum, hash];

            db.run(`INSERT INTO ${table} (${columns}) VALUES (${placeholders})`, values, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, naam, email, wachtwoord: hash });
                }
            });
        });
    });
}

async function loginAccountNote(email, wachtwoord, table) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM ${table} WHERE email = ?`, [email], async (err, row) => {
            if (err) return reject(err);
            if (!row) return resolve(false);

            try {
                const match = await bcrypt.compare(wachtwoord, row.wachtwoord);
                resolve(match);
            } catch (err) {
                reject(err);
            }
        });
    });
}

async function voegPuntenToe(id, table, score) {
    return new Promise((resolve, reject) => {
        db.run(`UPDATE ${table} SET punten = ? WHERE id = ?`, [score, id], function (err) {
            if (err) return reject(err);
            resolve(this.changes > 0);
        });
    });
}

async function setCookie(table, email, uniqueString, res) {
    return new Promise((resolve, reject) => {
        db.run(`UPDATE ${table} SET cookie = ? WHERE email = ?`, [uniqueString, email], function (err) {
            if (err) return reject(err);

            res.cookie('USER_TOKEN', `${table}:${uniqueString}`, { httpOnly: true, secure: true, sameSite: 'Strict' });
            resolve(true);
        });
    });
}

async function addGroupIdToAccount(table, email, id) {
    return new Promise((resolve, reject) => {
        db.run(`UPDATE ${table} SET \`groep id\` = ? WHERE email = ?`, [id, email], function (err) {
            if (err) return reject(err);
            resolve(true);
        });
    });
}

async function confirmCookie(table, uniqueString) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT naam FROM ${table} WHERE cookie = ?`, [uniqueString], (err, row) => {
            if (err) return reject(err);
            resolve(row || false);
        });
    });
}

async function createGroupNote(naam, type) {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO groep (naam, type) VALUES (?, ?)`, [naam, type], function (err) {
            if (err) return reject(err);
            resolve({ id: this.lastID });
        }
        );
    });
}

async function leaveGroup(table, email) {
    return new Promise((resolve, reject) => {
        db.run(`UPDATE ${table} SET \`groep id\` = '' WHERE email = ?`, [email], function (err) {
            if (err) return reject(err);
            resolve(true);
        });
    });
}

<<<<<<< HEAD
async function setGroupDifficulty(groupId, game1Difficulty, game2Difficulty) {
    return new Promise((resolve, reject) => {
        db.run(`UPDATE groep SET game1_difficulty = ?, game2_difficulty = ? WHERE id = ?`, 
               [game1Difficulty, game2Difficulty, groupId], function (err) {
            if (err) return reject(err);
            resolve(this.changes > 0);
        });
    });
}

async function getGroupDifficulty(groupId) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT game1_difficulty, game2_difficulty FROM groep WHERE id = ?`, [groupId], (err, row) => {
            if (err) return reject(err);
            resolve(row || { game1_difficulty: 'easy', game2_difficulty: 'easy' });
=======

async function allNameAndEmails(table) {
    return new Promise((resolve, reject) => {
        db.all(`SELECT naam, email FROM ${table}`, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
>>>>>>> abd5a859e701564f6e1c95f00a65ca9cc7ec38dd
        });
    });
}

// EXPORT THE FUNCTIONS
export {
    getNoteByEmail,
    getNoteById,
    getGroupNoteById,
    createAccountNote,
    loginAccountNote,
    setCookie,
    confirmCookie,
    createGroupNote,
    getAccountNoteByCookie,
    addGroupIdToAccount,
    getAllGroupMembers,
    leaveGroup,
    voegPuntenToe,
<<<<<<< HEAD
    setGroupDifficulty,
    getGroupDifficulty
=======
    allNameAndEmails
>>>>>>> abd5a859e701564f6e1c95f00a65ca9cc7ec38dd
};