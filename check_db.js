import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('database.sqlite');

console.log('=== ADMIN ACCOUNTS ===');
db.all("SELECT * FROM admin", (err, rows) => {
    if (err) console.log('Admin table error:', err);
    else {
        console.log('Admin accounts:', rows);
    }
});

console.log('=== DOCENT ACCOUNTS ===');
db.all("SELECT * FROM docent", (err, rows) => {
    if (err) console.log('Docent table error:', err);
    else {
        console.log('Docent accounts:', rows);
    }
});

console.log('=== LEERLING ACCOUNTS ===');
db.all("SELECT * FROM leerling", (err, rows) => {
    if (err) console.log('Leerling table error:', err);
    else {
        console.log('Leerling accounts:', rows);
    }
});

console.log('=== OUDER ACCOUNTS ===');
db.all("SELECT * FROM ouder", (err, rows) => {
    if (err) console.log('Ouder table error:', err);
    else {
        console.log('Ouder accounts:', rows);
    }
    
    // Close database after last query
    db.close();
});