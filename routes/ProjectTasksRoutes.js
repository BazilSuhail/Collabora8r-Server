const express = require('express');
const router = express.Router();
const { getProjectTasks,getTaskDetails } = require('../controllers/ProjectTasksController');

// GET /projects/:projectId/tasks
router.get('/:projectId/tasks', getProjectTasks);
router.get('/:id', getTaskDetails);

module.exports = router;
