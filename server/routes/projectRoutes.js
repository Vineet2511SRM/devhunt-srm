import express from 'express';
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import { validateCreateProject, validateUpdateProject } from '../validators/projectValidators.js';
import validate from '../middleware/validate.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload, uploadToCloudinary } from '../middleware/upload.js';

const router = express.Router();

// GET /api/projects — List all projects (public, with search/sort/filter/pagination)
router.get('/', getProjects);

// GET /api/projects/:id — Get a single project (public)
router.get('/:id', getProject);

// POST /api/projects — Create a new project (authenticated)
//   Pipeline: protect → multer (up to 5 screenshots) → upload to Cloudinary → validate → run validation → controller
router.post(
  '/',
  protect,
  upload.array('screenshots', 5),
  uploadToCloudinary,
  validateCreateProject,
  validate,
  createProject
);

// PUT /api/projects/:id — Update a project (owner or admin)
//   Pipeline: protect → multer (optional new screenshots) → upload to Cloudinary → validate → run validation → controller
router.put(
  '/:id',
  protect,
  upload.array('screenshots', 5),
  uploadToCloudinary,
  validateUpdateProject,
  validate,
  updateProject
);

// DELETE /api/projects/:id — Delete a project (owner or admin)
//   Pipeline: protect → controller
router.delete('/:id', protect, deleteProject);

export default router;
