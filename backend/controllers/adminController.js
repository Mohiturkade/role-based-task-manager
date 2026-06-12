const User = require('../models/User');
const Task = require('../models/Task');
const { logActivity } = require('../middleware/activityLogger');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString())
      return res.status(400).json({ success: false, message: 'Cannot delete yourself' });
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    await Task.deleteMany({ user: req.params.id });
    await user.deleteOne();
    await logActivity(req.user._id, 'USER_DELETED', `Admin deleted ${user.name}`, {}, req);
    res.json({ success: true, message: 'User deleted' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Active','Inactive'].includes(status))
      return res.status(400).json({ success: false, message: 'Invalid status' });
    if (req.params.id === req.user._id.toString())
      return res.status(400).json({ success: false, message: 'Cannot change your own status' });
    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    await logActivity(req.user._id, 'USER_STATUS_UPDATED', `Status of ${user.name} → ${status}`, {}, req);
    res.json({ success: true, user });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('user','name email role').sort({ createdAt: -1 });
    res.json({ success: true, count: tasks.length, tasks });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const deleteAnyTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    await task.deleteOne();
    await logActivity(req.user._id, 'TASK_DELETED', `Admin deleted task "${task.title}"`, {}, req);
    res.json({ success: true, message: 'Task deleted' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const getStats = async (req, res) => {
  try {
    const [totalUsers, totalTasks, completedTasks, pendingTasks, inProgressTasks] =
      await Promise.all([
        User.countDocuments({ role: 'User' }),
        Task.countDocuments(),
        Task.countDocuments({ status: 'Completed' }),
        Task.countDocuments({ status: 'Pending' }),
        Task.countDocuments({ status: 'In Progress' }),
      ]);
    res.json({ success: true, stats: { totalUsers, totalTasks, completedTasks, pendingTasks, inProgressTasks } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

module.exports = { getAllUsers, deleteUser, updateUserStatus, getAllTasks, deleteAnyTask, getStats };