import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import env from '../config/env.js';

/**
 * User Schema
 *
 * Core user model for DevHunt SRM.
 * Stores profile info, credentials, and gamification data (XP, levels, badges).
 */
const userSchema = new mongoose.Schema(
  {
    // ─── Profile Info ───
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: false,
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Never return password in queries by default
    },
    // ─── Google OAuth ───
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values (for non-Google users)
    },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
    avatar: {
      type: String,
      default: '', // Cloudinary URL or empty for default avatar
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: '',
    },
    profession: {
      type: String,
      default: '',
    },
    skills: {
      type: [String],
      default: [],
    },
    department: {
      type: String,
      default: '',
    },
    github: {
      type: String,
      default: '',
    },
    linkedin: {
      type: String,
      default: '',
    },

    // ─── Role ───
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

    // ─── Gamification ───
    xp: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    badges: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Badge',
      },
    ],

    // ─── Password Reset ───
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// ─── Pre-Save Hook: Hash Password ───
// Runs before every save(). Only hashes if the password field was modified
// (so updating name/bio doesn't re-hash the existing password).
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  // Generate salt (12 rounds — good balance of security vs. speed)
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── Instance Method: Compare Passwords ───
// Used during login to verify the entered password against the stored hash.
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ─── Instance Method: Generate JWT ───
// Signs a token containing the user's ID. Used by tokenUtils as a fallback
// or when you want to call it directly on the user document.
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRE,
  });
};

// ─── Instance Method: Generate & Hash Password Reset Token ───
userSchema.methods.getResetPasswordToken = function () {
  // Generate random 20-byte hex token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire time (10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

export default User;
