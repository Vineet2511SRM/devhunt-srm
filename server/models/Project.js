import mongoose from 'mongoose';

/**
 * Project Schema
 *
 * Represents a student project on DevHunt SRM.
 * Stores metadata, links, screenshots (Cloudinary URLs), owner reference,
 * and aggregated stats (upvotes, ratings, reviews).
 */
const projectSchema = new mongoose.Schema(
  {
    // ─── Core Info ───
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    tagline: {
      type: String,
      required: [true, 'A short tagline is required'],
      trim: true,
      maxlength: [150, 'Tagline cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      minlength: [20, 'Description must be at least 20 characters'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },

    // ─── Tech & Links ───
    techStack: {
      type: [String],
      required: [true, 'At least one technology must be specified'],
      validate: {
        validator: (arr) => arr.length > 0 && arr.length <= 15,
        message: 'Tech stack must have 1-15 technologies',
      },
    },
    liveUrl: {
      type: String,
      default: '',
    },
    repoUrl: {
      type: String,
      default: '',
    },

    // ─── Media ───
    screenshots: {
      type: [String], // Array of Cloudinary secure URLs
      validate: {
        validator: (arr) => arr.length <= 5,
        message: 'Maximum 5 screenshots allowed',
      },
      default: [],
    },

    // ─── Ownership ───
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Project must have an owner'],
    },

    // ─── Aggregated Stats (denormalized for performance) ───
    upvoteCount: {
      type: Number,
      default: 0,
    },
    avgRating: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },

    // ─── Status ───
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ───

// Text index for search by title, tagline, and description
projectSchema.index({ title: 'text', tagline: 'text', description: 'text' });

// Compound index for common query patterns
projectSchema.index({ status: 1, createdAt: -1 });
projectSchema.index({ owner: 1 });
projectSchema.index({ techStack: 1 });

// ─── Virtual: populate reviews for a project ───
projectSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'project',
  justOne: false,
});

const Project = mongoose.model('Project', projectSchema);

export default Project;
