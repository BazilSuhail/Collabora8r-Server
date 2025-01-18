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
 
app.use('/overview', require('./routes/DashboardRoutes'));
app.use('/profile', require('./routes/ProfileRoutes'));

app.use('/auth', require('./routes/AuthRoutes'));

app.use('/admin-projects', require('./routes/AdminProjectRoutes'));

app.use('/manageusers', require('./routes/AddUsersRoutes'));

app.use('/joinedprojects', require('./routes/JoinedProjectRoutes'));

app.use('/manageTasks', require('./routes/TaskRoutes'));

app.use('/projecttasks', require('./routes/UsersProjectTasksRoutes'));

app.use('/comments', require('./routes/CommentsRoutes'));

app.use('/projects', require('./routes/ProjectRoutes'));


// will return a single task also
app.use('/project-tasks', require('./routes/ProjectTasksRoutes'));
 

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Scoket Server running on port ${PORT}`));
//app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
