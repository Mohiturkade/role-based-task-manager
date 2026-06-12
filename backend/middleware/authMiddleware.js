const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer'))
    token = req.headers.authorization.split(' ')[1];

  if (!token)
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ success: false, message: 'User not found' });
    if (user.status === 'Inactive')
      return res.status(403).json({ success: false, message: 'Account is inactive' });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role === 'Admin') return next();
  res.status(403).json({ success: false, message: 'Access denied: Admins only' });
};

module.exports = { protect, adminOnly };