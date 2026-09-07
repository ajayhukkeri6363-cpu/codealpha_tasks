const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const Comment = require('../models/Comment');
const Activity = require('../models/Activity');

dotenv.config();

const usersData = [
  {
    name: 'Elena Rostova',
    email: 'elena@flowboard.dev',
    password: 'password123',
    role: 'Product Manager',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    color: '#8b5cf6',
  },
  {
    name: 'Alex Rivera',
    email: 'alex@flowboard.dev',
    password: 'password123',
    role: 'Tech Lead',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    color: '#3b82f6',
  },
  {
    name: 'Sarah Chen',
    email: 'sarah@flowboard.dev',
    password: 'password123',
    role: 'Senior Full Stack',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    color: '#10b981',
  },
  {
    name: 'Marcus Vance',
    email: 'marcus@flowboard.dev',
    password: 'password123',
    role: 'UI/UX Designer',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=300&q=80',
    color: '#f59e0b',
  },
];

const seedData = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }

    console.log('[FlowBoard Seeder] Purging existing database collections...');
    await User.deleteMany();
    await Project.deleteMany();
    await Task.deleteMany();
    await Comment.deleteMany();
    await Activity.deleteMany();

    console.log('[FlowBoard Seeder] Creating users...');
    const createdUsers = [];
    for (const u of usersData) {
      const user = await User.create(u);
      createdUsers.push(user);
    }

    const [elena, alex, sarah, marcus] = createdUsers;

    console.log('[FlowBoard Seeder] Creating projects...');
    const project1 = await Project.create({
      name: 'Aether UI Design System & Component Library',
      key: 'AETH',
      description: 'Next-generation accessible enterprise React components, Tailwind tokens, and Figma synchronization pipeline.',
      category: 'Design System',
      status: 'Active',
      owner: elena._id,
      color: '#6366f1',
      icon: 'LayoutGrid',
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      members: [
        { user: elena._id, role: 'Owner' },
        { user: alex._id, role: 'Admin' },
        { user: sarah._id, role: 'Member' },
        { user: marcus._id, role: 'Member' },
      ],
    });

    const project2 = await Project.create({
      name: 'HyperScale AI Microservices Pipeline',
      key: 'HYPE',
      description: 'Distributed vector embeddings search cluster, streaming LLM inference proxy, and automated failover orchestration.',
      category: 'AI / ML',
      status: 'Active',
      owner: alex._id,
      color: '#ec4899',
      icon: 'Cpu',
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      members: [
        { user: alex._id, role: 'Owner' },
        { user: elena._id, role: 'Admin' },
        { user: sarah._id, role: 'Member' },
      ],
    });

    console.log('[FlowBoard Seeder] Creating tasks for Aether UI...');
    const p1TasksData = [
      {
        project: project1._id,
        taskKey: 'AETH-1',
        title: 'Design token architecture in JSON and Tailwind sync',
        description: 'Establish canonical color primitives, spacing scale, semantic elevation tokens, and auto-generate tailwind.config.',
        status: 'Done',
        priority: 'High',
        labels: ['Design System', 'Core'],
        assignees: [marcus._id, sarah._id],
        creator: elena._id,
        storyPoints: 5,
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        subtasks: [
          { title: 'Color ramp definitions (slate, indigo, emerald)', completed: true },
          { title: 'Typography modular scale', completed: true },
          { title: 'JSON token export parser script', completed: true },
        ],
        order: 0,
      },
      {
        project: project1._id,
        taskKey: 'AETH-2',
        title: 'Accessible Dialog & Modal Primitive (WAI-ARIA 1.2)',
        description: 'Focus trapping, keyboard escape handling, inert background, portal mounting, and screen reader announcements.',
        status: 'In Review',
        priority: 'Urgent',
        labels: ['Frontend', 'Accessibility'],
        assignees: [sarah._id],
        creator: alex._id,
        storyPoints: 8,
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        subtasks: [
          { title: 'Portal rendering in React 18', completed: true },
          { title: 'Focus trap with return focus on unmount', completed: true },
          { title: 'Automated Axe accessibility tests', completed: false },
        ],
        order: 1,
      },
      {
        project: project1._id,
        taskKey: 'AETH-3',
        title: 'Virtual Table component for 100k+ rows',
        description: 'High performance windowed data grid with sticky header, column resize, multi-sort, and CSV streaming exporter.',
        status: 'In Progress',
        priority: 'High',
        labels: ['Performance', 'Frontend'],
        assignees: [alex._id, sarah._id],
        creator: elena._id,
        storyPoints: 13,
        dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
        subtasks: [
          { title: 'Windowing calculation algorithm', completed: true },
          { title: 'Dynamic row height estimation', completed: false },
          { title: 'Multi-column sort predicate engine', completed: false },
        ],
        order: 2,
      },
      {
        project: project1._id,
        taskKey: 'AETH-4',
        title: 'Dark Mode contrast ratios auditing & fix',
        description: 'Ensure all secondary text styles pass WCAG AAA (7:1) contrast ratio against slate-900 background.',
        status: 'To Do',
        priority: 'Medium',
        labels: ['Design System', 'UI/UX'],
        assignees: [marcus._id],
        creator: elena._id,
        storyPoints: 3,
        dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
        subtasks: [
          { title: 'Audit button hover states', completed: false },
          { title: 'Adjust placeholder contrast in inputs', completed: false },
        ],
        order: 3,
      },
      {
        project: project1._id,
        taskKey: 'AETH-5',
        title: 'Interactive Component Playground with live JSX editor',
        description: 'Sandbox viewer supporting props tweaking, code copying, and visual regression snapshot generation.',
        status: 'Backlog',
        priority: 'Low',
        labels: ['Documentation', 'DevX'],
        assignees: [sarah._id],
        creator: alex._id,
        storyPoints: 5,
        dueDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
        subtasks: [
          { title: 'Monaco editor or Sandpack integration', completed: false },
          { title: 'Props controls inspector', completed: false },
        ],
        order: 4,
      },
      {
        project: project1._id,
        taskKey: 'AETH-6',
        title: 'Storybook 8 documentation site deployment',
        description: 'Setup automated GitHub Actions preview deployments for every pull request targeting main.',
        status: 'Done',
        priority: 'Medium',
        labels: ['DevOps', 'CI/CD'],
        assignees: [alex._id],
        creator: elena._id,
        storyPoints: 3,
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        subtasks: [
          { title: 'Storybook config migration', completed: true },
          { title: 'Chromatic / GH Pages deployment script', completed: true },
        ],
        order: 5,
      }
    ];

    for (const t of p1TasksData) {
      const task = await Task.create(t);

      // Add a sample comment
      const comment = await Comment.create({
        task: task._id,
        author: alex._id,
        text: `Status update: Initial implementation reviewed and looking solid. Target date verified for ${task.taskKey}.`,
      });

      await Activity.create({
        project: project1._id,
        task: task._id,
        user: elena._id,
        action: 'CREATED_TASK',
        details: `Created task ${task.taskKey}: "${task.title}"`,
      });
    }

    console.log('[FlowBoard Seeder] Database seeded successfully with 4 Users, 2 Projects, 6 Tasks, Comments & Activities!');
    return true;
  } catch (error) {
    console.error('[FlowBoard Seeder] Error seeding data:', error);
    throw error;
  }
};

if (require.main === module) {
  seedData()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = seedData;