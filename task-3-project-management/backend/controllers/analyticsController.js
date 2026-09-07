const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get productivity & board analytics
// @route   GET /api/analytics
// @access  Private
const getAnalytics = async (req, res) => {
  try {
    const userProjects = await Project.find({
      $or: [{ owner: req.user._id }, { 'members.user': req.user._id }],
    });
    const projectIds = userProjects.map((p) => p._id);

    const totalTasks = await Task.countDocuments({ project: { $in: projectIds } });
    const doneTasks = await Task.countDocuments({ project: { $in: projectIds }, status: 'Done' });
    const inProgressTasks = await Task.countDocuments({ project: { $in: projectIds }, status: 'In Progress' });
    const todoTasks = await Task.countDocuments({ project: { $in: projectIds }, status: { $in: ['To Do', 'Backlog'] } });
    const reviewTasks = await Task.countDocuments({ project: { $in: projectIds }, status: 'In Review' });

    const now = new Date();
    const overdueTasks = await Task.countDocuments({
      project: { $in: projectIds },
      status: { $ne: 'Done' },
      dueDate: { $lt: now },
    });

    // Priority breakdown
    const urgentCount = await Task.countDocuments({ project: { $in: projectIds }, priority: 'Urgent' });
    const highCount = await Task.countDocuments({ project: { $in: projectIds }, priority: 'High' });
    const mediumCount = await Task.countDocuments({ project: { $in: projectIds }, priority: 'Medium' });
    const lowCount = await Task.countDocuments({ project: { $in: projectIds }, priority: 'Low' });

    const completionRate = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

    res.json({
      summary: {
        totalProjects: userProjects.length,
        totalTasks,
        doneTasks,
        inProgressTasks,
        todoTasks,
        reviewTasks,
        overdueTasks,
        completionRate,
      },
      priorityBreakdown: {
        Urgent: urgentCount,
        High: highCount,
        Medium: mediumCount,
        Low: lowCount,
      },
      statusBreakdown: {
        'Backlog & To Do': todoTasks,
        'In Progress': inProgressTasks,
        'In Review': reviewTasks,
        'Done': doneTasks,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAnalytics };