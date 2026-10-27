// routes/bugs.js
// Bug report CRUD routes

const express = require('express');
const router = express.Router();
const {
  getAllBugs,
  getBugById,
  createBug,
  updateBug,
  deleteBug,
} = require('../controllers/bugController');
const { protect } = require('../middleware/auth');

// GET /api/bugs          — list all bug reports (public)
router.get('/', getAllBugs);

// GET /api/bugs/:id      — get a single bug report (public)
router.get('/:id', getBugById);

// POST /api/bugs         — submit a bug report (auth required)
router.post('/', protect, createBug);

// PUT /api/bugs/:id      — update a bug report (auth + ownership/admin)
router.put('/:id', protect, updateBug);

// DELETE /api/bugs/:id   — delete a bug report (auth + ownership/admin)
router.delete('/:id', protect, deleteBug);

module.exports = router;
