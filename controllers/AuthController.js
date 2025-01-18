// controllers/profileController.js
const Profile = require('../models/profile');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const AssignedTask = require('../models/assignTasks');
const AdminProject = require('../models/adminProjects');
const JoinProject = require('../models/joinProjects');
const Notification = require('../models/notifications');
 
// Sign Up a new user
exports.signUp = async (req, res) => {
  const { name, gender, phone, email, dob, password } = req.body;

  try { 
    let profile = await Profile.findOne({ email });
    if (profile) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user's Profile document
    profile = new Profile({
      name,
      gender,
      phone,
      email,
      dob,
      password: hashedPassword, 
    });

    await profile.save();
 
    const userId = profile._id;

    // Create AssignedTask document
    const assignedTask = new AssignedTask({
      _id: userId,
      assignTasks: [], // Initialize with an empty task array
    });
    await assignedTask.save();

    // Create AdminProject document
    const adminProject = new AdminProject({
      _id: userId,
      projects: [],  
    });
    await adminProject.save();

    // Create JoinProject document
    const joinProject = new JoinProject({
      _id: userId,
      projects: [],  
      asManager: [],  
    });
    await joinProject.save();

    // Create Notification document
    const notification = new Notification({
      _id: userId,
      notifications: [],  
    });
    await notification.save();

    // Generate a JWT token
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: '8h',
    });

    // Respond with the token
    res.status(201).json({ token });
  } catch (error) {
    console.error(error);  
    res.status(500).json({ error: 'Server error' });
  }
};



// Sign In an existing user
exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const profile = await Profile.findOne({ email });

    if (!profile) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, profile.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: profile._id }, process.env.JWT_SECRET, {
      expiresIn: '22h'
    });
 
    res.json({ token });
  } catch (error) {
    console.error('Sign-in error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Check if email exists
exports.checkEmailExists = async (req, res) => {
  const { email } = req.body; // Get email from the request body

  try {
    const profile = await Profile.findOne({ email });

    if (profile) {
      return res.status(400).json({ exists: true, message: 'Email already registered' });
    } else {
      return res.status(200).json({ exists: false, message: 'Email is available' });
    }
  } catch (error) {
    console.error('Error checking email:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const profile = await Profile.findOne({ email });

    if (profile) {
      return res.status(200).json({
        success: true,
        message: 'Password reset instructions have been sent to your email.'
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'No account found with that email address.'
      });
    }
  } catch (error) {
    console.error('Error during forgot password process:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update User Password
exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    // Find the user by email
    const profile = await Profile.findOne({ email });
    if (!profile) {
      return res.status(400).json({ error: 'User does not exist' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password
    profile.password = hashedPassword;
    await profile.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};