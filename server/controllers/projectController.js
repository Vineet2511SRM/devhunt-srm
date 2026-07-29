import Project from '../models/Project.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Create a new project
 * @route   POST /api/projects
 * @access  Private
 */
export const createProject = asyncHandler(async (req, res) => {
  const { title, tagline, description, techStack, liveUrl, repoUrl, status } = req.body;

  // Collect screenshot URLs uploaded by the uploadToCloudinary middleware
  const screenshots = req.body.uploadedUrls || [];

  const project = await Project.create({
    title: title.trim(),
    tagline: tagline.trim(),
    description: description.trim(),
    techStack,
    liveUrl: liveUrl || '',
    repoUrl: repoUrl || '',
    screenshots,
    owner: req.user._id,
    status: status || 'published',
  });

  // Populate owner info before sending the response
  await project.populate('owner', 'name email avatar');

  res.status(201).json({
    success: true,
    project,
  });
});

/**
 * @desc    Get all projects (with pagination, sorting, filtering, search)
 * @route   GET /api/projects
 * @access  Public
 *
 * Query params:
 *   - page (default: 1)
 *   - limit (default: 12)
 *   - sort: newest | oldest | top-rated | trending (default: newest)
 *   - search: text search query
 *   - techStack: comma-separated filter (e.g. ?techStack=React,Node.js)
 *   - status: draft | published | archived (default: published for public)
 *   - owner: filter by owner ID
 */
export const getProjects = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 12));
  const skip = (page - 1) * limit;

  // Build the filter query
  const filter = {};

  // Status filter — default to 'published' for public browsing
  filter.status = req.query.status || 'published';

  // Owner filter
  if (req.query.owner) {
    filter.owner = req.query.owner;
  }

  // Tech stack filter (comma-separated)
  if (req.query.techStack) {
    const techFilters = req.query.techStack.split(',').map((t) => t.trim()).filter(Boolean);
    if (techFilters.length > 0) {
      filter.techStack = { $in: techFilters };
    }
  }

  // Text search
  if (req.query.search) {
    filter.$text = { $search: req.query.search };
  }

  // Build sort option
  let sortOption = {};
  switch (req.query.sort) {
    case 'oldest':
      sortOption = { createdAt: 1 };
      break;
    case 'top-rated':
      sortOption = { avgRating: -1, reviewCount: -1 };
      break;
    case 'trending':
      sortOption = { upvoteCount: -1, createdAt: -1 };
      break;
    case 'newest':
    default:
      // If doing a text search, sort by relevance first then by date
      sortOption = req.query.search
        ? { score: { $meta: 'textScore' }, createdAt: -1 }
        : { createdAt: -1 };
      break;
  }

  // Build the query
  let query = Project.find(filter);

  // If text search, project the text score for relevance sorting
  if (req.query.search && req.query.sort !== 'top-rated' && req.query.sort !== 'trending' && req.query.sort !== 'oldest') {
    query = query.select({ score: { $meta: 'textScore' } });
  }

  // Execute count + data queries in parallel
  const [total, projects] = await Promise.all([
    Project.countDocuments(filter),
    query
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .populate('owner', 'name email avatar'),
  ]);

  res.status(200).json({
    success: true,
    count: projects.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    projects,
  });
});

/**
 * @desc    Get a single project by ID
 * @route   GET /api/projects/:id
 * @access  Public
 */
export const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('owner', 'name email avatar bio github linkedin');

  if (!project) {
    throw new ApiError(404, 'Project not found.');
  }

  res.status(200).json({
    success: true,
    project,
  });
});

/**
 * @desc    Update a project (owner only)
 * @route   PUT /api/projects/:id
 * @access  Private (owner or admin)
 */
export const updateProject = asyncHandler(async (req, res) => {
  let project = await Project.findById(req.params.id);

  if (!project) {
    throw new ApiError(404, 'Project not found.');
  }

  // Only the owner or an admin can update
  if (project.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'You are not authorized to update this project.');
  }

  // If new screenshots were uploaded, append them
  if (req.body.uploadedUrls && req.body.uploadedUrls.length > 0) {
    const existingScreenshots = project.screenshots || [];
    const newScreenshots = [...existingScreenshots, ...req.body.uploadedUrls];

    // Enforce max 5 screenshots
    if (newScreenshots.length > 5) {
      throw new ApiError(400, `Maximum 5 screenshots allowed. You already have ${existingScreenshots.length}.`);
    }

    req.body.screenshots = newScreenshots;
  }

  // Remove fields that shouldn't be updated directly
  delete req.body.owner;
  delete req.body.upvoteCount;
  delete req.body.avgRating;
  delete req.body.reviewCount;
  delete req.body.uploadedUrls;
  delete req.body.uploadedUrl;

  project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('owner', 'name email avatar');

  res.status(200).json({
    success: true,
    project,
  });
});

/**
 * @desc    Delete a project (owner only)
 * @route   DELETE /api/projects/:id
 * @access  Private (owner or admin)
 */
export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    throw new ApiError(404, 'Project not found.');
  }

  // Only the owner or an admin can delete
  if (project.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'You are not authorized to delete this project.');
  }

  await project.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Project deleted successfully.',
  });
});
