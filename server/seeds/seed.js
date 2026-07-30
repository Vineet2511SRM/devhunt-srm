import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import User from '../models/User.js';
import Project from '../models/Project.js';
import Review from '../models/Review.js';
import Upvote from '../models/Upvote.js';
import Badge from '../models/Badge.js';
import Notification from '../models/Notification.js';

// Setup env variables for the seeder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedDatabase = async () => {
  try {
    console.log('🌱 Connecting to Database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB.');

    console.log('🧹 Clearing existing data...');
    await Promise.all([
      User.deleteMany(),
      Project.deleteMany(),
      Review.deleteMany(),
      Upvote.deleteMany(),
      Badge.deleteMany(),
      Notification.deleteMany(),
    ]);

    console.log('🏅 Inserting Badges...');
    const badges = await Badge.insertMany([
      { name: 'First Project', icon: '🚀', description: 'Submitted your first project', criteria: 'first_project' },
      { name: 'First Review', icon: '🕵️‍♂️', description: 'Left your first review', criteria: 'first_review' },
      { name: 'First Upvote', icon: '⬆️', description: 'Upvoted a project', criteria: 'first_upvote' },
      { name: 'Centurion', icon: '💯', description: 'Earned 100 XP', criteria: '100_xp' },
      { name: 'Veteran', icon: '🌟', description: 'Earned 500 XP', criteria: '500_xp' },
    ]);

    console.log('👥 Inserting Mock Users...');
    const users = await User.insertMany([
      { name: 'Alice Hacker', email: 'alice@example.com', password: 'password123', xp: 120, level: 3 },
      { name: 'Bob Builder', email: 'bob@example.com', password: 'password123', xp: 50, level: 2 },
      { name: 'Charlie Dev', email: 'charlie@example.com', password: 'password123', xp: 10, level: 1 },
    ]);

    console.log('🏗️ Inserting Mock Projects...');
    const projects = await Project.insertMany([
      {
        title: 'CampusBuddy',
        tagline: 'All your campus needs in one app.',
        description: 'A comprehensive app for students to check timetable, attendance, and campus events.',
        techStack: ['React Native', 'Node.js', 'MongoDB'],
        liveUrl: 'https://campusbuddy.example.com',
        repoUrl: 'https://github.com/alice/campusbuddy',
        owner: users[0]._id, // Alice
        status: 'published',
      },
      {
        title: 'AlgoVisualizer',
        tagline: 'See algorithms in action.',
        description: 'Interactive visualization for sorting and pathfinding algorithms.',
        techStack: ['React', 'CSS'],
        liveUrl: 'https://algovisual.example.com',
        repoUrl: 'https://github.com/bob/algovisualizer',
        owner: users[1]._id, // Bob
        status: 'published',
      },
    ]);

    console.log('✅ Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
