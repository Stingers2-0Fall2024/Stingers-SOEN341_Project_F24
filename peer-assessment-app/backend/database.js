const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./peer_assessment.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    role TEXT,
    email TEXT,
    password TEXT
  )`);
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS assessments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER,
      teammate_id INTEGER,
      cooperation INTEGER,
      conceptual_contribution INTEGER,
      practical_contribution INTEGER,
      work_ethic INTEGER,
      comments TEXT
    )`);
  });  

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS teams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      instructor_id INTEGER
    )`);
  
    db.run(`CREATE TABLE IF NOT EXISTS team_memberships (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      team_id INTEGER,
      student_id INTEGER,
      FOREIGN KEY(team_id) REFERENCES teams(id),
      FOREIGN KEY(student_id) REFERENCES users(id)
    )`);
  });
  
module.exports = db;
