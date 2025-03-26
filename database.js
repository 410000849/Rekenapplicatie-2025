import mysql from 'mysql2';
import 'dotenv/config'

console.log(process.env.MYSQL_HOST);

// DATABASE LOG-IN
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
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