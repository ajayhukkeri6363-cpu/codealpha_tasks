const SavedPost = require('../models/SavedPost');
const Post = require('../models/Post');

// @desc Get current user's saved posts
const getSavedPosts = async (req, res, next) => {
  try {
    const saved = await SavedPost.find({ user: req.user._id })
      .populate({
        path: 'post',
        populate: { path: 'user', select: 'name username avatar' },
      })
      .sort({ createdAt: -1 });

    const validPosts = saved.filter((s) => s.post != null).map((s) => ({
      ...s.post.toObject(),
      isSaved: true,
    }));

    res.json({ success: true, data: validPosts });
  } catch (error) {
    next(error);
  }
};

// @desc Save / bookmark or unsave a post
const toggleSavePost = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const existing = await SavedPost.findOne({
      user: req.user._id,
      post: postId,
    });

    if (existing) {
      await SavedPost.findByIdAndDelete(existing._id);
      return res.json({ success: true, isSaved: false, message: 'Post removed from saved collection' });
    } else {
      await SavedPost.create({
        user: req.user._id,
        post: postId,
      });
      return res.json({ success: true, isSaved: true, message: 'Post bookmarked to saved collection' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getSavedPosts, toggleSavePost };
