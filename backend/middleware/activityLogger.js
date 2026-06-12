const ActivityLog = require('../models/ActivityLog');

const logActivity = async (userId, action, description, metadata = {}, req = null) => {
  try {
    const ipAddress = req
      ? req.headers['x-forwarded-for'] || req.socket?.remoteAddress || ''
      : '';
    await ActivityLog.create({ user: userId, action, description, metadata, ipAddress });
  } catch (error) {
    console.error('Activity logging failed:', error.message);
  }
};

module.exports = { logActivity };