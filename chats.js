const express = require('express');
const router = express.Router();
const { ChatRoom, Message } = require('../models/Message');
const auth = require('../middleware/auth');

// @route   GET api/chats
// @desc    Get all chat rooms for a user
router.get('/', auth, async (req, res) => {
  try {
    const rooms = await ChatRoom.find({
      participants: { $in: [req.user.id] }
    }).sort({ lastMessageAt: -1 }).populate('participants', 'name avatar');
    res.json(rooms);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/chats
// @desc    Create/Get a chat room between two users
router.post('/', auth, async (req, res) => {
  const { partnerId, skillTitle } = req.body;
  try {
    let room = await ChatRoom.findOne({
      participants: { $all: [req.user.id, partnerId] }
    });

    if (!room) {
      room = new ChatRoom({
        participants: [req.user.id, partnerId],
        skillTitle: skillTitle || 'General Discussion'
      });
      await room.save();
    }
    res.json(room);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/chats/:roomId/messages
// @desc    Get messages in a room
router.get('/:roomId/messages', auth, async (req, res) => {
  try {
    const messages = await Message.find({ roomId: req.params.roomId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/chats/:roomId/messages
// @desc    Send a message
router.post('/:roomId/messages', auth, async (req, res) => {
  const { text } = req.body;
  try {
    const message = new Message({
      roomId: req.params.roomId,
      senderId: req.user.id,
      text
    });
    await message.save();

    await ChatRoom.findByIdAndUpdate(req.params.roomId, {
      lastMessage: text,
      lastMessageAt: Date.now()
    });

    res.json(message);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
