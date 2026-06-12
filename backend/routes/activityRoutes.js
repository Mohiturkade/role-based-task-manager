const express = require('express');
const router = express.Router();
const { getLogs } = require('../controllers/activityController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/', getLogs);

module.exports = router;