// controllers/bugController.js
// Handles CRUD operations for bug reports

const BugReport = require('../models/BugReport');

/**
 * GET /api/bugs
 * Returns all bug reports with optional filtering and sorting.
 * Query params: search, severity, status, sort (newest|oldest)
 */
const getAllBugs = async (req, res) => {
  try {
    const { search, severity, status, sort } = req.query;
    const filter = {};

    // Text search across title and description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (severity) filter.severity = severity;
    if (status) filter.status = status;

    let sortOption = { createdAt: -1 }; // default: newest
    if (sort === 'oldest') sortOption = { createdAt: 1 };

    const bugs = await BugReport.find(filter)
      .sort(sortOption)
      .populate('reporter', 'name');

    res.status(200).json({ count: bugs.length, bugs });
  } catch (error) {
    console.error('getAllBugs error:', error);
    res.status(500).json({ message: 'Server error fetching bug reports.' });
  }
};

/**
 * GET /api/bugs/:id
 * Returns a single bug report by ID with reporter details.
 */
const getBugById = async (req, res) => {
  try {
    const bug = await BugReport.findById(req.params.id).populate('reporter', 'name email');
    if (!bug) {
      return res.status(404).json({ message: 'Bug report not found.' });
    }
    res.status(200).json({ bug });
  } catch (error) {
    console.error('getBugById error:', error);
    res.status(500).json({ message: 'Server error fetching bug report.' });
  }
};

/**
 * POST /api/bugs
 * Creates a new bug report associated with the authenticated user.
 */
const createBug = async (req, res) => {
  try {
    const { title, description, severity, stepsToReproduce, environment } = req.body;

    if (!title || !description || !severity) {
      return res.status(400).json({ message: 'Title, description, and severity are required.' });
    }

    const bug = await BugReport.create({
      title,
      description,
      severity,
      stepsToReproduce: stepsToReproduce || '',
      environment: environment || '',
      reporter: req.user._id,
    });

    res.status(201).json({ message: 'Bug report submitted successfully.', bug });
  } catch (error) {
    console.error('createBug error:', error);
    res.status(500).json({ message: 'Server error creating bug report.' });
  }
};

/**
 * PUT /api/bugs/:id
 * Updates a bug report.
 * Reporters can update their own bugs (title/description/severity/steps/environment).
 * Admins can additionally update the status field.
 */
const updateBug = async (req, res) => {
  try {
    const bug = await BugReport.findById(req.params.id);
    if (!bug) {
      return res.status(404).json({ message: 'Bug report not found.' });
    }

    const isReporter = bug.reporter.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isReporter && !isAdmin) {
      return res.status(403).json({ message: 'Not authorised to update this bug report.' });
    }

    // Fields any reporter or admin can update
    if (req.body.title !== undefined) bug.title = req.body.title;
    if (req.body.description !== undefined) bug.description = req.body.description;
    if (req.body.severity !== undefined) bug.severity = req.body.severity;
    if (req.body.stepsToReproduce !== undefined) bug.stepsToReproduce = req.body.stepsToReproduce;
    if (req.body.environment !== undefined) bug.environment = req.body.environment;

    // Only admins can change the status
    if (isAdmin && req.body.status !== undefined) {
      bug.status = req.body.status;
    }

    await bug.save();
    res.status(200).json({ message: 'Bug report updated successfully.', bug });
  } catch (error) {
    console.error('updateBug error:', error);
    res.status(500).json({ message: 'Server error updating bug report.' });
  }
};

/**
 * DELETE /api/bugs/:id
 * Deletes a bug report. Only the original reporter or an admin may delete.
 */
const deleteBug = async (req, res) => {
  try {
    const bug = await BugReport.findById(req.params.id);
    if (!bug) {
      return res.status(404).json({ message: 'Bug report not found.' });
    }

    const isReporter = bug.reporter.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isReporter && !isAdmin) {
      return res.status(403).json({ message: 'Not authorised to delete this bug report.' });
    }

    await bug.deleteOne();
    res.status(200).json({ message: 'Bug report deleted successfully.' });
  } catch (error) {
    console.error('deleteBug error:', error);
    res.status(500).json({ message: 'Server error deleting bug report.' });
  }
};

module.exports = { getAllBugs, getBugById, createBug, updateBug, deleteBug };
