import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('database.sqlite');

console.log('=== DATABASE INSPECTION ===\n');

// Check docent table
db.all("SELECT naam, email FROM docent LIMIT 5", (err, rows) => {
    if (err) {
        console.error('Error querying docent:', err);
    } else {
        console.log('Docenten in database:');
        console.log(rows);
    }
    
    // Check groep table  
    db.all("SELECT id, naam, type, game1_difficulty, game2_difficulty FROM groep LIMIT 5", (err, rows) => {
        if (err) {
            console.error('Error querying groep:', err);
        } else {
            console.log('\nGroepen in database:');
            console.log(rows);
        }
        
        // Check leerling table
        db.all("SELECT naam, email, `groep id` FROM leerling LIMIT 5", (err, rows) => {
            if (err) {
                console.error('Error querying leerling:', err);
            } else {
                console.log('\nLeerlingen in database:');
                console.log(rows);
            }
            
            db.close();
        });
    });
});
