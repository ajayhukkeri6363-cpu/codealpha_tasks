const Project = require('../models/Project');
const Task = require('../models/Task');
const Activity = require('../models/Activity');

// @desc    Get all projects for current user
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user._id }, { 'members.user': req.user._id }],
    })
      .populate('owner', 'name email avatar initials')
      .populate('members.user', 'name email avatar initials role')
      .sort({ updatedAt: -1 });

    // Attach task count metadata
    const projectsWithCounts = await Promise.all(
      projects.map(async (project) => {
        const totalTasks = await Task.countDocuments({ project: project._id });
        const completedTasks = await Task.countDocuments({ project: project._id, status: 'Done' });
        const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        return {
          ...project.toObject(),
          totalTasks,
          completedTasks,
          progress,
        };
      })
    );

    res.json(projectsWithCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single project by ID or Key
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email avatar initials')
      .populate('members.user', 'name email avatar initials role');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const tasks = await Task.find({ project: project._id })
      .populate('assignees', 'name email avatar initials role')
      .populate('creator', 'name email avatar initials')
      .sort({ order: 1, createdAt: 1 });

    const activities = await Activity.find({ project: project._id })
      .populate('user', 'name email avatar initials')
      .populate('task', 'title taskKey')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      project,
      tasks,
      activities,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
  try {
    const { name, key, description, category, color, icon, deadline, members } = req.body;

    const existingKey = await Project.findOne({ key: key.toUpperCase() });
    if (existingKey) {
      return res.status(400).json({ message: 'Project key is already in use. Choose another.' });
    }

    const project = await Project.create({
      name,
      key: key.toUpperCase(),
      description,
      category: category || 'Web Development',
      owner: req.user._id,
      color: color || '#6366f1',
      icon: icon || 'LayoutGrid',
      deadline: deadline || null,
      members: [
        { user: req.user._id, role: 'Owner' },
        ...(members || []).map((m) => ({ user: m, role: 'Member' })),
      ],
    });

    await Activity.create({
      project: project._id,
      user: req.user._id,
      action: 'CREATED_PROJECT',
      details: `Created project "${project.name}" [${project.key}]`,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.name = req.body.name || project.name;
    project.description = req.body.description !== undefined ? req.body.description : project.description;
    project.category = req.body.category || project.category;
    project.status = req.body.status || project.status;
    project.color = req.body.color || project.color;
    project.columns = req.body.columns || project.columns;

    const updated = await project.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await Task.deleteMany({ project: project._id });
    await Activity.deleteMany({ project: project._id });
    await project.deleteOne();

    res.json({ message: 'Project and all associated tasks removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProjects, getProjectById, createProject, updateProject, deleteProject };