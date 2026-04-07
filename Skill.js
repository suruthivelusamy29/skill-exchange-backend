const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], required: true },
  description: { type: String, required: true },
  sessionType: { type: String, required: true },
  duration: { type: String, required: true },
  tags: [String],
  wantInReturn: [String],
  rating: { type: Number, default: 5.0 },
  reviews: { type: Number, default: 0 },
  swapsCompleted: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Skill', SkillSchema);
