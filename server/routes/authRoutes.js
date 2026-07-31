import express from 'express';
import { register, login, logout, getMe, googleAuth } from '../controllers/authController.js';
import { validateRegister, validateLogin } from '../validators/authValidators.js';
import validate from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// POST /api/auth/register — Create a new account
//   Pipeline: validateRegister → validate → register
router.post('/register', validateRegister, validate, register);

// POST /api/auth/login — Authenticate and get token
//   Pipeline: authLimiter → validateLogin → validate → login
router.post('/login', authLimiter, validateLogin, validate, login);

// POST /api/auth/google — Authenticate with Google
router.post('/google', googleAuth);

// POST /api/auth/logout — Clear auth cookie
//   Pipeline: protect → logout
router.post('/logout', protect, logout);

// GET /api/auth/me — Get current user profile
//   Pipeline: protect → getMe
router.get('/me', protect, getMe);

export default router;
