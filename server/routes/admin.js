// routes/admin.js
// Admin-only routes — all protected by protect + adminOnly middleware

const express = require('express');
const router = express.Router();
const {
  getStats,
  getAllUsers,
  updateFeedbackStatus,
  updateBugStatus,
  getRoadmap,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

// Apply protect + adminOnly to every route in this file
router.use(protect, adminOnly);

// GET  /api/admin/stats                  — comprehensive platform statistics
router.get('/stats', getStats);

// GET  /api/admin/users                  — list all users
router.get('/users', getAllUsers);

// PUT  /api/admin/feedback/:id/status    — update feedback status
router.put('/feedback/:id/status', updateFeedbackStatus);

// PUT  /api/admin/bugs/:id/status        — update bug status
router.put('/bugs/:id/status', updateBugStatus);

// GET  /api/admin/roadmap                — roadmap management view
router.get('/roadmap', getRoadmap);

module.exports = router;
