// routes/dashboard.js
// Dashboard summary route

const express = require('express');
const router = express.Router();
const { getSummary } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

// GET /api/dashboard/summary — aggregated platform stats
router.get('/summary', protect, getSummary);

module.exports = router;
