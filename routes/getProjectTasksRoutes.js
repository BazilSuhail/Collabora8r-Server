const express = require('express');
const router = express.Router();
const { getProjectTasks } = require('../controllers/getProjectTasksController');

// GET /projects/:projectId/tasks
router.get('/:projectId/tasks', getProjectTasks);

module.exports = router;
