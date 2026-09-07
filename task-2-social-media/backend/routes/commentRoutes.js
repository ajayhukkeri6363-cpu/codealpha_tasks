const express = require('express');
const router = express.Router();
const { getPostComments, addComment, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/post/:postId')
  .get(getPostComments)
  .post(addComment);

router.delete('/:id', deleteComment);

module.exports = router;
