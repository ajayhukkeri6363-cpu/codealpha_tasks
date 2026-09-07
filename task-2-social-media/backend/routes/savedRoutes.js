const express = require('express');
const router = express.Router();
const { getSavedPosts, toggleSavePost } = require('../controllers/savedController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getSavedPosts);
router.post('/:postId', toggleSavePost);

module.exports = router;
