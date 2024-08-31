const express = require('express');
const router = express.Router();
const projectController = require('../controllers/getJoinedProjectsController');

const authenticateUser = require('../middleware/authMiddleware');

// Route to get all projects the user has joined
router.get('/', authenticateUser, projectController.getJoinedProjects);

// Route to get details of a specific project
router.get('/:projectId', authenticateUser, projectController.getProjectDetails);


// Route to fetch team members for a project
router.get('/:projectId/team', projectController.getTeamMembers);

module.exports = router;
