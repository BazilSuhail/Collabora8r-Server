const Profile = require('../models/profile'); // Adjust the path as needed
const Project = require('../models/projects'); // Adjust the path as needed 
const JoinProject = require('../models/joinProjects');
const Notification = require('../models/notifications');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    // Fetch all users names from the database
    const users = await Profile.find().select('email avatar name');
    res.status(200).json(users);
  }
  catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
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

exports.getProjectWithUserDetails = async (req, res) => {
  const { projectId } = req.body;

  try {
    // Fetch the project by ID
    const project = await Project.findById(projectId).populate('tasks team.userId');
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Fetch the user who created the project
    const user = await Profile.findById(project.createdBy);
    if (!user) {
      return res.status(404).json({ error: 'User who created the project not found' });
    }

    // Return the project and user data
    res.status(200).json({
      project,
      createdBy: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.acceptProjectInvite = async (req, res) => {
  const userId = req.user.id; // User ID from middleware
  const { projectId } = req.body; // Project ID from request body

  try {
    // Find the project by ID
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    // Add the user to the project's team if not already present
    const isUserAlreadyInTeam = project.team.some((member) => member.userId === userId);
    if (!isUserAlreadyInTeam) {
      project.team.push(userId);
      await project.save();
    }

    // Find or create the JoinProject document for the user
    let joinProject = await JoinProject.findById(userId);
    if (!joinProject) {
      joinProject = new JoinProject({ userId, projects: [projectId] });
      await joinProject.save();
    } 
    else if (!joinProject.projects.includes(projectId)) {
      joinProject.projects.push(projectId);
      await joinProject.save();
    }

    res.status(200).json({ message: 'Project invitation accepted successfully.' });
  } 
  catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to accept project invitation.' });
  }
};


