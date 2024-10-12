// controllers/profileController.js
const Profile = require('../models/profile');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Sign Up a new user
exports.signUp = async (req, res) => {
  const { name, gender, phone, email, dob, password } = req.body;
  
  try {
    let profile = await Profile.findOne({ email });
    if (profile) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    profile = new Profile({
      name,
      gender,
      phone,
      email,
      dob,
      password: hashedPassword // Store the hashed password
    });

    await profile.save();

    const token = jwt.sign({ id: profile._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.status(201).json({ token });
  } catch (error) {
    console.error(error); // Log the error for debugging
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
      expiresIn: '1h'
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
// Get the current user's profile
exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findById(req.user.id);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, gender, phone, email, dob, avatar } = req.body; // Include avatar

    const updatedProfile = await Profile.findByIdAndUpdate(
      req.user.id,
      { name, gender, phone, email, dob, avatar }, // Update avatar
      { new: true, runValidators: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(updatedProfile);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
