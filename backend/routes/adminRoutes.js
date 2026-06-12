const express = require("express");

const {
  getAllUsers,
  deleteUser,
  updateUserStatus,
  getAllTasks,
  deleteAnyTask,
  getActivityLogs,
  getAnalytics,
} = require("../controllers/adminController");

const authMiddleware =
require("../middleware/authMiddleware");

const roleMiddleware =
require("../middleware/roleMiddleware");

const router = express.Router();

// Admin only
router.use(authMiddleware);
router.use(roleMiddleware("Admin"));

router.get("/users", getAllUsers);

router.delete("/users/:id", deleteUser);

router.patch(
  "/users/:id/status",
  updateUserStatus
);

router.get("/tasks", getAllTasks);

router.delete(
  "/tasks/:id",
  deleteAnyTask
);

router.get("/logs", getActivityLogs);

router.get("/analytics", getAnalytics);

module.exports = router;