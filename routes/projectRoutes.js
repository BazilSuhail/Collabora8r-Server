// routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const projectController = require('../controllers/ProjectController');
const authenticateUser  = require('../middleware/authMiddleware');

// Route to create a new project (only accessible to authenticated users)
router.post('/create', authenticateUser, projectController.createProject);

// Route to join an existing project (only accessible to authenticated users)
router.post('/join', authenticateUser, projectController.joinProject);

// Route to get all users (for selecting a project manager)
router.get('/users', authenticateUser, projectController.getAllUsers); // Ensure authentication

module.exports = router;
