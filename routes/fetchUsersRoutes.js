// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/FetchUserController'); // Adjust the path as needed

// Route to get all users
router.get('/getallUsers', userController.getAllUsers);

// Route to add a user to a project

router.patch('/:projectId/addUser', userController.addUserToProject);

router.patch('/:userId/joinProject', userController.addProjectToUser);

module.exports = router;
