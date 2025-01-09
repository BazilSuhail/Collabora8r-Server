const Profile = require('../models/profile');
const Project = require('../models/projects');
const JoinProject = require('../models/joinProjects');
const AdminProject = require('../models/adminProjects');  

// List all projects created by the logged-in admin
exports.getCreatedProjects = async (req, res) => {
  const userId = req.user.id; // Logged-in admin's user ID

  try {
    // Find the AdminProject document using findById with the userId
    const adminProjects = await AdminProject.findById(userId);

    if (!adminProjects) {
      return res.status(404).json({ error: 'Admin projects not found.' });
    }

    // Retrieve all projects from the Project collection using the project IDs
    const projects = await Promise.all(
      adminProjects.projects.map(async (projectId) => {
        const project = await Project.findById(projectId);
        return project;
      })
    );

    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


// Get details of a specific project
exports.getProjectDetails = async (req, res) => {
  const { projectId } = req.params; 

  try {
    const project = await Project.findById(projectId).populate('team.userId', 'email');
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.searchUserByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email)

    // Validate email input
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    // Find user in the database
    const user = await Profile.findOne({ email }).select('name email avatar');

    // If user not found
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Send user details as response
    res.status(200).json({
      name: user.name,
      email: user.email,
      avatar: user.avatar, // Assuming avatar is stored in the user profile
    });
  } catch (error) {
    console.error('Error searching user by email:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

exports.addUserToProjectInvitation = async (req, res) => {
  //const { projectId } = req.params;
  const senderUserId = req.user.id; // Extract user ID from the middleware
  const { userId, projectId } = req.body;
  //console.log(userId)
  try {
    const notificationDoc = await Notification.findById(userId);
    console.log(notificationDoc)
    notificationDoc.notifications.push({
      type: "teamMember",
      data: {
        projectId: projectId,
        from: senderUserId,
        description: "New project invitation",

        createdAt: Date.now(),
      },
    });
    await notificationDoc.save();

    res.status(200).json({ message: 'Invitation sent' });
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add user to project team.' });
  }
};