import 'dotenv/config';
import sqlite3 from 'sqlite3';
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

// EXPORT THE FUNCTIONS
export {
    getAccountNote,
    createAccountNote
};