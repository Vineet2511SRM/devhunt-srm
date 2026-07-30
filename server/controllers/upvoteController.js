import Upvote from '../models/Upvote.js';
import Project from '../models/Project.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { awardXP } from '../services/gamificationService.js';
import { createNotification } from '../services/notificationService.js';

/**
 * @desc    Toggle upvote for a project
 * @route   POST /api/upvotes/:projectId/toggle
 * @access  Private
 */
export const toggleUpvote = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user._id;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, 'Project not found.');
  }

  // Check if upvote already exists
  const existingUpvote = await Upvote.findOne({
    project: projectId,
    user: userId,
  });

  if (existingUpvote) {
    // User wants to remove their upvote
    await existingUpvote.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Upvote removed',
      upvoted: false,
    });
  } else {
    // User wants to add an upvote
    await Upvote.create({
      project: projectId,
      user: userId,
    });

    // Award +2 XP to the voter (gamification)
    await awardXP(userId, 2, 'project_upvoted');

    // Notify project owner (don't notify if they upvoted their own project)
    if (project.owner.toString() !== userId.toString()) {
      await createNotification(
        project.owner,
        'upvote',
        `${req.user.name} upvoted your project: ${project.title}`,
        `/projects/${project._id}`
      );
    }

    res.status(200).json({
      success: true,
      message: 'Upvote added',
      upvoted: true,
    });
  }
});
