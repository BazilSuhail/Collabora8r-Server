const Profile = require('../models/profile');
const Project = require('../models/projects');
const AdminProject = require('../models/adminProjects');
const JoinProject = require('../models/joinProjects');
const Notification = require('../models/notifications');
const { sendMessageToUser } = require('../socket');

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
      const managerId = projectManagerProfile._id;
      projectManager.status = 'Pending';

      const notificationDoc = await Notification.findById(projectManagerProfile._id);
      const managerMessage = {
        type: "projectManager",
        data: {
          description: `You have been assigned as a project manager from ${projectManagerProfile.name} for his Project ${name}`,
          from: createdBy,
          projectId: newProject._id,
          createdAt: Date.now(),
        },
      };

      // If notification document exists, add the notification
      if (notificationDoc) {
        notificationDoc.notifications.push(managerMessage);
        await notificationDoc.save();
        sendMessageToUser(projectManagerProfile._id.toString(), managerMessage);
      }
      else {
        const newNotification = new Notification(managerMessage);
        await newNotification.save();
        sendMessageToUser(projectManagerProfile._id.toString(), managerMessage);
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
    // Find the project by ID
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    // Check if the project manager email matches the existing manager's email
    if (project.projectManager.email !== projectManagerEmail) {
      const user = await Profile.findOne({ email: projectManagerEmail }).select('_id');
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      const notificationDoc = await Notification.findById(user._id);

      if (!notificationDoc) {
        return res.status(404).json({ error: 'Notification document not found.' });
      }

      // Add a new notification
      notificationDoc.notifications.push({
        type: "projectManager",
        data: {
          description: `You are invited as a Project Manager, as an alternative for Project ${name}`,
          from: req.user.id,
          projectId: project._id,
          createdAt: Date.now(),
        },
      });

      // Save the notification document
      await notificationDoc.save();

      // Exit the process after sending the notification
      return res.status(200).json({ message: 'Notification sent to the new project manager.' });
    }

    // Update the project if the manager email matches
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { name, description, projectManagerEmail, theme },
      { new: true }
    );

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};


exports.managerInvitation = async (req, res) => {
  const userId = req.user.id;
  const { projectId } = req.params;
  const { response } = req.body;
  console.log(response)
  try {
    // Construct the update based on the response
    const update = response === 'Accept'
      ? { 'projectManager.status': 'Approved' } // Set status 
      : { 'projectManager.email': '', 'projectManager.status': 'Declined' };

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

    //res.status(200).json({ message: 'Project invitation accepted successfully.' });

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};
