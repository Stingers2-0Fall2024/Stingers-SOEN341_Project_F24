const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'peer_assessment.db'), (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Initialize tables
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('student', 'instructor'))
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS teams (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        teamName TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS team_members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        teamId INTEGER NOT NULL,
        userId INTEGER NOT NULL,
        FOREIGN KEY (teamId) REFERENCES teams (id),
        FOREIGN KEY (userId) REFERENCES users (id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS evaluations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reviewerId INTEGER NOT NULL,
        revieweeId INTEGER NOT NULL,
        cooperation INTEGER NOT NULL,
        conceptualContribution INTEGER NOT NULL,
        practicalContribution INTEGER NOT NULL,
        workEthic INTEGER NOT NULL,
        comments TEXT,
        FOREIGN KEY (reviewerId) REFERENCES users (id),
        FOREIGN KEY (revieweeId) REFERENCES users (id)
    )`);
});

module.exports = db;
