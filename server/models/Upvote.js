import mongoose from 'mongoose';
import Project from './Project.js';

const upvoteSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent a user from upvoting the same project more than once
upvoteSchema.index({ project: 1, user: 1 }, { unique: true });

upvoteSchema.statics.getUpvoteCount = async function (projectId) {
  const count = await this.countDocuments({ project: projectId });
  try {
    await Project.findByIdAndUpdate(projectId, {
      upvoteCount: count,
    });
  } catch (err) {
    console.error(err);
  }
};

upvoteSchema.post('save', function () {
  this.constructor.getUpvoteCount(this.project);
});

upvoteSchema.post('remove', function () {
  this.constructor.getUpvoteCount(this.project);
});

const Upvote = mongoose.model('Upvote', upvoteSchema);
export default Upvote;
