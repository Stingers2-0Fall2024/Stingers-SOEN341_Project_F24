import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, List, ListItem } from '@mui/material';

const port = process.env.PORT || 5001;

const TeamsPage = ({ studentId }) => {
  const [teams, setTeams] = useState([]);
  const [userTeamId, setUserTeamId] = useState(null);

  useEffect(() => {
    // Fetch all teams with members and the user's team
    const fetchTeams = async () => {
      const response = await fetch('http://localhost:'+port+`/api/teams/allTeamsWithMembers/${studentId}`);
      const data = await response.json();
      setTeams(data.teams);
      setUserTeamId(data.userTeamId); // Store the logged-in user's team ID
    };

    fetchTeams();
  }, [studentId]);

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" component="h1" gutterBottom>
          Teams and Members
        </Typography>
        <List>
          {Object.entries(teams).map(([teamId, team]) => (
            <ListItem key={teamId}>
              <Box>
                <Typography variant="h6" gutterBottom style={{ fontWeight: teamId === String(userTeamId) ? 'bold' : 'normal' }}>
                  {team.teamName} {teamId === String(userTeamId) && '(Your Team)'}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Members: {team.members.length > 0 ? team.members.join(', ') : 'No members in this team'}
                </Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default TeamsPage;
