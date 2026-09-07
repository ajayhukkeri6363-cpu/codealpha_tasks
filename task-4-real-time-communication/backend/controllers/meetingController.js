const Meeting = require('../models/Meeting');
const ChatMessage = require('../models/ChatMessage');

// @desc    Create new meeting room
// @route   POST /api/meetings
// @access  Private
const createMeeting = async (req, res) => {
  try {
    const { title, roomId, isPrivate, passcode } = req.body;

    const generatedRoomId = roomId || Math.random().toString(36).substring(2, 6) + '-' + Math.random().toString(36).substring(2, 6);

    const existing = await Meeting.findOne({ roomId: generatedRoomId.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'Room ID already in use. Please select another.' });
    }

    const meeting = await Meeting.create({
      title: title || 'Nexus Video Conference',
      roomId: generatedRoomId.toLowerCase(),
      host: req.user._id,
      isPrivate: !!isPrivate,
      passcode: passcode || '',
      participants: [{ user: req.user._id }],
    });

    const populated = await Meeting.findById(meeting._id).populate('host', 'name email avatar');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get meeting info by roomId
// @route   GET /api/meetings/:roomId
// @access  Public / Private
const getMeetingByRoomId = async (req, res) => {
  try {
    const meeting = await Meeting.findOne({ roomId: req.params.roomId.toLowerCase() })
      .populate('host', 'name email avatar')
      .populate('participants.user', 'name email avatar');

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting room not found' });
    }

    res.json(meeting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's recent / active meetings
// @route   GET /api/meetings
// @access  Private
const getMyMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({
      $or: [{ host: req.user._id }, { 'participants.user': req.user._id }],
    })
      .populate('host', 'name email avatar')
      .sort({ updatedAt: -1 })
      .limit(10);

    res.json(meetings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get room chat messages
// @route   GET /api/meetings/:roomId/messages
// @access  Private
const getRoomMessages = async (req, res) => {
  try {
    const messages = await ChatMessage.find({ roomId: req.params.roomId.toLowerCase() })
      .sort({ createdAt: 1 })
      .limit(100);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createMeeting, getMeetingByRoomId, getMyMeetings, getRoomMessages };