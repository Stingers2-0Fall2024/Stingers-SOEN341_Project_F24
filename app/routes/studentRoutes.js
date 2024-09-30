// routes/studentRoutes.js
const express = require('express');
const Students = require('../server/studentController');
const router = express.Router();

// Route to get all students
router.get('/students', (req, res) => {
  res.json({
    students: Students.getStudents(),
    count: Students.getCount(),
  });
});

// Route to add a student
router.post('/students', (req, res) => {
  const { id, name, email, pass } = req.body;
  if (!id || !name || !email || !pass) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const newStudent = Students.addStudent(id, name, email, pass);
  res.json(newStudent);
});

module.exports = router;