const Comment = require('../models/Comment');
const Post = require('../models/Post');
const Notification = require('../models/Notification');

const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('user', 'name username avatar')
      .sort({ createdAt: 1 });

    res.json({ success: true, data: comments });
  } catch (error) {
    next(error);
  }
};

const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Comment text cannot be empty' });
    }

    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const comment = await Comment.create({
      post: post._id,
      user: req.user._id,
      text: text.trim(),
    });

    post.commentsCount += 1;
    await post.save();

    const populated = await Comment.findById(comment._id).populate('user', 'name username avatar');

    // Notify post owner
    if (post.user.toString() !== req.user._id.toString()) {
      const notif = await Notification.create({
        recipient: post.user,
        sender: req.user._id,
        type: 'comment',
        post: post._id,
        text: `${req.user.name} commented on your post: "${text.substring(0, 40)}..."`,
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

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this comment' });
    }

    await Post.findByIdAndUpdate(comment.post, { $inc: { commentsCount: -1 } });
    await Comment.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPostComments, addComment, deleteComment };
