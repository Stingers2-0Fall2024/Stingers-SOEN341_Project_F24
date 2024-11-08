const express = require('express');
const db = require('../database/db');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Submit Peer Assessment
router.post('/', authMiddleware, (req, res) => {
    const { revieweeId, cooperation, conceptualContribution, practicalContribution, workEthic, comments } = req.body;
    const reviewerId = req.user.id;

    // Validate input
    if (!revieweeId || !cooperation || !conceptualContribution || !practicalContribution || !workEthic) {
        return res.status(400).json({ message: 'All dimensions and revieweeId are required.' });
    }

    // Insert the peer assessment into the database
    db.run(
        `INSERT INTO evaluations 
         (reviewerId, revieweeId, cooperation, conceptualContribution, practicalContribution, workEthic, comments)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [reviewerId, revieweeId, cooperation, conceptualContribution, practicalContribution, workEthic, comments || null],
        function (err) {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ error: 'Failed to save the evaluation.' });
            }
            res.status(201).json({ message: 'Evaluation submitted successfully.', id: this.lastID });
        }
    );
});

//Peer Evaluations for a Specific Student
router.get('/:studentId', authMiddleware, (req, res) => {
    const { studentId } = req.params;
    //all evaluations where the student is the reviewee
    db.all(
        `SELECT evaluations.*, users.name AS reviewerName
         FROM evaluations
         JOIN users ON evaluations.reviewerId = users.id
         WHERE evaluations.revieweeId = ?`,
        [studentId],
        (err, rows) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ error: 'Failed to fetch evaluations.' });
            }

            // If no evaluations found
            if (rows.length === 0) {
                return res.status(404).json({ message: 'No evaluations found for this student.' });
            }
            res.status(200).json(rows);
        }
    );
});

// Aggregated Scores for a Specific Student
router.get('/aggregate/:studentId', authMiddleware, (req, res) => {
    const { studentId } = req.params;

    // Fetch scores for the instructor
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

            // If no evaluations found
            if (!row || !row.avgCooperation) {
                return res.status(404).json({ message: 'No aggregated scores available for this student.' });
            }

            res.status(200).json(row);
        }
    );
});
