// studentCabinetRoutes.js
const express = require('express');
const router = express.Router();
const Teams = require('../models/teamModel');  // For team data
const PeerAssessment = require('../models/peerAssessmentModel'); // For peer assessment
const Comment = require('../models/commentModel'); // Teacher's comment 
const multer = require('multer');  // For file uploads
const csv = require('csv-parser');
const fs = require('fs');

// Configuration for file uploads
const upload=multer({ dest:'uploads/' });

// Route for the student's team info
router.get('/team/:studentId', async (req, res) => {
    const studentId=req.params.studentId;

    try {
        const team =await Teams.findOne({ where: { studentId } });
        if (!team) {
            return res.status(404).json({ error: 'No team' });
        }
        res.json({ team });
    } catch (error) {
        res.status(500).json({ error: 'ERROR' });
    }
});

// Route for teacher's comment
router.get('/teacher-comment', async (req, res) => {
    try {
        const comment = await Comment.findOne({ where: { studentId: req.query.studentId } });
        if (!comment) {
            return res.status(404).json({ error: 'No comment' });
        }
        res.json({comment});
    } catch (error) {
        res.status(500).json({ error: 'ERROR' });
    }
});

// Route for peer assessment
router.post('/peer-assessment', async (req, res) => {
    const {assessments,studentId} = req.body;

    try {
        for (let assessment of assessments) {
            await PeerAssessment.create({
                studentId,
                teammateId: assessment.teammateId,
                collaboration: assessment.collaboration,
                communication: assessment.communication,
                contribution: assessment.contribution,
                conceptualContribution: assessment.conceptualContribution,
                practicalContribution: assessment.practicalContribution,
                workEthic: assessment.workEthic,
                comment: assessment.comment
            });
        }

        res.json({ message: 'Peer assessment SUCCESSFULL!' });
    } catch (error) {
        res.status(500).json({ error: 'ERROR' });
    }
});

// Route to handle CSV file upload and processing
router.post('/upload-csv', upload.single('csvFile'), (req, res) => {
    const results = [];
  
    // Reading CSV file
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', () => {
        //Return data for frontend
        res.json(results); 
      });
});
module.exports = router;
