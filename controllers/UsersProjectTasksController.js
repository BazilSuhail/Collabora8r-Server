const Task = require('../models/tasks');
const AssignedTask = require('../models/assignTasks');
const Profile = require('../models/profile');
const Project = require('../models/projects');

exports.getProjectTasks = async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.user.id;

        // Fetch project document to get the list of task IDs
        const project = await Project.findById(projectId);

        if (!project) {
            console.log("Project not found");
            return res.status(404).json({ message: 'Project not found.' });
        }

        // Fetch all tasks related to the project using the task IDs from the project's tasks array
        const projectTasks = await Task.find({
            _id: { $in: project.tasks }
        });

        // Fetch the user's profile to get the assigned tasks document ID
        const profile = await Profile.findById(userId);

        if (!profile || !profile.assignedTasks) {
            console.log("No tasks found for the user in this project.");
            return res.status(404).json({ message: 'No tasks found for the user in this project.' });
        }

        // Fetch the user's assigned tasks document
        const assignedTaskDoc = await AssignedTask.findById(profile.assignedTasks);

        if (!assignedTaskDoc) {
            console.log("Assigned task document not found");
            return res.status(404).json({ message: 'Assigned task document not found.' });
        }

        // Filter the user's tasks that belong to the current project
        const userTaskDetails = await Task.find({
            _id: { $in: assignedTaskDoc.assignTasks },
            projectId: projectId,
        });

        // Return the project tasks and the user's specific tasks for the project
        res.status(200).json({ projectTasks, userTaskDetails });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch project tasks.' });
    }
};

exports.updateTaskStatus = async (req, res) => {
    const { updates } = req.body; // Expecting an array of updates { id, status }

    try {
        const updatePromises = updates.map(({ id, status }) =>
            Task.findByIdAndUpdate(id, { status }, { new: true }) // Update and return the new task
        );

        const updatedTasks = await Promise.all(updatePromises);
        res.status(200).json({ success: true, updatedTasks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error updating tasks' });
    }
};

exports.updateTaskStatusAndProgress = async (req, res) => {
    const taskId = req.params.taskId;
    const { progress, status } = req.body; 

    try {
        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { progress, status },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        res.status(200).json({ success: true, message: 'Task updated successfully', updatedTask });
    } 
    catch (error) {
        console.error(error); 
        res.status(500).json({ success: false, message: 'Error updating task' });
    }
};
