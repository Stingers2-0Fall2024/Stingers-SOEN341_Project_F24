const express = require('express');
const db = require('../config/db');
const authMiddleware = require('../middlewares/authMiddleware');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

// Create a new team
router.post('/', authMiddleware, (req, res) => {
    const { teamName, members } = req.body;

    if (!teamName || !members || !members.length) {
        return res.status(400).json({ message: 'Team name and members are required.' });
    }

    db.run(
        `INSERT INTO teams (teamName) VALUES (?)`,
        [teamName],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });

            const teamId = this.lastID;

            // Insert team members
            const placeholders = members.map(() => '(?, ?)').join(', ');
            const values = members.flatMap(member => [teamId, member.id]);

            db.run(
                `INSERT INTO team_members (teamId, userId) VALUES ${placeholders}`,
                values,
                (err) => {
                    if (err) return res.status(500).json({ error: err.message });
                    res.status(201).json({ message: 'Team created successfully.' });
                }
            );
        }
    );
});

// Get all teams
router.get('/', authMiddleware, (req, res) => {
    db.all(
        `SELECT teams.id AS teamId, teams.teamName, users.id AS memberId, users.name AS memberName
         FROM teams
         LEFT JOIN team_members ON teams.id = team_members.teamId
         LEFT JOIN users ON team_members.userId = users.id`,
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });

            const teams = rows.reduce((acc, row) => {
                const team = acc.find(t => t.teamId === row.teamId);
                if (team) {
                    team.members.push({ id: row.memberId, name: row.memberName });
                } else {
                    acc.push({
                        teamId: row.teamId,
                        teamName: row.teamName,
                        members: row.memberId ? [{ id: row.memberId, name: row.memberName }] : []
                    });
                }
                return acc;
            }, []);

            res.status(200).json(teams);
        }
    );
});

module.exports = router;
