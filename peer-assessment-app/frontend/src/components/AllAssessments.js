import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, List, ListItem } from '@mui/material';

const port = process.env.PORT || 5001;

const AllAssessments = () => {
  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    const fetchAssessments = async () => {
      const response = await fetch('http://localhost:'+port+'/api/assessments/allAssessments');
      const data = await response.json();
      setAssessments(data.assessments);
    };

    fetchAssessments();
  }, []);

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" component="h1" gutterBottom>
          All Assessments
        </Typography>
        <List>
          {assessments.map((assessment, index) => (
            <ListItem key={index}>
              <Typography>
                Student: {assessment.student_name} rated {assessment.teammate_name}<br />
                Cooperation: {assessment.cooperation}, Conceptual Contribution: {assessment.conceptual_contribution}, Practical Contribution: {assessment.practical_contribution}, Work Ethic: {assessment.work_ethic}<br />
                Comments: {assessment.comments}
              </Typography>
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default AllAssessments;
