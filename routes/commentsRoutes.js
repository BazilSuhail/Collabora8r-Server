const express = require('express');
const { addCommentToTask, getCommentsForTask } = require('../controllers/commentsController');
const router = express.Router();
const authenticateUser = require('../middleware/authMiddleware'); // Middleware to authenticate user

// Route to add a comment to a task
router.post('/tasks/:taskId/comments', authenticateUser, addCommentToTask);

// Route to get comments for a specific task
router.get('/tasks/:taskId/comments', authenticateUser, getCommentsForTask);

module.exports = router;
