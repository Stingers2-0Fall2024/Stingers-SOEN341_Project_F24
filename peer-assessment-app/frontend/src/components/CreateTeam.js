import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

const port = process.env.PORT || 5001;

const CreateTeam = () => {
  const [teamName, setTeamName] = useState('');
  const [studentIds, setStudentIds] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCreateOrAddStudents = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrorMessage('');
  
    try {
      const response = await fetch('http://localhost:'+port+'/api/teams/createOrAddStudents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: teamName, instructorId: 1, studentIds }),
      });
  
      // Check if the response is not OK (status code outside 200-299)
      if (!response.ok) {
        const text = await response.text(); // Read response as text
        throw new Error(text); // Throw an error with the response text
      }
  
      const data = await response.json(); // Parse JSON response
      setMessage(data.message);
      setStudentIds('');
    } catch (error) {
      setErrorMessage(error.message || 'An unexpected error occurred.');
    }
  };
  
  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create or Add to Team
        </Typography>
        <form onSubmit={handleCreateOrAddStudents}>
          <TextField
            fullWidth
            margin="normal"
            label="Team Name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            helperText="Enter the team name. If the team already exists, students will be added to it."
          />
          <TextField
            fullWidth
            margin="normal"
            label="Student IDs (comma-separated)"
            value={studentIds}
            onChange={(e) => setStudentIds(e.target.value)}
            helperText="Add multiple students by separating their IDs with commas (e.g., 101, 102, 103)"
          />
          <Button type="submit" fullWidth variant="contained" color="primary">
            Submit
          </Button>
        </form>
        {message && (
          <Typography color="primary" variant="body1">
            {message}
          </Typography>
        )}
        {errorMessage && (
          <Typography color="error" variant="body1">
            {errorMessage}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default CreateTeam;
