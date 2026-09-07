const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const registerUser = async (req, res, next) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const cleanUsername = username.toLowerCase().trim();
    const existing = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: cleanUsername }],
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'User with this email or username already exists' });
    }

    const user = await User.create({
      name,
      username: cleanUsername,
      email: email.toLowerCase(),
      password,
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        coverImage: user.coverImage,
        bio: user.bio,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { login, password } = req.body; // Can be email or username

    if (!login || !password) {
      return res.status(400).json({ success: false, message: 'Please enter your username/email and password' });
    }

    const user = await User.findOne({
      $or: [{ email: login.toLowerCase() }, { username: login.toLowerCase() }],
    }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        coverImage: user.coverImage,
        bio: user.bio,
        location: user.location,
        website: user.website,
        followersCount: user.followers.length,
        followingCount: user.following.length,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.name = req.body.name || user.name;
    user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
    user.avatar = req.body.avatar || user.avatar;
    user.coverImage = req.body.coverImage || user.coverImage;
    user.location = req.body.location !== undefined ? req.body.location : user.location;
    user.website = req.body.website !== undefined ? req.body.website : user.website;

    const updated = await user.save();
    res.json({
      success: true,
      message: 'Profile updated',
      data: {
        _id: updated._id,
        name: updated.name,
        username: updated.username,
        email: updated.email,
        avatar: updated.avatar,
        coverImage: updated.coverImage,
        bio: updated.bio,
        location: updated.location,
        website: updated.website,
        token: generateToken(updated._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

const searchUsers = async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query) return res.json({ success: true, data: [] });

    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { username: { $regex: query, $options: 'i' } },
      ],
    })
      .select('name username avatar bio followers')
      .limit(10);

    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser, getMe, updateProfile, searchUsers };
