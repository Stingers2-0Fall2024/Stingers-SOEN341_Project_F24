const express = require('express');
const db = require('../database/db');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const router = express.Router();

// Create a new team
router.post('/', authMiddleware, roleMiddleware('instructor'), (req, res) => {
    const { teamName, memberIds } = req.body;

    db.run(`INSERT INTO teams (teamName) VALUES (?)`, [teamName], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        const teamId = this.lastID;

        const placeholders = memberIds.map(() => '(?, ?)').join(', ');
        const values = memberIds.flatMap((id) => [teamId, id]);

        db.run(`INSERT INTO team_members (teamId, userId) VALUES ${placeholders}`, values, (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ teamId });
        });
    });
});

// Get all teams
router.get('/', authMiddleware, (req, res) => {
    db.all(
        `SELECT teams.id, teams.teamName, users.id AS userId, users.name AS userName
         FROM teams
         LEFT JOIN team_members ON teams.id = team_members.teamId
         LEFT JOIN users ON team_members.userId = users.id`,
        [],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });

            const teams = rows.reduce((acc, row) => {
                const team = acc.find((t) => t.id === row.id);
                if (team) {
                    team.members.push({ id: row.userId, name: row.userName });
                } else {
                    acc.push({ id: row.id, teamName: row.teamName, members: [{ id: row.userId, name: row.userName }] });
                }
                return acc;
            }, []);
            res.json(teams);
        }
    );
});
