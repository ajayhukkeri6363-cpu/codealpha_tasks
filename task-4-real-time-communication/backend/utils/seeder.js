const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');
const Meeting = require('../models/Meeting');
const ChatMessage = require('../models/ChatMessage');

dotenv.config();

const usersData = [
  {
    name: 'Marcus Vance',
    email: 'marcus@nexus.dev',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=300&q=80',
    status: 'Available',
  },
  {
    name: 'Alex Rivera',
    email: 'alex@nexus.dev',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    status: 'In Meeting',
  },
  {
    name: 'Elena Rostova',
    email: 'elena@nexus.dev',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    status: 'Available',
  },
  {
    name: 'Sarah Chen',
    email: 'sarah@nexus.dev',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    status: 'Available',
  },
];

const seedData = async () => {
  try {
    await connectDB();

    console.log('[Nexus Seeder] Purging existing database collections...');
    await User.deleteMany();
    await Meeting.deleteMany();
    await ChatMessage.deleteMany();

    console.log('[Nexus Seeder] Creating users...');
    const createdUsers = [];
    for (const u of usersData) {
      const user = await User.create(u);
      createdUsers.push(user);
    }

    const [marcus, alex, elena, sarah] = createdUsers;

    console.log('[Nexus Seeder] Creating pre-configured meeting rooms...');
    const meeting1 = await Meeting.create({
      title: 'Design Sprint & Whiteboard Review',
      roomId: 'design-sprint',
      host: marcus._id,
      participants: [{ user: marcus._id }, { user: sarah._id }, { user: elena._id }],
      isActive: true,
    });

    const meeting2 = await Meeting.create({
      title: 'Weekly Engineering Architecture Standup',
      roomId: 'eng-sync',
      host: alex._id,
      participants: [{ user: alex._id }, { user: elena._id }],
      isActive: true,
    });

    console.log('[Nexus Seeder] Adding sample meeting messages...');
    await ChatMessage.create({
      roomId: 'design-sprint',
      sender: marcus._id,
      senderName: 'Marcus Vance',
      senderAvatar: marcus.avatar,
      text: 'Welcome team! Feel free to grab a marker on the whiteboard tab to sketch component layout ideas.',
    });

    await ChatMessage.create({
      roomId: 'design-sprint',
      sender: sarah._id,
      senderName: 'Sarah Chen',
      senderAvatar: sarah.avatar,
      text: 'Awesome, audio and screen share are streaming with zero latency.',
    });

    console.log('[Nexus Seeder] Nexus database seeded successfully with 4 Users, 2 Rooms, and Messages!');
    return true;
  } catch (error) {
    console.error('[Nexus Seeder] Error seeding data:', error);
    throw error;
  }
};

if (require.main === module) {
  seedData()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = seedData;