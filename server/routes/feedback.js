// routes/feedback.js
// Feedback CRUD, voting, and comments routes

const express = require('express');
const router = express.Router();
const {
  getAllFeedback,
  getFeedbackById,
  createFeedback,
  updateFeedback,
  deleteFeedback,
  voteFeedback,
  addComment,
  getComments,
} = require('../controllers/feedbackController');
const { protect } = require('../middleware/auth');

// GET /api/feedback             — list all feedback (public)
router.get('/', getAllFeedback);

// GET /api/feedback/:id         — get a single feedback item (public)
router.get('/:id', getFeedbackById);

// POST /api/feedback            — submit new feedback (auth required)
router.post('/', protect, createFeedback);

// PUT /api/feedback/:id         — edit feedback (auth + ownership/admin)
router.put('/:id', protect, updateFeedback);

// DELETE /api/feedback/:id      — remove feedback (auth + ownership/admin)
router.delete('/:id', protect, deleteFeedback);

// POST /api/feedback/:id/vote   — toggle upvote (auth required)
router.post('/:id/vote', protect, voteFeedback);

// POST /api/feedback/:id/comments — add a comment (auth required)
router.post('/:id/comments', protect, addComment);

// GET  /api/feedback/:id/comments — list comments for a feedback item (public)
router.get('/:id/comments', getComments);

module.exports = router;
