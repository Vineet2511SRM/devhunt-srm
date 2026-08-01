import User from '../models/User.js';
import Project from '../models/Project.js';
import Review from '../models/Review.js';
import Upvote from '../models/Upvote.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Get system-wide stats dashboard data for Admin
 * @route   GET /api/admin/stats
 * @access  Private (Admin only)
 */
export const getAdminStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalProjects,
    totalReviews,
    totalUpvotes,
    recentUsers,
    recentProjects,
    categoryBreakdown,
  ] = await Promise.all([
    User.countDocuments(),
    Project.countDocuments(),
    Review.countDocuments(),
    Upvote.countDocuments(),
    User.find().sort({ createdAt: -1 }).limit(5).select('-password'),
    Project.find().sort({ createdAt: -1 }).limit(5).populate('owner', 'name email avatar'),
    Project.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
  ]);

  res.status(200).json({
    success: true,
    data: {
      overview: {
        totalUsers,
        totalProjects,
        totalReviews,
        totalUpvotes,
      },
      recentUsers,
      recentProjects,
      categoryBreakdown,
    },
  });
});

/**
 * @desc    Get all users with search, role filter, and pagination
 * @route   GET /api/admin/users
 * @access  Private (Admin only)
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search || '';
  const role = req.query.role || '';

  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { department: { $regex: search, $options: 'i' } },
    ];
  }

  if (role) {
    query.role = role;
  }

  const skip = (page - 1) * limit;

  const users = await User.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('-password');

  const totalUsers = await User.countDocuments(query);

  res.status(200).json({
    success: true,
    count: users.length,
    total: totalUsers,
    page,
    pages: Math.ceil(totalUsers / limit),
    users,
  });
});

/**
 * @desc    Update a user's role (user <-> admin)
 * @route   PATCH /api/admin/users/:id/role
 * @access  Private (Admin only)
 */
export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!['user', 'admin'].includes(role)) {
    throw new ApiError(400, "Role must be 'user' or 'admin'");
  }

  const targetUser = await User.findById(req.params.id);
  if (!targetUser) {
    throw new ApiError(404, 'User not found');
  }

  // Prevent self-demotion if single admin
  if (targetUser._id.toString() === req.user._id.toString() && role !== 'admin') {
    throw new ApiError(400, 'You cannot remove your own admin status');
  }

  targetUser.role = role;
  await targetUser.save();

  res.status(200).json({
    success: true,
    message: `User role updated to ${role}`,
    user: {
      _id: targetUser._id,
      name: targetUser.name,
      email: targetUser.email,
      role: targetUser.role,
    },
  });
});

/**
 * @desc    Delete any user and cascade delete their projects & reviews
 * @route   DELETE /api/admin/users/:id
 * @access  Private (Admin only)
 */
export const deleteUserAdmin = asyncHandler(async (req, res) => {
  const targetUser = await User.findById(req.params.id);
  if (!targetUser) {
    throw new ApiError(404, 'User not found');
  }

  if (targetUser._id.toString() === req.user._id.toString()) {
    throw new ApiError(400, 'You cannot delete your own admin account');
  }

  // Cascade delete projects, reviews, upvotes created by user
  await Project.deleteMany({ owner: targetUser._id });
  await Review.deleteMany({ reviewer: targetUser._id });
  await Upvote.deleteMany({ user: targetUser._id });

  await targetUser.deleteOne();

  res.status(200).json({
    success: true,
    message: 'User and all associated data deleted successfully',
  });
});

/**
 * @desc    Delete any project (Admin action)
 * @route   DELETE /api/admin/projects/:id
 * @access  Private (Admin only)
 */
export const deleteProjectAdmin = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  await Review.deleteMany({ project: project._id });
  await Upvote.deleteMany({ project: project._id });
  await project.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Project deleted successfully by admin',
  });
});

/**
 * @desc    Delete any review (Admin action)
 * @route   DELETE /api/admin/reviews/:id
 * @access  Private (Admin only)
 */
export const deleteReviewAdmin = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    throw new ApiError(404, 'Review not found');
  }

  const projectId = review.project;
  await review.deleteOne();

  // Recalculate average rating on target project
  const remainingReviews = await Review.find({ project: projectId });
  const avgRating = remainingReviews.length > 0
    ? remainingReviews.reduce((acc, curr) => acc + curr.overallScore, 0) / remainingReviews.length
    : 0;

  await Project.findByIdAndUpdate(projectId, {
    avgRating,
    reviewCount: remainingReviews.length,
  });

  res.status(200).json({
    success: true,
    message: 'Review deleted successfully by admin',
  });
});
