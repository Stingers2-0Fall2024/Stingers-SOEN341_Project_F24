const express = require('express');
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');
const db = require('../database');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), (req, res) => {
  const filePath = req.file.path;
  const students = [];

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (row) => {
      students.push({ name: row.name, email: row.email, password: row.password });
    })
    .on('end', () => {
      students.forEach((student) => {
        db.run('INSERT INTO users (name, email, role, password) VALUES (?, ?, ?, ?)', [student.name, student.email, 'student', student.password]);
      });
      res.json({ message: 'Students added successfully' });
    });
});

module.exports = router;
