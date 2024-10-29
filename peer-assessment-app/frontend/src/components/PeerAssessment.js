import React, { useState, useEffect } from 'react';
import { Slider, Button, Container, Typography, TextField, Box, MenuItem, Select } from '@mui/material';

const port = process.env.PORT || 5001;

const PeerAssessment = ({ studentId }) => {
  const [teammates, setTeammates] = useState([]);
  const [assessment, setAssessment] = useState({
    teammateId: '',
    cooperation: 3,
    conceptualContribution: 3,
    practicalContribution: 3,
    workEthic: 3,
    comments: '',
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Fetch teammates of the student
    const fetchTeammates = async () => {
      try {
        const response = await fetch('http://localhost:'+port+`/api/teams/getTeammates/${studentId}`);
        const data = await response.json();
        setTeammates(data.teammates);
      } catch (error) {
        console.error('Error fetching teammates:', error);
      }
    };

    fetchTeammates();
  }, [studentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:'+port+'/api/assessments/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId, // Send the studentId along with the assessment data
          teammateId: assessment.teammateId,
          cooperation: assessment.cooperation,
          conceptualContribution: assessment.conceptualContribution,
          practicalContribution: assessment.practicalContribution,
          workEthic: assessment.workEthic,
          comments: assessment.comments,
        }),
      });
      const data = await response.json();
      setSubmitted(true);
      console.log('Assessment submitted:', data);
    } catch (error) {
      console.error('Error submitting assessment:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      {submitted ? (
        <Typography variant="h5" component="p" gutterBottom>
          Assessment Submitted
        </Typography>
      ) : (
        <Box mt={5}>
          <Typography variant="h4" component="h1" gutterBottom>
            Peer Assessment
          </Typography>
          <form onSubmit={handleSubmit}>
            <Select
              fullWidth
              value={assessment.teammateId}
              onChange={(e) => setAssessment({ ...assessment, teammateId: e.target.value })}
              displayEmpty
            >
              <MenuItem value="" disabled>
                Select a teammate
              </MenuItem>
              {teammates.map((teammate) => (
                <MenuItem key={teammate.id} value={teammate.id}>
                  {teammate.name}
                </MenuItem>
              ))}
            </Select>
            <Typography gutterBottom>Cooperation</Typography>
            <Slider
              value={assessment.cooperation}
              min={1}
              max={5}
              onChange={(e, value) => setAssessment({ ...assessment, cooperation: value })}
            />
            <Typography gutterBottom>Conceptual Contribution</Typography>
            <Slider
              value={assessment.conceptualContribution}
              min={1}
              max={5}
              onChange={(e, value) => setAssessment({ ...assessment, conceptualContribution: value })}
            />
            <Typography gutterBottom>Practical Contribution</Typography>
            <Slider
              value={assessment.practicalContribution}
              min={1}
              max={5}
              onChange={(e, value) => setAssessment({ ...assessment, practicalContribution: value })}
            />
            <Typography gutterBottom>Work Ethic</Typography>
            <Slider
              value={assessment.workEthic}
              min={1}
              max={5}
              onChange={(e, value) => setAssessment({ ...assessment, workEthic: value })}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Comments (Optional)"
              multiline
              rows={4}
              value={assessment.comments}
              onChange={(e) => setAssessment({ ...assessment, comments: e.target.value })}
            />
            <Button type="submit" fullWidth variant="contained" color="primary">
              Submit Assessment
            </Button>
          </form>
        </Box>
      )}
    </Container>
  );
};

export default PeerAssessment;
