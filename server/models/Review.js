import mongoose from 'mongoose';
import Project from './Project.js';

const reviewSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ratings: {
      uiux: { type: Number, required: true, min: 1, max: 5 },
      codeQuality: { type: Number, required: true, min: 1, max: 5 },
      idea: { type: Number, required: true, min: 1, max: 5 },
    },
    overallScore: {
      type: Number,
      default: 0,
    },
    pros: {
      type: String,
      required: [true, 'Pros are required'],
      maxlength: 500,
    },
    cons: {
      type: String,
      required: [true, 'Cons are required'],
      maxlength: 500,
    },
    suggestion: {
      type: String,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

// Calculate overall score before saving
reviewSchema.pre('save', function (next) {
  this.overallScore =
    (this.ratings.uiux + this.ratings.codeQuality + this.ratings.idea) / 3;
  next();
});

// Calculate and update Project's average rating
reviewSchema.statics.getAverageRating = async function (projectId) {
  const obj = await this.aggregate([
    {
      $match: { project: projectId },
    },
    {
      $group: {
        _id: '$project',
        avgRating: { $avg: '$overallScore' },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  try {
    if (obj[0]) {
      await Project.findByIdAndUpdate(projectId, {
        avgRating: Math.round(obj[0].avgRating * 10) / 10,
        reviewCount: obj[0].reviewCount,
      });
    } else {
      await Project.findByIdAndUpdate(projectId, {
        avgRating: 0,
        reviewCount: 0,
      });
    }
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save
reviewSchema.post('save', function () {
  this.constructor.getAverageRating(this.project);
});

// Call getAverageRating before remove
reviewSchema.post('remove', function () {
  this.constructor.getAverageRating(this.project);
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
