import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  googleAuth,
  forgotPassword,
  resetPassword,
  testSmtp,
} from '../controllers/authController.js';
import {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
} from '../validators/authValidators.js';
import validate from '../middleware/validate.js';
import { protect, authorize } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// POST /api/auth/register — Create a new account
//   Pipeline: authLimiter → validateRegister → validate → register
router.post('/register', authLimiter, validateRegister, validate, register);

// POST /api/auth/login — Authenticate and get token
//   Pipeline: authLimiter → validateLogin → validate → login
router.post('/login', authLimiter, validateLogin, validate, login);

// POST /api/auth/google — Authenticate with Google
//   Pipeline: authLimiter → googleAuth
router.post('/google', authLimiter, googleAuth);

// POST /api/auth/forgot-password — Request password reset email via SMTP
//   Pipeline: authLimiter → validateForgotPassword → validate → forgotPassword
router.post('/forgot-password', authLimiter, validateForgotPassword, validate, forgotPassword);

// POST /api/auth/reset-password/:token — Reset password with token
//   Pipeline: authLimiter → validateResetPassword → validate → resetPassword
router.post('/reset-password/:token', authLimiter, validateResetPassword, validate, resetPassword);

// POST /api/auth/test-smtp — Verify SMTP transport connection
//   Pipeline: protect → authorize('admin') → testSmtp
router.post('/test-smtp', protect, authorize('admin'), testSmtp);

// POST /api/auth/logout — Clear auth cookie
//   Pipeline: protect → logout
router.post('/logout', protect, logout);

// GET /api/auth/me — Get current user profile
//   Pipeline: protect → getMe
router.get('/me', protect, getMe);

export default router;
