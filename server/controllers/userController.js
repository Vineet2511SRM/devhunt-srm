import User from '../models/User.js';
import Project from '../models/Project.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Get top users for the leaderboard
 * @route   GET /api/users/leaderboard
 * @access  Public
 */
export const getLeaderboard = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;

  const users = await User.find()
    .select('name avatar xp level badges')
    .sort({ xp: -1 })
    .limit(limit)
    .populate('badges');

  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
});

/**
 * @desc    Get user profile with their projects
 * @route   GET /api/users/:id
 * @access  Public
 */
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('-password')
    .populate('badges');

  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  // Fetch projects owned by this user
  const projects = await Project.find({ owner: user._id })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    user,
    projects,
  });
});
