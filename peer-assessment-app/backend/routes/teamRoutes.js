const express = require('express');
const router = express.Router();
const db = require('../database');

// Route to create a new team or add students to an existing team
router.post('/createOrAddStudents', (req, res) => {
  const { name, instructorId, studentIds } = req.body;
  const ids = studentIds.split(',').map((id) => id.trim());

  console.log('Received request:', { name, instructorId, studentIds });

  // Check if the team already exists
  const checkTeamQuery = 'SELECT * FROM teams WHERE name = ? AND instructor_id = ?';
  db.get(checkTeamQuery, [name, instructorId], (err, existingTeam) => {
    if (err) {
      console.error('Error checking team existence:', err);
      return res.status(500).json({ error: 'An error occurred while checking for the existing team.' });
    }

    if (existingTeam) {
      // If the team exists, add students to it
      const teamId = existingTeam.id;
      addStudentsToTeam(teamId, ids, res);
    } else {
      // If the team does not exist, create a new one
      const createTeamQuery = 'INSERT INTO teams (name, instructor_id) VALUES (?, ?)';
      db.run(createTeamQuery, [name, instructorId], function (createErr) {
        if (createErr) {
          console.error('Error creating new team:', createErr);
          return res.status(500).json({ error: 'An error occurred while creating the new team.' });
        }
        const teamId = this.lastID;
        addStudentsToTeam(teamId, ids, res);
      });
    }
  });
});

// Route to get teammates of a student
router.get('/getTeammates/:studentId', (req, res) => {
  const studentId = req.params.studentId;

  const query = `
    SELECT u.id, u.name FROM users u
    INNER JOIN team_memberships tm ON u.id = tm.student_id
    WHERE tm.team_id IN (SELECT team_id FROM team_memberships WHERE student_id = ?)
    AND u.id != ?`;

  db.all(query, [studentId, studentId], (err, rows) => {
    if (err) {
      console.error('Error fetching teammates:', err);
      return res.status(500).json({ error: 'An error occurred while fetching teammates.' });
    }
    res.json({ teammates: rows });
  });
});

// Route to get all teams with members and indicate which team the logged-in user belongs to
router.get('/allTeamsWithMembers/:studentId', (req, res) => {
  const studentId = req.params.studentId;

  const query = `
    SELECT t.id as team_id, t.name as team_name, u.id as student_id, u.name as student_name,
           CASE WHEN tm.student_id = ? THEN 1 ELSE 0 END as is_user_team
    FROM teams t
    LEFT JOIN team_memberships tm ON t.id = tm.team_id
    LEFT JOIN users u ON tm.student_id = u.id
    ORDER BY t.name, u.name`;

  db.all(query, [studentId], (err, rows) => {
    if (err) {
      console.error('Error fetching teams and members:', err);
      return res.status(500).json({ error: 'An error occurred while fetching teams and members.' });
    }

    // Group the data by team
    const teams = {};
    let userTeamId = null; // To track which team belongs to the user

    rows.forEach((row) => {
      if (!teams[row.team_id]) {
        teams[row.team_id] = { teamName: row.team_name, members: [] };
      }
      if (row.student_name) {
        teams[row.team_id].members.push(row.student_name);
      }

      if (row.is_user_team) {
        userTeamId = row.team_id; // Identify the logged-in user's team
      }
    });

    res.json({ teams, userTeamId });
  });
});

// Route to get all teams with members (for table display)
router.get('/allTeamsWithMembers', (req, res) => {
  const query = `
    SELECT t.id as team_id, t.name as team_name, u.id as student_id, u.name as student_name
    FROM teams t
    LEFT JOIN team_memberships tm ON t.id = tm.team_id
    LEFT JOIN users u ON tm.student_id = u.id
    ORDER BY t.name, u.name`;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching teams and members:', err);
      return res.status(500).json({ error: 'An error occurred while fetching teams and members.' });
    }

    // Group the data by team
    const teams = {};
    rows.forEach((row) => {
      if (!teams[row.team_id]) {
        teams[row.team_id] = { teamName: row.team_name, members: [] };
      }
      if (row.student_name) {
        teams[row.team_id].members.push({ id: row.student_id, name: row.student_name });
      }
    });

    res.json({ teams });
  });
});

// Route to remove a student from a team
router.delete('/removeStudent', (req, res) => {
  const { studentId, teamId } = req.body;

  const query = 'DELETE FROM team_memberships WHERE student_id = ? AND team_id = ?';

  db.run(query, [studentId, teamId], function (err) {
    if (err) {
      console.error('Error removing student from team:', err);
      return res.status(500).json({ error: 'An error occurred while removing the student.' });
    }

    res.json({ message: 'Student removed from the team successfully.' });
  });
});

// Helper function to add students to a team
function addStudentsToTeam(teamId, ids, res) {
  // Verify that all student IDs exist
  const placeholders = ids.map(() => '?').join(',');
  const verificationQuery = `SELECT id FROM users WHERE id IN (${placeholders})`;

  db.all(verificationQuery, ids, (err, rows) => {
    if (err) {
      console.error('Error verifying student IDs:', err);
      return res.status(500).json({ error: 'An error occurred while verifying student IDs.' });
    }

    // Check if all IDs were found
    if (rows.length !== ids.length) {
      const missingIds = ids.filter((id) => !rows.find((row) => row.id === parseInt(id)));
      return res.status(400).json({ message: `The following student IDs do not exist: ${missingIds.join(', ')}` });
    }

    // Add each student to the team
    const insertQuery = `INSERT INTO team_memberships (team_id, student_id) VALUES (?, ?)`;
    const addStudentsPromises = ids.map(
      (studentId) =>
        new Promise((resolve, reject) => {
          db.run(insertQuery, [teamId, studentId], function (insertErr) {
            if (insertErr) {
              reject(insertErr);
            } else {
              resolve();
            }
          });
        })
    );

    Promise.all(addStudentsPromises)
      .then(() => {
        console.log('Students successfully added to the team:', ids);
        res.json({ message: 'Students added to the team successfully' });
      })
      .catch((insertErr) => {
        console.error('Error adding students to the team:', insertErr);
        res.status(500).json({ error: 'An error occurred while adding students to the team.' });
      });
  });
}

module.exports = router;
