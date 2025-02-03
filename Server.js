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

app.use('/profile', require('./routes/profileRoutes'));

app.use('/auth', require('./routes/authRoutes'));

app.use('/admin-projects', require('./routes/adminProjectRoutes'));

app.use('/manageusers', require('./routes/addUsersRoutes'));

app.use('/joinedprojects', require('./routes/joinedProjectRoutes'));

app.use('/manageTasks', require('./routes/taskRoutes'));

app.use('/projecttasks', require('./routes/usersProjectTasksRoutes'));

app.use('/comments', require('./routes/commentsRoutes'));

app.use('/projects', require('./routes/projectRoutes'));


// will return a single task also
app.use('/project-tasks', require('./routes/projectTasksRoutes'));
 

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Socket Server running on port ${PORT}`));
//app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
