import Notification from '../models/Notification.js';

export const createNotification = async (recipientId, type, message, link = '') => {
  try {
    await Notification.create({
      recipient: recipientId,
      type,
      message,
      link,
    });
  } catch (error) {
    console.error(`Notification Service Error: ${error.message}`);
  }
};
