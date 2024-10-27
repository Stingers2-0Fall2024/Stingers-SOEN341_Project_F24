const express = require('express');
const router = express.Router();
const db = require('../database');

// Login route (Student/Instructor)
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (row) return res.json({ user: row });
    res.status(401).json({ message: 'Invalid credentials' });
  });
});

module.exports = router;
