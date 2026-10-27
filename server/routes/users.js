// routes/users.js
// User profile and activity routes

const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getUserActivity } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// GET /api/users/me            — get current user profile with feedback & comments
router.get('/me', protect, getProfile);

// PUT /api/users/me            — update name / bio
router.put('/me', protect, updateProfile);

// GET /api/users/me/activity   — recent feedback and comments for current user
router.get('/me/activity', protect, getUserActivity);

module.exports = router;
