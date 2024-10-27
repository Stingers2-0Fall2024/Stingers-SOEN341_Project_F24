import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Confirmation = () => {
  return (
    <Container maxWidth="sm">
      <Box mt={5} textAlign="center">
        <Typography variant="h4" component="h1" gutterBottom>
          Assessment Submitted
        </Typography>
        <Typography variant="body1">
          Thank you for submitting your peer assessment. Your feedback has been recorded.
        </Typography>
      </Box>
    </Container>
  );
};

export default Confirmation;
