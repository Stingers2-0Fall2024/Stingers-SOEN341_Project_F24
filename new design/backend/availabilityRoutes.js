const express = require('express');
const db = require('../database/db');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Save Availability
router.post('/', authMiddleware, (req, res) => {
    const { availability } = req.body;
    const userId = req.user.id;

    db.run(
        `INSERT INTO availabilities (userId, availability) VALUES (?, ?)
         ON CONFLICT(userId) DO UPDATE SET availability = ?`,
        [userId, JSON.stringify(availability), JSON.stringify(availability)],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: 'Availability saved' });
        }
    );
});

//Team Availability
router.get('/team/:teamId', authMiddleware, (req, res) => {
    const { teamId } = req.params;

    db.all(
        `SELECT users.name, availabilities.availability
         FROM team_members
         INNER JOIN users ON team_members.userId = users.id
         INNER JOIN availabilities ON users.id = availabilities.userId
         WHERE team_members.teamId = ?`,
        [teamId],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        }
    );
});
