// routes/changelog.js
// Changelog routes — public reads, admin-only writes

const express = require('express');
const router = express.Router();
const {
  getAllChangelog,
  getChangelogById,
  createChangelog,
  updateChangelog,
  deleteChangelog,
} = require('../controllers/changelogController');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/changelog          — list all entries (public)
router.get('/', getAllChangelog);

// GET /api/changelog/:id      — get a single entry (public)
router.get('/:id', getChangelogById);

// POST /api/changelog         — create entry (admin only)
router.post('/', protect, adminOnly, createChangelog);

// PUT /api/changelog/:id      — update entry (admin only)
router.put('/:id', protect, adminOnly, updateChangelog);

// DELETE /api/changelog/:id   — delete entry (admin only)
router.delete('/:id', protect, adminOnly, deleteChangelog);

module.exports = router;
