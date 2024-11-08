const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./authRoutes');
const assessmentRoutes = require('./assessmentRoutes');
const availabilityRoutes = require('./availabilityRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const studentDashboardRoutes = require('./studentDashboardRoutes');
const teamRoutes = require('./teamRoutes');
const app = express();
app.use(cors());
app.use(bodyParser.json());


app.use('/api/auth', authRoutes); 
app.use('/api/assessments', assessmentRoutes); 
app.use('/api/availability', availabilityRoutes); 
app.use('/api/dashboard', dashboardRoutes); 
app.use('/api/student', studentDashboardRoutes);
app.use('/api/teams', teamRoutes); 

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
