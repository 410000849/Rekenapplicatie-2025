import 'dotenv/config';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
const db = new sqlite3.Database('database.sqlite');

db.serialize();

// DATABASE FUNCTIONS
async function getAccountNote(email) {
    return new Promise((resolve, reject) => {
        db.get(
            'SELECT * FROM admin WHERE email = ?',
            [email],
            (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            }
        );
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

async function createAccountNote(naam, email, hash, geboortedatum, table) {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO ${table} (naam, email, geboortedatum, wachtwoord) VALUES (?, ?, ?, ?)`,
            [naam, email, geboortedatum, hash],
            function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, naam, email, wachtwoord: hash });
                }
            }
        );
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
        db.run(`INSERT INTO groep (naam, type) VALUES (?, ?)`, [naam, type], function(err) {
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

// EXPORT THE FUNCTIONS
export {
    getAccountNote,
    createAccountNote,
    loginAccountNote,
    setCookie,
    confirmCookie,
    createGroupNote,
    getAccountNoteByCookie,
    addGroupIdToAccount,
    getAllGroupMembers,
    leaveGroup
};