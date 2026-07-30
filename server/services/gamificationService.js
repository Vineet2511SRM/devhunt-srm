import User from '../models/User.js';
import { createNotification } from './notificationService.js';

/**
 * Award XP to a user and handle level-ups
 * @param {String} userId - The user's ID
 * @param {Number} xpAmount - Amount of XP to award
 * @param {String} reason - Reason for awarding XP
 */
export const awardXP = async (userId, xpAmount, reason) => {
  try {
    const user = await User.findById(userId);
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

    await user.save();
    return { user, leveledUp };
  } catch (error) {
    console.error(`Gamification Service Error: ${error.message}`);
  }
};
