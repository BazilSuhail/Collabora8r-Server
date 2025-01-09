// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const addUsers = require('../controllers/AddUsersController');
const authMiddleware = require('../middleware/authMiddleware');

// Route to get all users
router.get('/:projectId/get-all-users', authMiddleware, addUsers.getAllUsersFromProject);

// Get invitaion details and accept it 
router.post('/get-project-details', authMiddleware, addUsers.getProjectWithUserDetails);
router.post('/accept-invite', authMiddleware, addUsers.acceptProjectInvite);

//router.patch('/:projectId/addUser', addUsers.addUserToProject);
//router.patch('/:userId/joinProject', addUsers.addProjectToUser);

module.exports = router;
