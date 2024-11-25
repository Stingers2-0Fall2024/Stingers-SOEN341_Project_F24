const express = require('express');
const db = require('../database/db');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Get the student's team and team members
router.get('/team', authMiddleware, (req, res) => {
    const studentId = req.user.id;

    db.get(
        `SELECT teams.id AS teamId, teams.teamName
         FROM team_members
         INNER JOIN teams ON team_members.teamId = teams.id
         WHERE team_members.userId = ?`,
        [studentId],
        (err, team) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ error: 'Failed to fetch team.' });
            }

            if (!team) {
                return res.status(404).json({ message: 'You are not assigned to a team.' });
            }

            db.all(
                `SELECT users.id, users.name
                 FROM team_members
                 INNER JOIN users ON team_members.userId = users.id
                 WHERE team_members.teamId = ?`,
                [team.teamId],
                (err, members) => {
                    if (err) {
                        console.error(err.message);
                        return res.status(500).json({ error: 'Failed to fetch team members.' });
                    }
                    res.status(200).json({ teamName: team.teamName, members });
                }
            );
        }
    );
});

//all evaluations the student has received
router.get('/evaluations', authMiddleware, (req, res) => {
    const studentId = req.user.id;

    db.all(
        `SELECT evaluations.*, reviewers.name AS reviewerName
         FROM evaluations
         LEFT JOIN users AS reviewers ON evaluations.reviewerId = reviewers.id
         WHERE evaluations.revieweeId = ?`,
        [studentId],
        (err, rows) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ error: 'Failed to fetch evaluations.' });
            }

            res.status(200).json(rows);
        }
    );
});

// Get aggregated scores for  student
router.get('/aggregated', authMiddleware, (req, res) => {
    const studentId = req.user.id;

    db.get(
        `SELECT 
            AVG(cooperation) AS avgCooperation,
            AVG(conceptualContribution) AS avgConceptualContribution,
            AVG(practicalContribution) AS avgPracticalContribution,
            AVG(workEthic) AS avgWorkEthic
         FROM evaluations
         WHERE revieweeId = ?`,
        [studentId],
        (err, row) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ error: 'Failed to fetch aggregated scores.' });
            }

            if (!row) {
                if(!row.avgCooperation){
                    return res.status(404).json({ message: 'No aggregated scores available for this student.' });
                }
            }

            res.status(200).json(row);
        }
    );
});

// Get or update availability for  student
router.get('/availability', authMiddleware, (req, res) => {
    const studentId = req.user.id;

    db.get(
        `SELECT availability
         FROM availabilities
         WHERE userId = ?`,
        [studentId],
        (err, row) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ error: 'Failed to fetch availability.' });
            }

            if (!row) {
                return res.status(404).json({ message: 'No availability data found.' });
            }

            res.status(200).json(JSON.parse(row.availability));
        }
    );
});

router.post('/availability', authMiddleware, (req, res) => {
    const studentId = req.user.id;
    const { availability } = req.body;

    db.run(
        `INSERT INTO availabilities (userId, availability) VALUES (?, ?)
         ON CONFLICT(userId) DO UPDATE SET availability = ?`,
        [studentId, JSON.stringify(availability), JSON.stringify(availability)],
        function (err) {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ error: 'Failed to save availability.' });
            }
            res.status(201).json({ message: 'Availability updated successfully.' });
        }
    );
});

module.exports = router;
