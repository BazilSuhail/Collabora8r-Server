const mongoose = require('mongoose');
const Profile = require('../models/profile'); // Adjust the path as needed
const Project = require('../models/projects'); // Adjust the path as needed 
const JoinProject = require('../models/joinProjects');

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await Profile.find(); // Fetch all users from the database
        res.status(200).json(users); // Send the users as a JSON response
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
}; 

exports.addUserToProject = async (req, res) => {
  const { projectId } = req.params;
  const { userId } = req.body;

  try {
    // Add user to the project team
    await Project.updateOne(
      { _id: projectId },
      { $push: { team: { userId } } }
    );

    res.status(200).json({ message: 'User added to project team.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add user to project team.' });
  }
};

// Add project ID to user's JoinProject document and update Profile
exports.addProjectToUser = async (req, res) => {
  const { userId } = req.params;
  const { projectId } = req.body;

  try {
    // Check if user already has a JoinProject document
    let joinProject = await JoinProject.findOne({ userId });
    if (!joinProject) {
      // Create a new JoinProject document if none exists
      joinProject = new JoinProject({ userId, projects: [projectId] });
      await joinProject.save();
    } else {
      // Add the project ID to the existing JoinProject document
      await JoinProject.updateOne(
        { userId },
        { $addToSet: { projects: projectId } }
      );
    }

    // Find the Profile and update its joinedProjects reference
    await Profile.findOneAndUpdate(
      { _id: userId },
      { joinedProjects: joinProject._id },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: 'Project added to user\'s joined projects.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user\'s joined projects.' });
  }
};

