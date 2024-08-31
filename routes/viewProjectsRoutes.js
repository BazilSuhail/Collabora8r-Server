const express = require('express');
const router = express.Router();
const projectController = require('../controllers/viewProjectsController');
const authenticateUser = require('../middleware/authMiddleware');

// Route to get all projects created by the logged-in admin
router.get('/admin', authenticateUser, projectController.getCreatedProjects);

// Route to get details of a specific project
router.get('/:projectId', authenticateUser, projectController.getProjectDetails);

// Route to add a user to a project
// router.post('/addUser', authenticateUser, projectController.addUserToProject);

// Route to get all users except the logged-in admin (no authentication required)

router.get('/fetchUsers', projectController.getAllUsers);

module.exports = router;
