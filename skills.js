const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');
const auth = require('../middleware/auth');

// @route   GET api/skills
// @desc    Get all skills with optional category filter
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    if (category && category !== 'all') {
      query.category = category;
    }
    const skills = await Skill.find(query)
      .populate('userId', 'name avatar location online verified')
      .sort({ createdAt: -1 });
    res.json(skills);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/skills/:id
// @desc    Get skill by ID
router.get('/:id', async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id)
      .populate('userId', 'name avatar location online verified');
    if (!skill) return res.status(404).json({ msg: 'Skill not found' });
    res.json(skill);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/skills
// @desc    Create a skill
router.post('/', auth, async (req, res) => {
  try {
    const newSkill = new Skill({
      ...req.body,
      userId: req.user.id
    });
    const skill = await newSkill.save();
    res.json(skill);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
