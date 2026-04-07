const express = require('express');
const router = express.Router();
const SwapRequest = require('../models/SwapRequest');
const auth = require('../middleware/auth');

// @route   POST api/swaps
// @desc    Create a swap request
router.post('/', auth, async (req, res) => {
  const { receiverId, skillId, offeredSkillId, message } = req.body;
  try {
    const newRequest = new SwapRequest({
      senderId: req.user.id,
      receiverId,
      skillId,
      offeredSkillId,
      message
    });
    const swap = await newRequest.save();
    res.json(swap);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/swaps/received
// @desc    Get requests received by user
router.get('/received', auth, async (req, res) => {
  try {
    const requests = await SwapRequest.find({ receiverId: req.user.id })
      .populate('senderId', 'name avatar')
      .populate('skillId', 'title')
      .populate('offeredSkillId', 'title')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/swaps/sent
// @desc    Get requests sent by user
router.get('/sent', auth, async (req, res) => {
  try {
    const requests = await SwapRequest.find({ senderId: req.user.id })
      .populate('receiverId', 'name avatar')
      .populate('skillId', 'title')
      .populate('offeredSkillId', 'title')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/swaps/:id
// @desc    Update request status
router.put('/:id', auth, async (req, res) => {
  const { status } = req.body;
  try {
    let request = await SwapRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ msg: 'Request not found' });
    
    // Only receiver can accept/decline
    if (request.receiverId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    request.status = status;
    await request.save();
    res.json(request);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
