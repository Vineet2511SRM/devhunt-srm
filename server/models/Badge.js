import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    icon: {
      type: String, // Emoji or URL
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    criteria: {
      type: String, // Identifier for the criteria (e.g. "first_review", "100_xp")
      required: true,
    },
  },
  { timestamps: true }
);

const Badge = mongoose.model('Badge', badgeSchema);
export default Badge;
