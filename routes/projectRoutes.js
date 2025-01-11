// routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const projectController = require('../controllers/ProjectController');
const authenticateUser  = require('../middleware/authMiddleware');

// Route to create a new project (only accessible to authenticated users)
router.post('/create', authenticateUser, projectController.createProject);
router.put('/:projectId/update', authenticateUser, projectController.updateProject);    
router.put('/manager-response/:projectId', authenticateUser, projectController.managerInvitation);    

module.exports = router;
