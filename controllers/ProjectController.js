const Profile = require('../models/profile');
const Project = require('../models/projects');
const AdminProject = require('../models/adminProjects');
const JoinProject = require('../models/joinProjects');
const Notification = require('../models/notifications');

// Create a new project
exports.createProject = async (req, res) => {
  const { name, description, projectManagerEmail, theme } = req.body;
  const createdBy = req.user.id;

  try {
    let projectManager = {
      email: projectManagerEmail,
      status: 'Pending',
    };

    // Create a new Project document
    const newProject = new Project({
      name,
      theme,
      description,
      createdBy,
      projectManager,
    });

    await newProject.save();

    let adminProject = await AdminProject.findById(createdBy);

    if (!adminProject) {
      adminProject = new AdminProject({ userId: createdBy, projects: [] });
    }

    adminProject.projects.push(newProject._id);
    await adminProject.save();

    const projectManagerProfile = await Profile.findOne({ email: projectManagerEmail });
    if (projectManagerProfile) {
      projectManager.status = 'Pending';

      const notificationDoc = await Notification.findById(projectManagerProfile._id);

      // If notification document exists, add the notification
      if (notificationDoc) {
        notificationDoc.notifications.push({
          type: "projectManager",
          data: {
            description: `You have been assigned as a project manager from ${projectManagerProfile.name} for his Project ${name}`,
            from: createdBy,
            projectId: newProject._id,
            createdAt: Date.now(),
          },
        });
        await notificationDoc.save();
      }
      else {
        const newNotification = new Notification({
          _id: projectManagerProfile._id,
          notifications: [
            {
              type: "projectManager",
              data: {
                description: `You have been invited for a Project Manager role for ${name}`,
                from: createdBy,
                projectId: newProject._id,
                createdAt: Date.now(),
              },
            }
          ],
        });

        await newNotification.save();
      }
      projectManager.id = projectManagerProfile._id;
    }
    else {
      projectManager.email = '';
    }

    await newProject.save();

    res.status(201).json({
      message: 'Project created successfully!',
      project: newProject,
    });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateProject = async (req, res) => {
  const { projectId } = req.params;
  const { name, description, projectManagerEmail, theme } = req.body;

  try {
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { name, description, projectManagerEmail, theme },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    res.status(200).json(updatedProject);
  }
  catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

exports.managerInvitation = async (req, res) => {
  const userId = req.user.id;
  const { projectId } = req.params;
  const { response } = req.body;

  try {
    // Construct the update based on the response
    const update = response === 'accept'
      ? { 'projectManager.status': 'approved' } // Set status 
      : { 'projectManager.email': '', 'projectManager.status': 'declined' }; 

    // Update the project document
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { $set: update },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    let joinProject = await JoinProject.findById(userId);
    if (!joinProject) {
      joinProject = new JoinProject({ userId, asManager: [projectId] });
      await joinProject.save();
    }
    else if (!joinProject.projects.includes(projectId)) {
      joinProject.asManager.push(projectId);
      await joinProject.save();
    }

    res.status(200).json({ message: 'Project invitation accepted successfully.' });

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};
