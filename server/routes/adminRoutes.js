import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  deleteUserAdmin,
  deleteProjectAdmin,
  deleteReviewAdmin,
} from '../controllers/adminController.js';

const router = express.Router();

// Apply protect and authorize('admin') to all routes in this router
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUserAdmin);
router.delete('/projects/:id', deleteProjectAdmin);
router.delete('/reviews/:id', deleteReviewAdmin);

export default router;
