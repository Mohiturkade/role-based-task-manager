const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser, updateUserStatus, getAllTasks, deleteAnyTask, getStats } =
  require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/status', updateUserStatus);
router.get('/tasks', getAllTasks);
router.delete('/tasks/:id', deleteAnyTask);

module.exports = router;