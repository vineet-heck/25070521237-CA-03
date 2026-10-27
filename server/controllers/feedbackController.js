// controllers/feedbackController.js
// Handles CRUD, voting, and comments for feedback items

const Feedback = require('../models/Feedback');
const Comment = require('../models/Comment');

/**
 * GET /api/feedback
 * Returns all feedback items with optional filtering and sorting.
 * Query params: search, category, status, sort (newest|oldest|most-voted)
 */
const getAllFeedback = async (req, res) => {
  try {
    const { search, category, status, sort } = req.query;
    const filter = {};

    // Text search across title and description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) filter.category = category;
    if (status) filter.status = status;

    // Determine sort order
    let sortOption = { createdAt: -1 }; // default: newest
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'most-voted') sortOption = { voteCount: -1 };

    const feedbackItems = await Feedback.find(filter)
      .sort(sortOption)
      .populate('author', 'name');

    res.status(200).json({ count: feedbackItems.length, feedback: feedbackItems });
  } catch (error) {
    console.error('getAllFeedback error:', error);
    res.status(500).json({ message: 'Server error fetching feedback.' });
  }
};

/**
 * GET /api/feedback/:id
 * Returns a single feedback item by ID with author details.
 */
const getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id).populate('author', 'name email');
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback item not found.' });
    }
    res.status(200).json({ feedback });
  } catch (error) {
    console.error('getFeedbackById error:', error);
    res.status(500).json({ message: 'Server error fetching feedback item.' });
  }
};

/**
 * POST /api/feedback
 * Creates a new feedback item associated with the authenticated user.
 */
const createFeedback = async (req, res) => {
  try {
    const { title, description, category, tags } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Title, description, and category are required.' });
    }

    const feedback = await Feedback.create({
      title,
      description,
      category,
      tags: tags || [],
      author: req.user._id,
    });

    res.status(201).json({ message: 'Feedback submitted successfully.', feedback });
  } catch (error) {
    console.error('createFeedback error:', error);
    res.status(500).json({ message: 'Server error creating feedback.' });
  }
};

/**
 * PUT /api/feedback/:id
 * Updates an existing feedback item.
 * Authors can update title/description/category/tags.
 * Admins can additionally update the status field.
 */
const updateFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback item not found.' });
    }

    const isAuthor = feedback.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ message: 'Not authorised to update this feedback.' });
    }

    // Fields any author or admin can update
    if (req.body.title !== undefined) feedback.title = req.body.title;
    if (req.body.description !== undefined) feedback.description = req.body.description;
    if (req.body.category !== undefined) feedback.category = req.body.category;
    if (req.body.tags !== undefined) feedback.tags = req.body.tags;

    // Only admins can change the status
    if (isAdmin && req.body.status !== undefined) {
      feedback.status = req.body.status;
    }

    await feedback.save();
    res.status(200).json({ message: 'Feedback updated successfully.', feedback });
  } catch (error) {
    console.error('updateFeedback error:', error);
    res.status(500).json({ message: 'Server error updating feedback.' });
  }
};

/**
 * DELETE /api/feedback/:id
 * Deletes a feedback item. Only the original author or an admin may delete.
 */
const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback item not found.' });
    }

    const isAuthor = feedback.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ message: 'Not authorised to delete this feedback.' });
    }

    await feedback.deleteOne();

    // Also remove associated comments
    await Comment.deleteMany({ feedback: req.params.id });

    res.status(200).json({ message: 'Feedback deleted successfully.' });
  } catch (error) {
    console.error('deleteFeedback error:', error);
    res.status(500).json({ message: 'Server error deleting feedback.' });
  }
};

/**
 * POST /api/feedback/:id/vote
 * Toggles a vote for the authenticated user on a feedback item.
 * If already voted → removes the vote. Otherwise → adds the vote.
 */
const voteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback item not found.' });
    }

    const userId = req.user._id.toString();
    const hasVoted = feedback.votes.some((id) => id.toString() === userId);

    if (hasVoted) {
      // Remove vote
      feedback.votes = feedback.votes.filter((id) => id.toString() !== userId);
      feedback.voteCount = Math.max(0, feedback.voteCount - 1);
    } else {
      // Add vote
      feedback.votes.push(req.user._id);
      feedback.voteCount += 1;
    }

    await feedback.save();

    res.status(200).json({
      message: hasVoted ? 'Vote removed.' : 'Vote added.',
      voted: !hasVoted,
      voteCount: feedback.voteCount,
    });
  } catch (error) {
    console.error('voteFeedback error:', error);
    res.status(500).json({ message: 'Server error toggling vote.' });
  }
};

/**
 * POST /api/feedback/:id/comments
 * Adds a comment to a feedback item. Returns the populated comment.
 */
const addComment = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback item not found.' });
    }

    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text is required.' });
    }

    const comment = await Comment.create({
      feedback: req.params.id,
      text: text.trim(),
      author: req.user._id,
    });

    // Populate author details before returning
    await comment.populate('author', 'name');

    res.status(201).json({ message: 'Comment added.', comment });
  } catch (error) {
    console.error('addComment error:', error);
    res.status(500).json({ message: 'Server error adding comment.' });
  }
};

/**
 * GET /api/feedback/:id/comments
 * Returns all comments for a specific feedback item, with author names.
 */
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ feedback: req.params.id })
      .sort({ createdAt: 1 })
      .populate('author', 'name');

    res.status(200).json({ count: comments.length, comments });
  } catch (error) {
    console.error('getComments error:', error);
    res.status(500).json({ message: 'Server error fetching comments.' });
  }
};

module.exports = {
  getAllFeedback,
  getFeedbackById,
  createFeedback,
  updateFeedback,
  deleteFeedback,
  voteFeedback,
  addComment,
  getComments,
};
