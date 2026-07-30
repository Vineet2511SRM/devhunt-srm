import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendTokenResponse } from '../utils/tokenUtils.js';
import { sendEmail } from '../services/emailService.js';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists (provides a cleaner error than Mongoose duplicate key)
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ApiError(409, 'An account with this email already exists.');
  }

  // Create user (password is hashed automatically by the pre-save hook)
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
  });

  // Send Welcome Email (non-blocking)
  sendEmail({
    to: user.email,
    subject: 'Welcome to DevHunt SRM! 🚀',
    text: `Hi ${user.name},\n\nWelcome to DevHunt SRM! We are excited to have you on board. Start exploring and testing campus projects today!`,
  });

  // Send token response (201 Created)
  sendTokenResponse(user, 201, res);
});

/**
 * @desc    Login user with email & password
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user and explicitly include the password field (which is select: false by default)
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  // Verify password against stored hash
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  // Send token response (200 OK)
  sendTokenResponse(user, 200, res);
});

/**
 * @desc    Logout user (clear cookie)
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = asyncHandler(async (req, res) => {
  // Clear the token cookie by setting it to 'none' with an immediate expiry
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 5 * 1000), // Expires in 5 seconds
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
});

/**
 * @desc    Get currently logged-in user's profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  // req.user is already set by the protect middleware
  const user = await User.findById(req.user._id).populate('badges');

  res.status(200).json({
    success: true,
    user,
  });
});
