import Review from '../models/Review.js';
import Project from '../models/Project.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { awardXP } from '../services/gamificationService.js';

/**
 * @desc    Add a review to a project
 * @route   POST /api/reviews/:projectId
 * @access  Private
 */
export const addReview = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { ratings, pros, cons, suggestion } = req.body;
  const reviewerId = req.user._id;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, 'Project not found.');
  }

  // Prevent user from reviewing their own project
  if (project.owner.toString() === reviewerId.toString()) {
    throw new ApiError(400, 'You cannot review your own project.');
  }

  // Check if user has already reviewed this project
  const existingReview = await Review.findOne({
    project: projectId,
    reviewer: reviewerId,
  });

  if (existingReview) {
    throw new ApiError(400, 'You have already reviewed this project.');
  }

  const review = await Review.create({
    project: projectId,
    reviewer: reviewerId,
    ratings,
    pros,
    cons,
    suggestion,
  });

  // Gamification: Award XP
  // +5 XP to reviewer
  await awardXP(reviewerId, 5, 'review_submitted');
  // +25 XP to project owner
  await awardXP(project.owner, 25, 'review_received');

  await review.populate('reviewer', 'name avatar');

  res.status(201).json({
    success: true,
    review,
  });
});

/**
 * @desc    Get all reviews for a project
 * @route   GET /api/reviews/project/:projectId
 * @access  Public
 */
export const getProjectReviews = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
  const skip = (page - 1) * limit;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, 'Project not found.');
  }

  const [total, reviews] = await Promise.all([
    Review.countDocuments({ project: projectId }),
    Review.find({ project: projectId })
      .populate('reviewer', 'name avatar xp level badges')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
  ]);

  res.status(200).json({
    success: true,
    count: reviews.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    reviews,
  });
});

/**
 * @desc    Update a review
 * @route   PUT /api/reviews/:id
 * @access  Private (Owner only)
 */
export const updateReview = asyncHandler(async (req, res) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    throw new ApiError(404, 'Review not found.');
  }

  // Only the reviewer can update
  if (review.reviewer.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You are not authorized to update this review.');
  }

  const { ratings, pros, cons, suggestion } = req.body;

  review.ratings = ratings || review.ratings;
  review.pros = pros || review.pros;
  review.cons = cons || review.cons;
  if (suggestion !== undefined) {
    review.suggestion = suggestion;
  }

  await review.save(); // using save() to trigger pre-save recalculation of overallScore and post-save for project avgRating

  await review.populate('reviewer', 'name avatar');

  res.status(200).json({
    success: true,
    review,
  });
});

/**
 * @desc    Delete a review
 * @route   DELETE /api/reviews/:id
 * @access  Private (Reviewer or admin)
 */
export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    throw new ApiError(404, 'Review not found.');
  }

  // Only the reviewer or an admin can delete
  if (review.reviewer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'You are not authorized to delete this review.');
  }

  await review.deleteOne(); // Using deleteOne instead of remove to trigger middleware correctly in Mongoose 6+

  res.status(200).json({
    success: true,
    message: 'Review deleted successfully.',
  });
});
