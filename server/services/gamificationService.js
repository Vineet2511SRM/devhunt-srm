import User from '../models/User.js';
import Badge from '../models/Badge.js';
import { createNotification } from './notificationService.js';

/**
 * Award XP to a user and handle level-ups & badges
 * @param {String} userId - The user's ID
 * @param {Number} xpAmount - Amount of XP to award
 * @param {String} reason - Reason for awarding XP
 */
export const awardXP = async (userId, xpAmount, reason) => {
  try {
    const user = await User.findById(userId).populate('badges');
    if (!user) return;

    user.xp += xpAmount;

    // Simple level calculation: Level = floor(sqrt(xp / 10)) + 1
    // e.g. 10 XP -> level 2. 40 XP -> level 3. 90 XP -> level 4.
    const newLevel = Math.floor(Math.sqrt(user.xp / 10)) + 1;

    let leveledUp = false;
    if (newLevel > user.level) {
      user.level = newLevel;
      leveledUp = true;
      
      // Notify about level up
      await createNotification(
        user._id,
        'level_up',
        `Congratulations! You've reached Level ${newLevel}! 🎉`
      );
    }

    // Badge Evaluation Logic
    const allBadges = await Badge.find();
    let newBadgesEarned = [];

    const evaluateBadgeCriteria = (criteria) => {
      if (criteria === 'first_project' && reason === 'project_submitted') return true;
      if (criteria === 'first_review' && reason === 'review_submitted') return true;
      if (criteria === 'first_upvote' && reason === 'upvote_submitted') return true;
      if (criteria === '100_xp' && user.xp >= 100) return true;
      if (criteria === '500_xp' && user.xp >= 500) return true;
      return false;
    };

    for (let badge of allBadges) {
      // Check if user already has this badge
      const hasBadge = user.badges.some(b => b._id.toString() === badge._id.toString());
      
      if (!hasBadge && evaluateBadgeCriteria(badge.criteria)) {
        user.badges.push(badge._id);
        newBadgesEarned.push(badge);
        
        await createNotification(
          user._id,
          'badge_earned',
          `Awesome! You earned a new badge: ${badge.name} ${badge.icon}`
        );
      }
    }

    await user.save();
    return { user, leveledUp, newBadgesEarned };
  } catch (error) {
    console.error(`Gamification Service Error: ${error.message}`);
  }
};
