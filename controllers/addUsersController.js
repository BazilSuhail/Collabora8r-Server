const Profile = require('../models/profile')
const Project = require('../models/projects') 
const JoinProject = require('../models/joinProjects')
const Notification = require('../models/notifications')

// Get all users from a project's team
exports.getAllUsersFromProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!projectId) {
      return res.status(400).json({ message: 'Project ID is required' });
    }

    const project = await Project.findById(projectId).select('team');
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    const teamIds = project.team;
    const users = await Promise.all(
      teamIds.map(async (profileId) => {
        const user = await Profile.findById(profileId).select('email avatar name');
        return user || null;
      })
    );
    const filteredUsers = users.filter((user) => user !== null);

    res.status(200).json(filteredUsers);
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
  //console.log(projectId)

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
  const userId = req.user.id;
  const { projectId } = req.body;

  try {
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


