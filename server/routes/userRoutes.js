import express from 'express';
import { getLeaderboard, getUserProfile } from '../controllers/userController.js';

const router = express.Router();

// GET /api/users/leaderboard - Get top users sorted by XP
router.get('/leaderboard', getLeaderboard);

// GET /api/users/:id - Get user profile and their projects
router.get('/:id', getUserProfile);

export default router;
