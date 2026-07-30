import Notification from '../models/Notification.js';

export const createNotification = async (recipientId, type, message, link = '', relatedProjectId = null) => {
  try {
    const data = {
      recipient: recipientId,
      type,
      message,
      link,
    };
    if (relatedProjectId) data.relatedProject = relatedProjectId;

    await Notification.create(data);
  } catch (error) {
    console.error(`Notification Service Error: ${error.message}`);
  }
};
