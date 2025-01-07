const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./Config/db');  
const path = require('path');
const http = require('http');
const { initSocket } = require('./socket');

dotenv.config();
connectDB();
const app = express();

const server = http.createServer(app);
initSocket(server); 
app.use(cors());
app.use(express.json());

// Serve static files from the 'uploads' directory
 
app.use('/overview', require('./routes/dashboardRoutes'));

app.use('/profile', require('./routes/authRoutes'));

app.use('/viewProjects', require('./routes/viewProjectsRoutes'));

app.use('/manageusers', require('./routes/fetchUsersRoutes'));

app.use('/joinedprojects', require('./routes/getJoinedProjectRoutes'));

app.use('/manageTasks', require('./routes/taskRoutes'));

app.use('/projecttasks', require('./routes/getUsersProjectTasksRoutes'));

app.use('/comments', require('./routes/commentsRoutes'));

app.use('/projects', require('./routes/projectRoutes'));


// will return a single task also
app.use('/project-tasks', require('./routes/getProjectTasksRoutes'));
 

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Scoket Server running on port ${PORT}`));
//app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
