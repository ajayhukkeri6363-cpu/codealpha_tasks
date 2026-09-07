const User = require('../models/User');
const Post = require('../models/Post');
const Notification = require('../models/Notification');
const SavedPost = require('../models/SavedPost');

// @desc Get public user profile with posts
const getUserProfile = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username: username.toLowerCase() });

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const posts = await Post.find({ user: user._id })
      .populate('user', 'name username avatar')
      .sort({ createdAt: -1 });

    const isFollowing = req.user ? user.followers.some((id) => id.toString() === req.user._id.toString()) : false;

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        coverImage: user.coverImage,
        bio: user.bio,
        location: user.location,
        website: user.website,
        followersCount: user.followers.length,
        followingCount: user.following.length,
        postsCount: posts.length,
        isFollowing,
        posts,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Follow a user
const followUser = async (req, res, next) => {
  try {
    const targetUserId = req.params.id;

    if (targetUserId.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot follow yourself' });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(req.user._id);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!targetUser.followers.includes(req.user._id)) {
      targetUser.followers.push(req.user._id);
      currentUser.following.push(targetUserId);

      await targetUser.save();
      await currentUser.save();

      // Create notification
      const notif = await Notification.create({
        recipient: targetUserId,
        sender: req.user._id,
        type: 'follow',
        text: `${req.user.name} started following you.`,
      });

      const io = req.app.get('io');
      if (io) {
        io.to(`user_${targetUserId}`).emit('notification', {
          ...notif.toObject(),
          sender: {
            _id: req.user._id,
            name: req.user.name,
            avatar: req.user.avatar,
          },
        });
      }
    }

    res.json({
      success: true,
      message: `Now following ${targetUser.name}`,
      followersCount: targetUser.followers.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Unfollow a user
const unfollowUser = async (req, res, next) => {
  try {
    const targetUserId = req.params.id;

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(req.user._id);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    targetUser.followers = targetUser.followers.filter((id) => id.toString() !== req.user._id.toString());
    currentUser.following = currentUser.following.filter((id) => id.toString() !== targetUserId.toString());

    await targetUser.save();
    await currentUser.save();

    res.json({
      success: true,
      message: `Unfollowed ${targetUser.name}`,
      followersCount: targetUser.followers.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get suggested users to follow
const getSuggestedUsers = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const excludedIds = [req.user._id, ...(currentUser ? currentUser.following : [])];

    const suggested = await User.find({ _id: { $nin: excludedIds } })
      .select('name username avatar bio followers')
      .limit(6);

    res.json({ success: true, data: suggested });
  } catch (error) {
    next(error);
  }
};

// @desc Get user followers list
const getFollowers = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate('followers', 'name username avatar bio');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, data: user.followers });
  } catch (error) {
    next(error);
  }
};

// @desc Get user following list
const getFollowing = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate('following', 'name username avatar bio');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, data: user.following });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  followUser,
  unfollowUser,
  getSuggestedUsers,
  getFollowers,
  getFollowing,
};
