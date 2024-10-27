import React from 'react';
import PeerAssessment from './PeerAssessment';
import TeamsPage from './TeamsPage';
import FeedbackPage from './FeedbackPage';

const StudentDashboard = ({ studentId }) => {
  return (
    <div>
      <h2>Welcome, Student!</h2>
      <PeerAssessment studentId={studentId} /> {/* Pass studentId to PeerAssessment */}
      <TeamsPage studentId={studentId} />
      <FeedbackPage studentId={studentId} />
    </div>
  );
};

export default StudentDashboard;
