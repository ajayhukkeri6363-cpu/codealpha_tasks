const express = require('express');
const router = express.Router();
const {
  createPost,
  getFeedPosts,
  getExplorePosts,
  likePost,
  deletePost,
  getPostById,
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getFeedPosts)
  .post(createPost);

router.get('/explore', getExplorePosts);

router.route('/:id')
  .get(getPostById)
  .delete(deletePost);

router.put('/:id/like', likePost);

module.exports = router;
