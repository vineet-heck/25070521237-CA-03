// controllers/userController.js
// Handles user profile viewing, editing, and activity retrieval

const User = require('../models/User');
const Feedback = require('../models/Feedback');
const Comment = require('../models/Comment');

/**
 * GET /api/users/me
 * Returns the authenticated user's profile along with their submitted feedback and comments.
 */
const getProfile = async (req, res) => {
  try {
    const [feedbackItems, comments] = await Promise.all([
      Feedback.find({ author: req.user._id })
        .sort({ createdAt: -1 })
        .select('title category status voteCount createdAt'),
      Comment.find({ author: req.user._id })
        .sort({ createdAt: -1 })
        .populate('feedback', 'title')
        .select('text feedback createdAt'),
    ]);

    res.status(200).json({
      user: req.user,
      feedback: feedbackItems,
      comments,
    });
  } catch (error) {
    console.error('getProfile error:', error);
    res.status(500).json({ message: 'Server error fetching profile.' });
  }
};

/**
 * PUT /api/users/me
 * Updates the authenticated user's name and/or bio.
 * Email and role cannot be changed through this endpoint.
 */
const updateProfile = async (req, res) => {
  try {
    const { name, bio } = req.body;

    if (name !== undefined && (!name || !name.trim())) {
      return res.status(400).json({ message: 'Name cannot be empty.' });
    }

    if (bio !== undefined && bio.length > 500) {
      return res.status(400).json({ message: 'Bio cannot exceed 500 characters.' });
    }

    const user = await User.findById(req.user._id);

    if (name !== undefined) user.name = name.trim();
    if (bio !== undefined) user.bio = bio.trim();

    await user.save();

    res.status(200).json({ message: 'Profile updated successfully.', user });
  } catch (error) {
    console.error('updateProfile error:', error);
    res.status(500).json({ message: 'Server error updating profile.' });
  }
};

/**
 * GET /api/users/me/activity
 * Returns the authenticated user's last 10 feedback submissions and last 10 comments.
 */
const getUserActivity = async (req, res) => {
  try {
    const [recentFeedback, recentComments] = await Promise.all([
      Feedback.find({ author: req.user._id })
        .sort({ createdAt: -1 })
        .limit(10)
        .select('title category status voteCount createdAt'),

      Comment.find({ author: req.user._id })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('feedback', 'title')
        .select('text feedback createdAt'),
    ]);

    res.status(200).json({ recentFeedback, recentComments });
  } catch (error) {
    console.error('getUserActivity error:', error);
    res.status(500).json({ message: 'Server error fetching user activity.' });
  }
};

module.exports = { getProfile, updateProfile, getUserActivity };
