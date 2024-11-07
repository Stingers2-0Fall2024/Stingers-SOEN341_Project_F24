const express = require('express');
const router = express.Router();
const db = require('../database');

// Route to save or update availability 
router.post('/saveAvailability',(req, res) => {
  const { studentId, availability } =req.body;

  //Delete existing availability for the student
  const deleteQuery='DELETE FROM availability WHERE student_id = ?';
  db.run(deleteQuery, [studentId], function(err) {
    if (err) {
      console.error('Error deleting availability:', err);
      return res.status(500).json({ error: 'An error occurred while updating availability.' });
    }
    // Insert new availabilities for the student
    const insertQuery = 'INSERT INTO availability (student_id, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?)';
    const insertPromises = availability.map(slot => {
      return new Promise((resolve, reject) => {
        db.run(insertQuery, [studentId, slot.day_of_week, slot.start_time, slot.end_time], function(err) {
          if (err) {
            console.error('Error inserting availability:', err);
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });

    Promise.all(insertPromises)
      .then(() => res.json({ message: 'Availability updated successfully.' }))
      .catch(err => res.status(500).json({ error: 'An error occurred while saving availability.' }));
  });
});

// Route to get team members overlapping availability based on team ID
router.get('/teamAvailability/:teamId', (req, res) => {
  const teamId = req.params.teamId;
  const teamMembersQuery = 'SELECT student_id FROM team_memberships WHERE team_id = ?';
  db.all(teamMembersQuery, [teamId], (err, members) => {
    if (err) {
      console.error('Error fetching team members:', err);
      return res.status(500).json({ error: 'An error occurred while fetching team members.' });
    }
    const studentIds = members.map(member => member.student_id);
    if (studentIds.length === 0) {
      return res.json({ overlappingAvailability: [] });
    }
    const placeholders = studentIds.map(() => '?').join(',');
    const availabilityQuery = `SELECT * FROM availability WHERE student_id IN (${placeholders})`;
    db.all(availabilityQuery, studentIds, (err, availabilities) => {
      if (err) {
        console.error('Error fetching availability:', err);
        return res.status(500).json({ error: 'An error occurred while fetching availability.' });
      }

      const overlappingAvailability = computeOverlappingAvailability(availabilities, studentIds);
      res.json({ overlappingAvailability });
    });
  });
});

// Overlapping availability
function computeOverlappingAvailability(availabilities, studentIds) {
  const availabilityByDay = {};

  for (let i = 0; i < 7; i++) {
    availabilityByDay[i] = [];
  }
  availabilities.forEach(avail => {
    availabilityByDay[avail.day_of_week].push({
      student_id: avail.student_id,
      start_time: timeStringToMinutes(avail.start_time),
      end_time: timeStringToMinutes(avail.end_time)
    });
  });

  const overlappingAvailability = {};

  for (let day in availabilityByDay) {
    const dayAvailabilities = availabilityByDay[day];
    const intervalsPerStudent = {};

    studentIds.forEach(id => {
      intervalsPerStudent[id] = dayAvailabilities.filter(avail => avail.student_id === id);
    });

    const commonIntervals = findCommonIntervals(Object.values(intervalsPerStudent));
    overlappingAvailability[day] = commonIntervals.map(interval => ({
      start_time: minutesToTimeString(interval.start),
      end_time: minutesToTimeString(interval.end)
    }));
  }

  return overlappingAvailability;
}

//Convert time string to minutes
function timeStringToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

//Convert minutes to time string
function minutesToTimeString(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

//Find common intervals
function findCommonIntervals(intervalsList) {
  if (intervalsList.length === 0) return [];

  let common = intervalsList[0];

  for (let i = 1; i < intervalsList.length; i++) {
    common = getOverlap(common, intervalsList[i]);
    if (common.length === 0) break;
  }

  return common;
}

//get overlapping intervals
function getOverlap(intervals1, intervals2) {
  const overlap=[];
  intervals1.forEach(int1 => {
    intervals2.forEach(int2 => {
      const start = Math.max(int1.start_time, int2.start_time);
      const end = Math.min(int1.end_time, int2.end_time);
      if (start < end) {
        overlap.push({ start, end });
      }
    });
  });
  return overlap;
}
module.exports = router;
