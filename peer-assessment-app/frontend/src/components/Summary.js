import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const port = process.env.PORT || 5001;

const StudentSummary = () => {
  const [studentResults, setStudentResults] = useState([]);

  // Fetch the student results data from the backend
  useEffect(() => {
    const fetchStudentResults = async () => {
      try {
        const response = await fetch(`http://localhost:${port}/api/assessments/results`);  // Correct endpoint
        const data = await response.json();
        setStudentResults(data.results); // Assuming data.results is an array of student results
      } catch (error) {
        console.error('Error fetching student results:', error);
      }
    };

    fetchStudentResults();
  }, []);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Student Assessment Results
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student ID</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Team</TableCell>
              <TableCell align="right">Cooperation</TableCell>
              <TableCell align="right">Conceptual Contribution</TableCell>
              <TableCell align="right">Practical Contribution</TableCell>
              <TableCell align="right">Work Ethic</TableCell>
              <TableCell align="right">Average</TableCell>
              <TableCell align="right">Number of Peers Who Responded</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Map through the studentResults and render each student's row */}
            {studentResults.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.id}</TableCell>
                <TableCell>{student.lastName}</TableCell>
                <TableCell>{student.firstName}</TableCell>
                <TableCell>{student.team}</TableCell>
                <TableCell align="right">{student.cooperation}</TableCell>
                <TableCell align="right">{student.conceptualContribution}</TableCell>
                <TableCell align="right">{student.practicalContribution}</TableCell>
                <TableCell align="right">{student.workEthic}</TableCell>
                <TableCell align="right">{student.average}</TableCell>
                <TableCell align="right">{student.numberOfPeersResponded}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default StudentSummary;
