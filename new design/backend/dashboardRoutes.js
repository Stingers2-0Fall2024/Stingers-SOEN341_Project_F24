const express = require('express');
const db = require('../database/db');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const router = express.Router();

// Fetch Summary View
router.get('/summary', authMiddleware, roleMiddleware('instructor'), (req, res) => {
    db.all(
        `SELECT teams.teamName, users.id AS studentId, users.name AS studentName, AVG(cooperation) AS avgCooperation,
            AVG(conceptualContribution) AS avgConceptual, AVG(practicalContribution) AS avgPractical,
            AVG(workEthic) AS avgWorkEthic
         FROM evaluations
         INNER JOIN users ON evaluations.revieweeId = users.id
         INNER JOIN team_members ON users.id = team_members.userId
         INNER JOIN teams ON team_members.teamId = teams.id
         GROUP BY teams.teamName, users.id`,
        [],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        }
    );
});

// Fetch Detailed View for a Student
router.get('/details/:studentId', authMiddleware, roleMiddleware('instructor'), (req, res) => {
    const { studentId } = req.params;

    db.all(
        `SELECT evaluations.*, reviewers.name AS reviewerName
         FROM evaluations
         LEFT JOIN users AS reviewers ON evaluations.reviewerId = reviewers.id
         WHERE evaluations.revieweeId = ?`,
        [studentId],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        }
    );
});
