// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/fetchUserController');

// Route to get all users
router.get('/', userController.getAllUsers);

module.exports = router;
