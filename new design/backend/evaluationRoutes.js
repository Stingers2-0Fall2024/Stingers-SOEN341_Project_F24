const express = require('express');
const db = require('../database/db');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Submit an evaluation
router.post('/', authMiddleware, (req, res) => {
    const { revieweeId, cooperation, conceptualContribution, practicalContribution, workEthic, comments } = req.body;
    const reviewerId = req.user.id;

    db.run(
        `INSERT INTO evaluations (reviewerId, revieweeId, cooperation, conceptualContribution, practicalContribution, workEthic, comments)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [reviewerId, revieweeId, cooperation, conceptualContribution, practicalContribution, workEthic, comments],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID });
        }
    );
});

// Get evaluations for a student
router.get('/:studentId', authMiddleware, (req, res) => {
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
