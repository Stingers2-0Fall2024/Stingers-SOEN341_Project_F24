const express = require('express');
const router = express.Router();
const db = require('../database');

// Route to submit a peer assessment
router.post('/submit', (req, res) => {
  const { studentId, teammateId, cooperation, conceptualContribution, practicalContribution, workEthic, comments } = req.body;

  const query = `INSERT INTO assessments (student_id, teammate_id, cooperation, conceptual_contribution, practical_contribution, work_ethic, comments)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.run(query, [studentId, teammateId, cooperation, conceptualContribution, practicalContribution, workEthic, comments], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ assessment_id: this.lastID });
  });
});

// Route to get anonymous feedback for a student
router.get('/feedback/:studentId', (req, res) => {
  const studentId = req.params.studentId;

  const query = `
    SELECT cooperation, conceptual_contribution, practical_contribution, work_ethic, comments
    FROM assessments
    WHERE teammate_id = ?`;

  db.all(query, [studentId], (err, rows) => {
    if (err) {
      console.error('Error fetching feedback:', err);
      return res.status(500).json({ error: 'An error occurred while fetching feedback.' });
    }
    res.json({ feedback: rows });
  });
});

// Route to get all assessments
router.get('/allAssessments', (req, res) => {
  const query = `
    SELECT a.*, u.name as student_name, t.name as teammate_name
    FROM assessments a
    INNER JOIN users u ON a.student_id = u.id
    INNER JOIN users t ON a.teammate_id = t.id`;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching assessments:', err);
      return res.status(500).json({ error: 'An error occurred while fetching assessments.' });
    }
    res.json({ assessments: rows });
  });
});

// Route to get a summary of peer assessments
router.get('/summary', (req, res) => {
  const query = `
    SELECT
      a.teammate_id AS student_id,
      u.name AS student_name,
      AVG(a.cooperation) AS avg_cooperation,
      AVG(a.conceptual_contribution) AS avg_conceptual_contribution,
      AVG(a.practical_contribution) AS avg_practical_contribution,
      AVG(a.work_ethic) AS avg_work_ethic
    FROM assessments a
    INNER JOIN users u ON a.teammate_id = u.id
    GROUP BY a.teammate_id, u.name;
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching summary:', err);
      return res.status(500).json({ error: 'An error occurred while fetching the summary.' });
    }
    res.json({ summary: rows });
  });
});

module.exports = router;
