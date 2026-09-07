const Task = require('../models/Task');
const Project = require('../models/Project');
const Activity = require('../models/Activity');

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { project: projectId, title, description, status, priority, labels, assignees, dueDate, storyPoints } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const taskCount = await Task.countDocuments({ project: projectId });
    const taskKey = `${project.key}-${taskCount + 1}`;

    const task = await Task.create({
      project: projectId,
      taskKey,
      title,
      description: description || '',
      status: status || 'To Do',
      priority: priority || 'Medium',
      labels: labels || [],
      assignees: assignees || [],
      creator: req.user._id,
      dueDate: dueDate || null,
      storyPoints: storyPoints || 3,
      order: taskCount,
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignees', 'name email avatar initials role')
      .populate('creator', 'name email avatar initials');

    await Activity.create({
      project: projectId,
      task: task._id,
      user: req.user._id,
      action: 'CREATED_TASK',
      details: `Created task ${taskKey}: "${title}"`,
    });

    // Real-time socket broadcast
    const io = req.app.get('io');
    if (io) {
      io.to(`project_${projectId}`).emit('task_created', populatedTask);
    }

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task (status, assignees, subtasks, priority, etc.)
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const previousStatus = task.status;

    task.title = req.body.title || task.title;
    task.description = req.body.description !== undefined ? req.body.description : task.description;
    task.status = req.body.status || task.status;
    task.priority = req.body.priority || task.priority;
    task.labels = req.body.labels || task.labels;
    task.assignees = req.body.assignees || task.assignees;
    task.subtasks = req.body.subtasks || task.subtasks;
    task.dueDate = req.body.dueDate !== undefined ? req.body.dueDate : task.dueDate;
    task.storyPoints = req.body.storyPoints !== undefined ? req.body.storyPoints : task.storyPoints;
    task.order = req.body.order !== undefined ? req.body.order : task.order;

    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate('assignees', 'name email avatar initials role')
      .populate('creator', 'name email avatar initials');

    // If status changed, log activity
    if (req.body.status && req.body.status !== previousStatus) {
      await Activity.create({
        project: task.project,
        task: task._id,
        user: req.user._id,
        action: 'UPDATED_STATUS',
        details: `Moved ${task.taskKey} from "${previousStatus}" to "${task.status}"`,
      });
    }

    // Real-time broadcast
    const io = req.app.get('io');
    if (io) {
      io.to(`project_${task.project}`).emit('task_updated', populatedTask);
    }

    res.json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Bulk reorder tasks in column or drag-drop
// @route   POST /api/tasks/reorder
// @access  Private
const reorderTasks = async (req, res) => {
  try {
    const { taskId, destinationStatus, sourceStatus, destinationIndex, projectId } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const prevStatus = task.status;
    task.status = destinationStatus;
    task.order = destinationIndex;
    await task.save();

    if (prevStatus !== destinationStatus) {
      await Activity.create({
        project: projectId,
        task: task._id,
        user: req.user._id,
        action: 'UPDATED_STATUS',
        details: `Moved ${task.taskKey} from ${prevStatus} to ${destinationStatus}`,
      });
    }

    const io = req.app.get('io');
    if (io) {
      io.to(`project_${projectId}`).emit('task_moved', {
        taskId,
        destinationStatus,
        sourceStatus,
        destinationIndex,
        userId: req.user._id,
      });
    }

    res.json({ message: 'Task reordered successfully', task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const projectId = task.project;
    const taskKey = task.taskKey;

    await task.deleteOne();

    const io = req.app.get('io');
    if (io) {
      io.to(`project_${projectId}`).emit('task_deleted', { taskId: req.params.id });
    }

    res.json({ message: `Task ${taskKey} removed successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createTask, updateTask, reorderTasks, deleteTask };