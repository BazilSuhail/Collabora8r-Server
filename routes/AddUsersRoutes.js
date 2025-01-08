// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const addUsers = require('../controllers/AddUsersController');
const authMiddleware = require('../middleware/authMiddleware');

// Route to get all users
router.get('/getallUsers', addUsers.getAllUsers);

// Route to add a user to a project
router.post('/send-project-invitation',authMiddleware, addUsers.addUserToProjectInvitation);
// Get invitaion details and accept it 
router.post('/get-project-details', authMiddleware, addUsers.getProjectWithUserDetails);
router.post('/accept-invite', authMiddleware, addUsers.acceptProjectInvite);

//router.patch('/:projectId/addUser', addUsers.addUserToProject);
//router.patch('/:userId/joinProject', addUsers.addProjectToUser);

module.exports = router;
