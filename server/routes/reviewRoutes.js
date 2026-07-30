import express from 'express';
import {
  addReview,
  getProjectReviews,
  updateReview,
  deleteReview,
} from '../controllers/reviewController.js';
import { validateReview } from '../validators/reviewValidators.js';
import { protect } from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = express.Router();

// GET /api/reviews/project/:projectId - Get reviews for a project (Public)
router.get('/project/:projectId', getProjectReviews);

// POST /api/reviews/:projectId - Add a review to a project (Protected)
router.post('/:projectId', protect, validateReview, validate, addReview);

// PUT /api/reviews/:id - Update a review (Protected, Reviewer only)
router.put('/:id', protect, validateReview, validate, updateReview);

// DELETE /api/reviews/:id - Delete a review (Protected, Reviewer/Admin only)
router.delete('/:id', protect, deleteReview);

export default router;
