// routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const profileController = require('../controllers/authProfileController');
const authMiddleware = require('../middleware/authMiddleware');

// Sign Up a new user
router.post('/signup', profileController.signUp);

// Sign In an existing user
router.post('/signin', profileController.signIn);

// Get the current user's profile
router.get('/', authMiddleware, profileController.getProfile);

// Update the current user's profile
router.put('/', authMiddleware, profileController.updateProfile);

module.exports = router;
