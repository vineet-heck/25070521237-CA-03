// routes/roadmap.js
// Public roadmap route + admin status update

const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const { protect, adminOnly } = require('../middleware/auth');

/**
 * GET /api/roadmap
 * Public route — returns all feedback items grouped by status.
 * Useful for displaying the product roadmap to all visitors.
 */
router.get('/', async (req, res) => {
  try {
    const statuses = ['Planned', 'Under Review', 'In Progress', 'Completed', 'Declined'];

    const roadmap = {};
    await Promise.all(
      statuses.map(async (status) => {
        roadmap[status] = await Feedback.find({ status })
          .sort({ voteCount: -1 })
          .populate('author', 'name')
          .select('title description category voteCount tags createdAt author status');
      })
    );

    res.status(200).json({ roadmap });
  } catch (error) {
    console.error('roadmap GET error:', error);
    res.status(500).json({ message: 'Server error fetching roadmap.' });
  }
});

/**
 * PUT /api/roadmap/:id/status
 * Admin-only — updates a feedback item's status directly from the roadmap board.
 */
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Status is required.' });
    }

    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback item not found.' });
    }

    res.status(200).json({ message: 'Roadmap status updated.', feedback });
  } catch (error) {
    console.error('roadmap PUT error:', error);
    res.status(500).json({ message: 'Server error updating roadmap status.' });
  }
});

module.exports = router;
