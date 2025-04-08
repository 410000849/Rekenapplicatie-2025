import 'dotenv/config';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
const db = new sqlite3.Database('database.sqlite');

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

// EXPORT THE FUNCTIONS
export {
    getAccountNote,
    createAccountNote,
    loginAccountNote
};