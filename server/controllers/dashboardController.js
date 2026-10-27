// controllers/dashboardController.js
// Aggregates platform-wide statistics for the dashboard summary view

const Feedback = require('../models/Feedback');
const BugReport = require('../models/BugReport');
const Changelog = require('../models/Changelog');

/**
 * GET /api/dashboard/summary
 * Returns high-level platform metrics:
 * - Total feedback count
 * - Open bugs (Open + In Progress)
 * - Planned feedback items
 * - Completed feedback items
 * - Recent 5 feedback items
 * - Top 5 trending (most voted) feedback items
 * - Recent 3 changelog entries
 * - Roadmap stats (counts by status)
 */
const getSummary = async (req, res) => {
  try {
    // Run all aggregation queries in parallel for performance
    const [
      totalFeedback,
      openBugs,
      plannedItems,
      completedItems,
      recentFeedback,
      trendingFeedback,
      recentChangelog,
      roadmapStats,
    ] = await Promise.all([
      // Total number of feedback submissions
      Feedback.countDocuments(),

      // Bugs currently open or actively worked on
      BugReport.countDocuments({ status: { $in: ['Open', 'In Progress'] } }),

      // Feedback items planned for development
      Feedback.countDocuments({ status: 'Planned' }),

      // Feedback items that have been delivered
      Feedback.countDocuments({ status: 'Completed' }),

      // Most recent 5 feedback submissions
      Feedback.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('author', 'name')
        .select('title category status voteCount createdAt'),

      // Top 5 feedback items by vote count
      Feedback.find()
        .sort({ voteCount: -1 })
        .limit(5)
        .populate('author', 'name')
        .select('title category status voteCount'),

      // Most recent 3 changelog entries
      Changelog.find()
        .sort({ releaseDate: -1 })
        .limit(3)
        .populate('author', 'name')
        .select('version title summary releaseDate category'),

      // Count feedback by each status for the roadmap overview
      Feedback.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
    ]);

    // Convert roadmap aggregate array into a friendly object
    const roadmapBreakdown = {};
    roadmapStats.forEach(({ _id, count }) => {
      roadmapBreakdown[_id] = count;
    });

    res.status(200).json({
      totalFeedback,
      openBugs,
      plannedItems,
      completedItems,
      recentFeedback,
      trendingFeedback,
      recentChangelog,
      roadmapStats: roadmapBreakdown,
    });
  } catch (error) {
    console.error('getSummary error:', error);
    res.status(500).json({ message: 'Server error fetching dashboard summary.' });
  }
};

module.exports = { getSummary };
