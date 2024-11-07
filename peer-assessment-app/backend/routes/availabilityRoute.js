const express = require('express');
const router =express.Router();
const db = require('../database');

// Route to save or update availability
router.post('/saveAvailability', (req, res) => {
  const { studentId, availability } = req.body;

  const deleteQuery= 'DELETE FROM availability WHERE student_id = ?';
  db.run(deleteQuery, [studentId], function(err) {
    if (err) {
      console.error('Error deleting availability:', err);
      return res.status(500).json({ error: 'An error occurred while updating availability.' });
    }
    const insertQuery ='INSERT INTO availability (student_id, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?)';
    const insertPromises=availability.map(slot => {
      return new Promise((resolve, reject) => {
        db.run(insertQuery, [studentId, slot.day_of_week, slot.start_time, slot.end_time], function(err) {
          if (err) reject(err);
          else resolve();
        });
      });
    });
    Promise.all(insertPromises)
      .then(() => res.json({ message: 'Availability updated successfully.' }))
      .catch(err => res.status(500).json({ error: 'An error occurred while saving availability.' }));
  });
});

module.exports = router;
