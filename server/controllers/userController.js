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

/**
 * @desc    Update current user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, bio, profession, skills, department, github, linkedin, avatar } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  if (name !== undefined) user.name = name.trim();
  if (bio !== undefined) user.bio = bio.trim();
  if (profession !== undefined) user.profession = profession.trim();
  if (department !== undefined) user.department = department.trim();
  if (github !== undefined) user.github = github.trim();
  if (linkedin !== undefined) user.linkedin = linkedin.trim();
  if (avatar !== undefined) user.avatar = avatar;

  if (skills !== undefined) {
    if (Array.isArray(skills)) {
      user.skills = skills;
    } else if (typeof skills === 'string') {
      user.skills = skills.split(',').map((s) => s.trim()).filter(Boolean);
    }
  }

  await user.save();

  res.status(200).json({
    success: true,
    user,
    message: 'Profile updated successfully.',
  });
});
