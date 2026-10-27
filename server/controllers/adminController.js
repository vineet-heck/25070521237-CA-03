// controllers/adminController.js
// Admin-only controller for platform-wide management and statistics

const User = require('../models/User');
const Feedback = require('../models/Feedback');
const BugReport = require('../models/BugReport');
const Comment = require('../models/Comment');
const Changelog = require('../models/Changelog');

/**
 * GET /api/admin/stats
 * Returns comprehensive platform statistics for the admin dashboard.
 */
const getStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalFeedback,
      totalBugs,
      totalComments,
      totalChangelogs,
      feedbackByStatus,
      bugsBySeverity,
      bugsByStatus,
      recentActivity,
    ] = await Promise.all([
      User.countDocuments(),
      Feedback.countDocuments(),
      BugReport.countDocuments(),
      Comment.countDocuments(),
      Changelog.countDocuments(),

      // Feedback grouped by status
      Feedback.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),

      // Bugs grouped by severity
      BugReport.aggregate([{ $group: { _id: '$severity', count: { $sum: 1 } } }]),

      // Bugs grouped by status
      BugReport.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),

      // Last 10 feedback submissions for the recent activity feed
      Feedback.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('author', 'name email')
        .select('title category status createdAt'),
    ]);

    // Convert aggregate arrays to objects for easy frontend consumption
    const feedbackStatusMap = {};
    feedbackByStatus.forEach(({ _id, count }) => { feedbackStatusMap[_id] = count; });

    const bugSeverityMap = {};
    bugsBySeverity.forEach(({ _id, count }) => { bugSeverityMap[_id] = count; });

    const bugStatusMap = {};
    bugsByStatus.forEach(({ _id, count }) => { bugStatusMap[_id] = count; });

    res.status(200).json({
      totals: { totalUsers, totalFeedback, totalBugs, totalComments, totalChangelogs },
      feedbackByStatus: feedbackStatusMap,
      bugsBySeverity: bugSeverityMap,
      bugsByStatus: bugStatusMap,
      recentActivity,
    });
  } catch (error) {
    console.error('getStats error:', error);
    res.status(500).json({ message: 'Server error fetching admin stats.' });
  }
};

/**
 * GET /api/admin/users
 * Returns a list of all registered users (passwords excluded).
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).select('-password');
    res.status(200).json({ count: users.length, users });
  } catch (error) {
    console.error('getAllUsers error:', error);
    res.status(500).json({ message: 'Server error fetching users.' });
  }
};

/**
 * PUT /api/admin/feedback/:id/status
 * Allows an admin to update the status of any feedback item.
 */
const updateFeedbackStatus = async (req, res) => {
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

    res.status(200).json({ message: 'Feedback status updated.', feedback });
  } catch (error) {
    console.error('updateFeedbackStatus error:', error);
    res.status(500).json({ message: 'Server error updating feedback status.' });
  }
};

/**
 * PUT /api/admin/bugs/:id/status
 * Allows an admin to update the status of any bug report.
 */
const updateBugStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Status is required.' });
    }

    const bug = await BugReport.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!bug) {
      return res.status(404).json({ message: 'Bug report not found.' });
    }

    res.status(200).json({ message: 'Bug status updated.', bug });
  } catch (error) {
    console.error('updateBugStatus error:', error);
    res.status(500).json({ message: 'Server error updating bug status.' });
  }
};

/**
 * GET /api/admin/roadmap
 * Returns all feedback items grouped by status for roadmap management.
 */
const getRoadmap = async (req, res) => {
  try {
    const statuses = ['Planned', 'Under Review', 'In Progress', 'Completed', 'Declined'];

    const roadmap = {};
    await Promise.all(
      statuses.map(async (status) => {
        roadmap[status] = await Feedback.find({ status })
          .sort({ voteCount: -1 })
          .populate('author', 'name')
          .select('title category voteCount tags createdAt');
      })
    );

    res.status(200).json({ roadmap });
  } catch (error) {
    console.error('getRoadmap error:', error);
    res.status(500).json({ message: 'Server error fetching roadmap.' });
  }
};

module.exports = { getStats, getAllUsers, updateFeedbackStatus, updateBugStatus, getRoadmap };
