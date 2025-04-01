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

// EXPORT THE FUNCTIONS
export {
    getAccountNote
};