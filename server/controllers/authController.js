import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendTokenResponse } from '../utils/tokenUtils.js';
import { sendEmail, sendPasswordResetEmail, verifySmtpConnection } from '../services/emailService.js';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import env from '../config/env.js';

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, department, yearOfStudy, profession, skills } = req.body;

  if (!email || !password || !name) {
    throw new ApiError(400, 'Please provide name, email and password.');
  }

  // Check if user already exists (provides a cleaner error than Mongoose duplicate key)
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ApiError(409, 'An account with this email already exists.');
  }

  // Parse skills array if string provided
  let skillsArray = [];
  if (Array.isArray(skills)) {
    skillsArray = skills;
  } else if (typeof skills === 'string') {
    skillsArray = skills.split(',').map((s) => s.trim()).filter(Boolean);
  }

  // Create user (password is hashed automatically by the pre-save hook)
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
    department: department || 'Computer Science & Engineering',
    yearOfStudy: yearOfStudy || 2,
    profession: profession ? profession.trim() : '',
    skills: skillsArray,
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

/**
 * @desc    Authenticate with Google (verify ID token, find/create user)
 * @route   POST /api/auth/google
 * @access  Public
 */
export const googleAuth = asyncHandler(async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    throw new ApiError(400, 'Google credential is required.');
  }

  // Verify the Google ID token
  let ticket;
  try {
    ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: env.GOOGLE_CLIENT_ID,
    });
  } catch (err) {
    throw new ApiError(401, 'Invalid Google token.');
  }

  const payload = ticket.getPayload();
  const { sub: googleId, email, name, picture } = payload;

  if (!email) {
    throw new ApiError(400, 'Google account does not have an email.');
  }

  // Check if user already exists by googleId or email
  let user = await User.findOne({
    $or: [{ googleId }, { email: email.toLowerCase() }],
  });

  if (user) {
    // Link Google ID if user registered with email/password before
    if (!user.googleId) {
      user.googleId = googleId;
      user.authProvider = 'google';
      if (picture && !user.avatar) {
        user.avatar = picture;
      }
      await user.save();
    }
  } else {
    // Create new user from Google data
    user = await User.create({
      name: name || email.split('@')[0],
      email: email.toLowerCase(),
      googleId,
      authProvider: 'google',
      avatar: picture || '',
    });

    // Send Welcome Email (non-blocking)
    sendEmail({
      to: user.email,
      subject: 'Welcome to DevHunt SRM! 🚀',
      text: `Hi ${user.name},\n\nWelcome to DevHunt SRM! You signed in with Google. Start exploring and shipping campus projects today!`,
    });
  }

  // Send token response (200 OK)
  sendTokenResponse(user, 200, res);
});

/**
 * @desc    Forgot Password — Request Reset Email via SMTP
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new ApiError(404, 'No account found with that email address.');
  }

  // Get reset token and save to database
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Create reset URL
  const resetUrl = `${env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

  try {
    await sendPasswordResetEmail({
      to: user.email,
      name: user.name,
      resetUrl,
    });

    res.status(200).json({
      success: true,
      message: 'PASSWORD RESET AUTHORIZATION DISPATCHED VIA SMTP',
      resetUrl: env.NODE_ENV === 'development' ? resetUrl : undefined,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    throw new ApiError(500, 'Email dispatch failed. Please check SMTP configuration.');
  }
});

/**
 * @desc    Reset Password using Crypto Token
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 */
export const resetPassword = asyncHandler(async (req, res) => {
  // Hash token from URL params
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, 'Invalid or expired password reset authorization token.');
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  // Log in user with fresh JWT token
  sendTokenResponse(user, 200, res);
});

/**
 * @desc    Test & Verify SMTP Connection
 * @route   POST /api/auth/test-smtp
 * @access  Public
 */
export const testSmtp = asyncHandler(async (req, res) => {
  const status = await verifySmtpConnection();
  res.status(200).json({
    success: true,
    status,
  });
});

