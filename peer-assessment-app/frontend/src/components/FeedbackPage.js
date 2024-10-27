import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, List, ListItem } from '@mui/material';

const port = process.env.PORT || 5001;

const FeedbackPage = ({ studentId }) => {
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    const fetchFeedback = async () => {
      const response = await fetch('http://localhost:'+port+`/api/assessments/feedback/${studentId}`);
      const data = await response.json();
      setFeedback(data.feedback);
    };

    fetchFeedback();
  }, [studentId]);

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Feedback
        </Typography>
        <List>
          {feedback.map((fb, index) => (
            <ListItem key={index}>
              <Typography>
                Cooperation: {fb.cooperation}, Conceptual Contribution: {fb.conceptual_contribution}, Practical Contribution: {fb.practical_contribution}, Work Ethic: {fb.work_ethic}<br />
                Comments: {fb.comments}
              </Typography>
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default FeedbackPage;
