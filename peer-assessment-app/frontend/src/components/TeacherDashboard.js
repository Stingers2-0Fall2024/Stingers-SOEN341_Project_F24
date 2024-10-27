import React from 'react';
import CSVUpload from './CSVUpload';
import CreateTeam from './CreateTeam';
import AllAssessments from './AllAssessments';
import TeamBoard from './TeamBoard_Remove';

const TeacherDashboard = () => {
  return (
    <div>
      <h2>Welcome, Teacher!</h2>
      <h3>Here you can Upload students to the database with a CSV file.</h3>
      <CSVUpload />
      <CreateTeam />
      <AllAssessments />
      <TeamBoard />
    </div>
  );
};

export default TeacherDashboard;
