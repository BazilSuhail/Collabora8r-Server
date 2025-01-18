// routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const profileController = require('../controllers/AuthController');
const authMiddleware = require('../middleware/authMiddleware');

// Sign Up a new user
router.post('/signup', profileController.signUp);

router.post('/check-email', profileController.checkEmailExists);
router.post('/reset-password', profileController.resetPassword);
router.post('/forgot-password', profileController.forgotPassword);
// Sign In an existing user
router.post('/signin', profileController.signIn);

// Get the current user's profile

module.exports = router;
