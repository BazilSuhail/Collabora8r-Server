const express = require('express');
const router = express.Router();
const taskController = require('../controllers/TasksController');

// Route to create a new task
router.post('/', taskController.createTask);

// Route to fetch tasks for a specific project
router.get('/project/:projectId', taskController.getTasksByProject);

// Route to fetch tasks assigned to a specific user
router.get('/user/:userId', taskController.getTasksByUser);

// Route to edit a task
router.patch('/:taskId', taskController.editTask);

// Route to delete a task
router.delete('/:taskId', taskController.deleteTask);

module.exports = router;
