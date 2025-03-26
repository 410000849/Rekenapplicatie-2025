import config from './config.json' with { type: 'json' };
import mysql from 'mysql2';

// DATABASE LOG-IN
const pool = mysql.createPool({
    host: config.MYSQL_HOST,
    user: config.MYSQL_USER,
    password: config.MYSQL_PASSWORD,
    database: config.MYSQL_DATABASE,
}).promise();

// DATABASE FUNCTIONS
async function getAccountNote(email) {
    const [rows] = await pool.query(`
        SELECT *
        FROM users
        WHERE email = ?
    `, [email]);

    return rows[0];
};

async function test(userId) {
    let data = '';
    if (userId == '123') data = '456';
    return data;
}

// EXPORT THE FUNCTIONS
export {
    getAccountNote,
    test
}