import express from 'express';
import { getLeaderboard, getUserProfile, updateProfile } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/users/leaderboard - Get top users sorted by XP
router.get('/leaderboard', getLeaderboard);

// PUT /api/users/profile - Update current user profile
router.put('/profile', protect, updateProfile);

// GET /api/users/:id - Get user profile and their projects
router.get('/:id', getUserProfile);

export default router;
