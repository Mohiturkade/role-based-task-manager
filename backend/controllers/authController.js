const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { logActivity } = require('../middleware/activityLogger');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ success: false, message: 'Email already registered' });

    let assignedRole = 'User';
    if (role === 'Admin') {
      const adminExists = await User.findOne({ role: 'Admin' });
      if (!adminExists) assignedRole = 'Admin';
    }

    const user = await User.create({ name, email, password, role: assignedRole });
    await logActivity(user._id, 'LOGIN', `${user.name} registered`, {}, req);
    res.status(201).json({ success: true, token: generateToken(user._id), user });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

  res.status(500).json({
    success: false,
    message: error.message,
  });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    if (user.status === 'Inactive')
      return res.status(403).json({ success: false, message: 'Account deactivated' });
    await logActivity(user._id, 'LOGIN', `${user.name} logged in`, {}, req);
    res.json({ success: true, token: generateToken(user._id), user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/auth/me
const getMe = (req, res) => res.json({ success: true, user: req.user });

module.exports = { register, login, getMe };
