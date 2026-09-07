const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');
const SavedPost = require('../models/SavedPost');

// @desc Create a new post
const createPost = async (req, res, next) => {
  try {
    const { content, image, tags = [] } = req.body;

    if (!content && !image) {
      return res.status(400).json({ success: false, message: 'Post must contain text or an image' });
    }

    // Auto extract hashtags from content if not explicitly supplied
    let parsedTags = Array.isArray(tags) ? tags : [];
    if (content) {
      const extracted = content.match(/#[a-zA-Z0-9_]+/g);
      if (extracted) {
        const cleaned = extracted.map((t) => t.replace('#', '').toLowerCase());
        parsedTags = Array.from(new Set([...parsedTags, ...cleaned]));
      }
    }

    const post = await Post.create({
      user: req.user._id,
      content: content || '',
      image: image || '',
      tags: parsedTags,
    });

    const populated = await Post.findById(post._id).populate('user', 'name username avatar');

    // Broadcast new post event via Socket.io if available
    const io = req.app.get('io');
    if (io) {
      io.emit('new_post', populated);
    }

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

// @desc Get personalized feed posts
const getFeedPosts = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 15;

    const user = await User.findById(req.user._id);
    const followingIds = user ? user.following : [];
    const feedUserIds = [req.user._id, ...followingIds];

    // Query posts from self and following, plus recent popular posts
    const query = {
      $or: [
        { user: { $in: feedUserIds } },
        { likes: { $exists: true, $not: { $size: 0 } } },
      ],
    };

    const count = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate('user', 'name username avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Attach isLiked and isSaved flags for current user
    const savedPostDocs = await SavedPost.find({ user: req.user._id });
    const savedIds = new Set(savedPostDocs.map((s) => s.post.toString()));

    const formatted = posts.map((p) => {
      const pObj = p.toObject();
      return {
        ...pObj,
        isLiked: p.likes.some((id) => id.toString() === req.user._id.toString()),
        isSaved: savedIds.has(p._id.toString()),
        likesCount: p.likes.length,
      };
    });

    res.json({
      success: true,
      data: {
        posts: formatted,
        page,
        pages: Math.ceil(count / limit) || 1,
        total: count,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get explore posts / search by hashtag
const getExplorePosts = async (req, res, next) => {
  try {
    const { tag, search } = req.query;
    const query = {};

    if (tag) {
      query.tags = tag.toLowerCase();
    }
    if (search) {
      query.content = { $regex: search, $options: 'i' };
    }

    const posts = await Post.find(query)
      .populate('user', 'name username avatar')
      .sort({ createdAt: -1 })
      .limit(30);

    const savedPostDocs = await SavedPost.find({ user: req.user._id });
    const savedIds = new Set(savedPostDocs.map((s) => s.post.toString()));

    const formatted = posts.map((p) => ({
      ...p.toObject(),
      isLiked: p.likes.some((id) => id.toString() === req.user._id.toString()),
      isSaved: savedIds.has(p._id.toString()),
      likesCount: p.likes.length,
    }));

    // Aggregate trending hashtags
    const tagStats = await Post.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]);

    res.json({
      success: true,
      data: {
        posts: formatted,
        trendingTags: tagStats.map((t) => ({ tag: t._id, count: t.count })),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Like or unlike a post
const likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const isLiked = post.likes.some((id) => id.toString() === req.user._id.toString());

    if (isLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== req.user._id.toString());
      await post.save();
    } else {
      post.likes.push(req.user._id);
      await post.save();

      // Create notification for post owner if not self
      if (post.user.toString() !== req.user._id.toString()) {
        const notif = await Notification.create({
          recipient: post.user,
          sender: req.user._id,
          type: 'like',
          post: post._id,
          text: `${req.user.name} liked your post.`,
        });

        const io = req.app.get('io');
        if (io) {
          io.to(`user_${post.user}`).emit('notification', {
            ...notif.toObject(),
            sender: {
              _id: req.user._id,
              name: req.user.name,
              avatar: req.user.avatar,
            },
          });
        }
      }
    }

    res.json({
      success: true,
      data: {
        isLiked: !isLiked,
        likesCount: post.likes.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Delete a post
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
    }

    await Comment.deleteMany({ post: post._id });
    await Notification.deleteMany({ post: post._id });
    await SavedPost.deleteMany({ post: post._id });
    await Post.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc Get single post by ID
const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('user', 'name username avatar');
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    res.json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost,
  getFeedPosts,
  getExplorePosts,
  likePost,
  deletePost,
  getPostById,
};
