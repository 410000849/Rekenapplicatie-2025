const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public')); // Zorg dat je index.html en script.js in /public zitten

const db = new sqlite3.Database('./users.db');

// Maak de drie tabellen als ze nog niet bestaan
db.run(`CREATE TABLE IF NOT EXISTS leerling (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    email TEXT,
    password TEXT
)`);

db.run(`CREATE TABLE IF NOT EXISTS ouder (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    email TEXT,
    password TEXT
)`);

db.run(`CREATE TABLE IF NOT EXISTS docent (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    email TEXT,
    password TEXT
)`);

// API endpoint om een gebruiker toe te voegen aan de juiste tabel
app.post('/account/signup', (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
        return res.status(400).send('Alle velden zijn verplicht.');
    }

    if (!['leerling', 'ouder', 'docent'].includes(role)) {
        return res.status(400).send('Ongeldige rol.');
    }

<<<<<<< HEAD
    try {
        const response = await fetch('/account/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Account aangemaakt!');
            window.location.href = '/main';
        } else {
            const error = await response.text();
            alert('Fout: ' + error);
=======
    const query = `INSERT INTO ${role} (username, email, password) VALUES (?, ?, ?)`;
    db.run(query, [username, email, password], function(err) {
        if (err) {
            console.error(err);
            return res.status(500).send('Fout bij opslaan.');
>>>>>>> a9f00165ed87f63d20bec163a20925e0ebe5afe2
        }

        res.status(200).send(`Gebruiker toegevoegd aan ${role}`);
    });
});

app.listen(port, () => {
    console.log(`Server draait op http://localhost:${port}`);
});
