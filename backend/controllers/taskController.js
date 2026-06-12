// // Create task
// const createTask = async (req, res) => {
//   try {
//     const task = await Task.create({
//       title: req.body.title,
//       description: req.body.description,
//       createdBy: req.user.id,
//     });

//     res.status(201).json(task);
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };


// // Get logged-in users task
// const getMyTasks = async (req, res) => {
//   try {
//     const tasks = await Task.find({
//       createdBy: req.user.id,
//     });

//     res.status(200).json(tasks);
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };


// // Update own task
// const updateTask = async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id);

//     if (!task) {
//       return res.status(404).json({
//         message: "Task not found",
//       });
//     }

//     if (task.createdBy.toString() !== req.user.id) {
//       return res.status(403).json({
//         message: "Not authorized",
//       });
//     }

//     const updatedTask = await Task.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );

//     res.status(200).json(updatedTask);
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };


// // Delete own task
// const deleteTask = async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id);

//     if (!task) {
//       return res.status(404).json({
//         message: "Task not found",
//       });
//     }

//     if (task.createdBy.toString() !== req.user.id) {
//       return res.status(403).json({
//         message: "Not authorized",
//       });
//     }

//     await Task.findByIdAndDelete(req.params.id);

//     res.status(200).json({
//       message: "Task deleted successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// module.exports = {
//   createTask,
//   getMyTasks,
//   updateTask,
//   deleteTask,
// };

const Task = require('../models/Task');
const { logActivity } = require('../middleware/activityLogger');

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: tasks.length, tasks });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    const task = await Task.create({ title, description, status, priority, dueDate, user: req.user._id });
    await logActivity(req.user._id, 'TASK_CREATED', `Task "${title}" created`, { taskId: task._id }, req);
    res.status(201).json({ success: true, task });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    const { title, description, status, priority, dueDate } = req.body;
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    await task.save();
    await logActivity(req.user._id, 'TASK_UPDATED', `Task "${task.title}" updated`, { taskId: task._id }, req);
    res.json({ success: true, task });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    await task.deleteOne();
    await logActivity(req.user._id, 'TASK_DELETED', `Task "${task.title}" deleted`, { taskId: req.params.id }, req);
    res.json({ success: true, message: 'Task deleted' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };