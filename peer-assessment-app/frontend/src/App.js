import React, { useState } from 'react';
import Login from './components/Login';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser); // Store the logged-in user information
  };

  return (
    <div className="App">
      <h1>Peer Assessment App</h1>
      {!user ? (
        <Login onLogin={handleLogin} /> // Show login if no user is logged in
      ) : user.role === 'teacher' ? (
        <TeacherDashboard /> // Show teacher dashboard if logged in as teacher
      ) : (
        <StudentDashboard studentId={user.id} /> // Pass studentId to the student dashboard
      )}
    </div>
  );
}

export default App;
