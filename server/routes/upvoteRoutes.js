import express from 'express';
import { toggleUpvote } from '../controllers/upvoteController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// POST /api/upvotes/:projectId/toggle - Toggle upvote
router.post('/:projectId/toggle', protect, toggleUpvote);

export default router;
