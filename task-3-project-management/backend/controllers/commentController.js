const Comment = require('../models/Comment');
const Task = require('../models/Task');
const Activity = require('../models/Activity');

// @desc    Get comments for task
// @route   GET /api/tasks/:taskId/comments
// @access  Private
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ task: req.params.taskId })
      .populate('author', 'name email avatar initials role')
      .sort({ createdAt: 1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add comment to task
// @route   POST /api/tasks/:taskId/comments
// @access  Private
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const comment = await Comment.create({
      task: task._id,
      author: req.user._id,
      text,
    });

    const populated = await Comment.findById(comment._id).populate('author', 'name email avatar initials role');

    await Activity.create({
      project: task.project,
      task: task._id,
      user: req.user._id,
      action: 'ADDED_COMMENT',
      details: `Commented on ${task.taskKey}: "${text.slice(0, 40)}..."`,
    });

    const io = req.app.get('io');
    if (io) {
      io.to(`project_${task.project}`).emit('comment_added', {
        taskId: task._id,
        comment: populated,
      });
    }

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getComments, addComment };