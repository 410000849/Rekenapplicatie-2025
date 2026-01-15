import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';

const db = new sqlite3.Database('database.sqlite');

// Create simple admin account
const password = 'admin123';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
        console.error('Error hashing password:', err);
        return;
    }
    
    db.run(`INSERT INTO admin (naam, email, geboortedatum, wachtwoord) VALUES (?, ?, ?, ?)`, 
           ['Admin', 'admin@admin.com', '1990-01-01', hash], function(err) {
        if (err) {
            console.error('Error creating admin:', err);
        } else {
            console.log('✅ Admin account created!');
            console.log('📧 Email: admin@admin.com');
            console.log('🔑 Password: admin123');
        }
        db.close();
    });
});