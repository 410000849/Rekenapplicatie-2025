import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('database.sqlite');

// Add new columns to groep table for difficulty settings
db.serialize(() => {
    // Check if columns already exist
    db.all("PRAGMA table_info(groep)", (err, columns) => {
        if (err) {
            console.error('Error getting table info:', err);
            return;
        }
        
        const columnNames = columns.map(col => col.name);
        
        if (!columnNames.includes('game1_difficulty')) {
            db.run(`ALTER TABLE groep ADD COLUMN game1_difficulty TEXT DEFAULT 'easy'`, (err) => {
                if (err) {
                    console.error('Error adding game1_difficulty column:', err);
                } else {
                    console.log('Successfully added game1_difficulty column');
                }
            });
        } else {
            console.log('game1_difficulty column already exists');
        }
        
        if (!columnNames.includes('game2_difficulty')) {
            db.run(`ALTER TABLE groep ADD COLUMN game2_difficulty TEXT DEFAULT 'easy'`, (err) => {
                if (err) {
                    console.error('Error adding game2_difficulty column:', err);
                } else {
                    console.log('Successfully added game2_difficulty column');
                }
            });
        } else {
            console.log('game2_difficulty column already exists');
        }
        
        // Close database connection
        setTimeout(() => {
            db.close();
        }, 1000);
    });
});
