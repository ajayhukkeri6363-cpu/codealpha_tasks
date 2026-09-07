const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  followUser,
  unfollowUser,
  getSuggestedUsers,
  getFollowers,
  getFollowing,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/suggested', getSuggestedUsers);
router.get('/profile/:username', getUserProfile);
router.put('/:id/follow', followUser);
router.put('/:id/unfollow', unfollowUser);
router.get('/:id/followers', getFollowers);
router.get('/:id/following', getFollowing);

module.exports = router;
