import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';

const port = process.env.PORT || 5001;

const TeamBoard = () => {
  const [teams, setTeams] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch teams with members
    const fetchTeams = async () => {
      const response = await fetch('http://localhost:'+port+'/api/teams/allTeamsWithMembers');
      const data = await response.json();
      setTeams(data.teams);
    };

    fetchTeams();
  }, []);

  const handleRemoveStudent = async (studentId, teamId) => {
    try {
      const response = await fetch('http://localhost:'+port+'/api/teams/removeStudent', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, teamId }),
      });

      const data = await response.json();
      setMessage(data.message);

      // Update the team board to reflect the removed student
      setTeams((prevTeams) => {
        const updatedTeams = { ...prevTeams };
        updatedTeams[teamId].members = updatedTeams[teamId].members.filter((member) => member.id !== studentId);
        return updatedTeams;
      });
    } catch (error) {
      console.error('Error removing student:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box mt={5}>
        <Typography variant="h4" component="h1" gutterBottom>
          Team Board
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              {Object.entries(teams).map(([teamId, team]) => (
                <TableCell key={teamId}>
                  <Typography variant="h6">{team.teamName}</Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {Object.entries(teams).map(([teamId, team]) => (
                <TableCell key={teamId}>
                  {team.members.map((member) => (
                    <Box key={member.id} mb={2}>
                      <Typography variant="body1">
                        {member.name} (ID: {member.id})
                      </Typography>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleRemoveStudent(member.id, teamId)}
                      >
                        Remove
                      </Button>
                    </Box>
                  ))}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
        {message && (
          <Typography color="primary" variant="body1" mt={3}>
            {message}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default TeamBoard;
