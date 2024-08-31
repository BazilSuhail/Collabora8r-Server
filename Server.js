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
 

app.use('/profile', require('./routes/authRoutes'));

app.use('/viewProjects', require('./routes/viewProjectsRoutes'));
app.use('/fetchusers', require('./routes/fetchUsersRoutes'));

app.use('/projects', require('./routes/projectRoutes'));
 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
