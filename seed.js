const mongoose = require('mongoose');
const User = require('./models/User');
const Skill = require('./models/Skill');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const seedDatabase = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/skillswap';
    console.log('Connecting to MongoDB at', uri);
    await mongoose.connect(uri);
    
    // Clear existing data (optional, but good for fresh seed)
    await User.deleteMany({});
    await Skill.deleteMany({});
    
    // Users
    const user1 = new User({
      name: 'Suruthi',
      email: 'test@example.com',
      password: 'password123',
      title: 'Full Stack Developer',
      bio: 'I love building MERN apps and swapping skills!',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Suruthi&backgroundColor=b6e3f4'
    });

    const user2 = new User({
      name: 'Priya Sharma',
      email: 'priya@example.com',
      password: 'password123',
      title: 'UI/UX Designer',
      bio: 'Creating beautiful digital experiences. Want to learn to code!',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya&backgroundColor=ffd5dc'
    });

    await user1.save();
    await user2.save();

    // Skills
    const skills = [
      {
        userId: user1._id,
        title: 'React & Next.js Development',
        category: 'Technology',
        level: 'Expert',
        description: 'Complete guide to modern React development including hooks, context, and performance optimization.',
        sessionType: 'Video Call',
        duration: '1 hour sessions',
        tags: ['React', 'Next.js', 'TypeScript']
      },
      {
        userId: user1._id,
        title: 'Node.js Backend Essentials',
        category: 'Technology',
        level: 'Advanced',
        description: 'Build fast and secure REST APIs with Express and MongoDB. Focus on JWT and middleware security.',
        sessionType: 'Video Call',
        duration: '1 hour sessions',
        tags: ['Node.js', 'Express', 'JWT']
      },
      {
        userId: user2._id,
        title: 'UX Design with Figma',
        category: 'Design',
        level: 'Expert',
        description: 'Learn wireframing and prototyping in Figma. Designing for accessibility and modern user experiences.',
        sessionType: 'Video Call',
        duration: '1 hour sessions',
        tags: ['UX', 'Figma', 'UI']
      },
      {
          userId: user2._id,
          title: 'Professional Photography',
          category: 'Photography',
          level: 'Expert',
          description: 'Master lighting, composition, and post-processing in Lightroom and Photoshop for stunning visuals.',
          sessionType: 'Video Call',
          duration: '1.5 hour sessions',
          tags: ['Photo', 'Adobe', 'Composition']
      },
      {
          userId: user2._id,
          title: 'Italian Cooking Mastery',
          category: 'Cooking',
          level: 'Advanced',
          description: 'Learn to make authentic pasta, sauces, and desserts from scratch with traditional Italian techniques.',
          sessionType: 'Video Call',
          duration: '1 hour sessions',
          tags: ['Pasta', 'Culinary', 'Food']
      }
    ];

    await Skill.insertMany(skills);

    console.log('Database seeded successfully!');
    console.log('User 1 (Suruthi): test@example.com / password123');
    console.log('User 2 (Priya): priya@example.com / password123');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDatabase();
