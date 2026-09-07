const express = require('express');
const router = express.Router();
const { createMeeting, getMeetingByRoomId, getMyMeetings, getRoomMessages } = require('../controllers/meetingController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createMeeting).get(protect, getMyMeetings);
router.get('/:roomId', getMeetingByRoomId);
router.get('/:roomId/messages', protect, getRoomMessages);

module.exports = router;