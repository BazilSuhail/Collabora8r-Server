const express = require('express');
const router = express.Router();
const projectController = require('../controllers/AdminProjectController');
const authenticateUser = require('../middleware/authMiddleware');

// Route to get all projects created by the logged-in admin
router.get('/', authenticateUser, projectController.getCreatedProjects);

// Route to get details of a specific project
router.get('/:projectId', authenticateUser, projectController.getProjectDetails);
router.post('/get-searched-user', authenticateUser, projectController.searchUserByEmail);


// Route to add a user to a project
router.post('/send-project-invitation',authenticateUser, projectController.addMemberToTeam);

module.exports = router;
