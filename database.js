import 'dotenv/config';
import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('database.sqlite');

// DATABASE FUNCTIONS
async function getAccountNote(email) {
    return new Promise((resolve, reject) => {
        db.get(
            'SELECT * FROM users WHERE email = ?',
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

async function test(userId) {
    let data = '';
    if (userId === '123') data = '456';
    return data;
}

// EXPORT THE FUNCTIONS
export {
    getAccountNote,
    test
};