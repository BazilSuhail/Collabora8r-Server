const express = require('express');
const connectDB = require('./Config/db');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();


// Connect to database
connectDB();

app.use(cors());
app.use(express.json());

// Serve static files from the 'uploads' directory
 
app.use('/overview', require('./routes/dashboardRoutes'));

app.use('/profile', require('./routes/authRoutes'));

app.use('/viewProjects', require('./routes/viewProjectsRoutes'));

app.use('/manageusers', require('./routes/fetchUsersRoutes'));

app.use('/joinedprojects', require('./routes/getJoinedProjectRoutes'));

app.use('/manageTasks', require('./routes/taskRoutes'));

app.use('/projecttasks', require('./routes/getProjectTasksRoutes'));

app.use('/comments', require('./routes/commentsRoutes'));

app.use('/projects', require('./routes/projectRoutes'));
 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
