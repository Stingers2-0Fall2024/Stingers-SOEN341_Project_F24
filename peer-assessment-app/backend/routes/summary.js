const express = require('express');
const router = express.Router();

// Mock data for student results (replace this with actual data from your database)
const results = [
  {
    id: 1,
    lastName: "Doe",
    firstName: "John",
    team: "Team A",
    cooperation: 4,
    conceptualContribution: 3.5,
    practicalContribution: 4,
    workEthic: 3.8,
    average: 3.83,
    numberOfPeersResponded: 5
  },
  {
    id: 2,
    lastName: "Smith",
    firstName: "Jane",
    team: "Team B",
    cooperation: 4.2,
    conceptualContribution: 3.8,
    practicalContribution: 4.5,
    workEthic: 4.0,
    average: 4.13,
    numberOfPeersResponded: 6
  }
];

// Route to get student results
router.get('/results', (req, res) => {
  res.json({ results });
});

module.exports = router;
