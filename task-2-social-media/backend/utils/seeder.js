const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');
const SavedPost = require('../models/SavedPost');
const { connectDB } = require('../config/db');

dotenv.config();

const usersData = [
  {
    name: 'Elena Rostova',
    username: 'elena.designs',
    email: 'elena@pulse.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    bio: 'Senior UI/UX Architect & Visual Storyteller. Designing the future of spatial computing. 🎨✨',
    location: 'San Francisco, CA',
    website: 'https://elenarostova.design',
  },
  {
    name: 'Leo Vance',
    username: 'leovance_dev',
    email: 'leo@pulse.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    bio: 'Distributed systems engineer & open source enthusiast. TypeScript, Rust, & WebRTC builder. ⚡',
    location: 'Seattle, WA',
    website: 'https://github.com/leovance',
  },
  {
    name: 'Maya Patel',
    username: 'maya.explores',
    email: 'maya@pulse.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    bio: 'National Geographic contributor & Landscape Photographer. Chasing golden hour in the Alps. 🏔️📷',
    location: 'Zurich, Switzerland',
    website: 'https://mayaexplores.photo',
  },
  {
    name: 'Liam Chen',
    username: 'liamchen',
    email: 'liam@pulse.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    bio: 'AI Researcher & Founder @ Synapse. Exploring generative UI and human-machine pair programming.',
    location: 'Boston, MA',
    website: 'https://synapse.ai',
  },
  {
    name: 'Sofia Reyes',
    username: 'sofia_reyes',
    email: 'sofia@pulse.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    bio: 'Creative director & coffee connoisseur. Building aesthetic digital spaces. ☕🌿',
    location: 'Austin, TX',
    website: 'https://sofiareyes.studio',
  },
];

const samplePosts = [
  {
    userIndex: 0, // Elena
    content: 'Just deployed our new spatial design language system for web applications! Clean typography, high contrast tokens, and fluid physics animations make all the difference. #design #uiux #webdev #spatial',
    image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1000&q=80',
    tags: ['design', 'uiux', 'webdev', 'spatial'],
  },
  {
    userIndex: 1, // Leo
    content: 'Finished testing WebRTC peer connections with automated stun/turn fallback. Latency dropped under 28ms across transatlantic nodes! Full open source repo coming soon. #developer #webrtc #coding #opensource',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80',
    tags: ['developer', 'webrtc', 'coding', 'opensource'],
  },
  {
    userIndex: 2, // Maya
    content: 'Sunset over the Dolomites, Italy. 3-hour hike in sub-zero winds, but this light made every single step worthwhile. Nature never fails to amaze. #photography #wanderlust #nature #dolomites',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
    tags: ['photography', 'wanderlust', 'nature', 'dolomites'],
  },
  {
    userIndex: 3, // Liam
    content: 'The shift towards multimodal real-time agentic workflows will completely transform productivity in 2026. Less boilerplate, more creative architecture. #ai #tech #future #innovation',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
    tags: ['ai', 'tech', 'future', 'innovation'],
  },
  {
    userIndex: 4, // Sofia
    content: 'Morning studio setup with direct sunlight and freshly brewed pour-over Ethiopian roast. Ready to tackle our client brand identity project! #lifestyle #workspace #coffee #creative',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=80',
    tags: ['lifestyle', 'workspace', 'coffee', 'creative'],
  },
];

const seedPulseData = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }

    console.log('[Pulse Seeder] Cleaning collections...');
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    await Notification.deleteMany({});
    await SavedPost.deleteMany({});

    console.log('[Pulse Seeder] Creating users...');
    const createdUsers = [];
    for (const u of usersData) {
      const user = await User.create(u);
      createdUsers.push(user);
    }

    // Setup mutual following relationships
    createdUsers[0].following.push(createdUsers[1]._id, createdUsers[2]._id, createdUsers[3]._id);
    createdUsers[0].followers.push(createdUsers[1]._id, createdUsers[4]._id);
    await createdUsers[0].save();

    createdUsers[1].following.push(createdUsers[0]._id, createdUsers[3]._id);
    createdUsers[1].followers.push(createdUsers[0]._id, createdUsers[2]._id);
    await createdUsers[1].save();

    console.log('[Pulse Seeder] Creating posts & engagements...');
    const createdPosts = [];
    for (const p of samplePosts) {
      const author = createdUsers[p.userIndex];
      const post = await Post.create({
        user: author._id,
        content: p.content,
        image: p.image,
        tags: p.tags,
        likes: [createdUsers[0]._id, createdUsers[1]._id],
      });
      createdPosts.push(post);
    }

    // Add comments
    await Comment.create({
      post: createdPosts[0]._id,
      user: createdUsers[1]._id,
      text: 'This looks incredible Elena! The token design system is super clean.',
    });
    createdPosts[0].commentsCount = 1;
    await createdPosts[0].save();

    await Comment.create({
      post: createdPosts[2]._id,
      user: createdUsers[0]._id,
      text: 'Breathtaking capture Maya! What lens did you use for this?',
    });
    createdPosts[2].commentsCount = 1;
    await createdPosts[2].save();

    // Create notifications for Elena
    await Notification.create({
      recipient: createdUsers[0]._id,
      sender: createdUsers[1]._id,
      type: 'like',
      post: createdPosts[0]._id,
      text: 'Leo Vance liked your post.',
      isRead: false,
    });
    await Notification.create({
      recipient: createdUsers[0]._id,
      sender: createdUsers[4]._id,
      type: 'follow',
      text: 'Sofia Reyes started following you.',
      isRead: false,
    });

    // Save bookmarks
    await SavedPost.create({
      user: createdUsers[0]._id,
      post: createdPosts[2]._id,
    });

    console.log('[Pulse Seeder] Pulse database seeded successfully!');
    return true;
  } catch (err) {
    console.error(`[Pulse Seeder Error]: ${err.message}`);
    throw err;
  }
};

if (require.main === module) {
  seedPulseData()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = seedPulseData;
