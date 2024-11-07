const express = require('express');
const router = express.Router();
const db = require('../database');

//Route to submit a peer assessment
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

//Route to get anonymous feedback for a student
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
//Route to get all assessments
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

// Route to get detailed results for a student in a team
router.get('/details', (req, res) => {
  const { studentId, teamId } = req.query;

  if (!studentId || !teamId) {
    return res.status(400).json({ error: 'studentId and teamId are required' });
  }

  const query = `
    SELECT
      a.cooperation, a.conceptual_contribution, a.practical_contribution, a.work_ethic, a.comments,
      u.name AS student_name,
      t.name AS teammate_name
    FROM assessments a
    INNER JOIN users u ON a.student_id = u.id
    INNER JOIN users t ON a.teammate_id = t.id
    WHERE a.teammate_id = ? AND tm.team_id = ?;
  `;

  db.all(query, [studentId, teamId], (err, rows) => {
    if (err) {
      console.error('Error fetching detailed results:', err);
      return res.status(500).json({ error: 'An error occurred while fetching detailed results.' });
    }
    res.json({ details: rows });
  });
});

// Route to get all assessments with filtering options
router.get('/allAssessments', (req, res) => {
  const { teamId, studentName, studentId } = req.query;
  let query = `
    SELECT
      a.*, u.name AS student_name, t.name AS teammate_name, tm.team_id
    FROM assessments a
    INNER JOIN users u ON a.student_id = u.id
    INNER JOIN users t ON a.teammate_id = t.id
    INNER JOIN team_memberships tm ON a.student_id = tm.student_id
    WHERE 1=1
  `;
  const params = [];
  if (teamId) {
    query += ' AND tm.team_id = ?';
    params.push(teamId);
  }
  if (studentName) {
    query += ' AND u.name LIKE ?';
    params.push(`%${studentName}%`);
  }
  if (studentId) {
    query += ' AND u.id = ?';
    params.push(studentId);
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Error fetching assessments:', err);
      return res.status(500).json({ error: 'An error occurred while fetching assessments.' });
    }
    res.json({ assessments: rows });
  });
});

module.exports = router;
