// controllers/changelogController.js
// Handles CRUD operations for product changelog entries (admin-managed)

const Changelog = require('../models/Changelog');

/**
 * GET /api/changelog
 * Returns all changelog entries sorted by release date (newest first).
 * Populates the author's name.
 */
const getAllChangelog = async (req, res) => {
  try {
    const entries = await Changelog.find()
      .sort({ releaseDate: -1 })
      .populate('author', 'name');

    res.status(200).json({ count: entries.length, changelog: entries });
  } catch (error) {
    console.error('getAllChangelog error:', error);
    res.status(500).json({ message: 'Server error fetching changelog.' });
  }
};

/**
 * GET /api/changelog/:id
 * Returns a single changelog entry by ID.
 */
const getChangelogById = async (req, res) => {
  try {
    const entry = await Changelog.findById(req.params.id).populate('author', 'name');
    if (!entry) {
      return res.status(404).json({ message: 'Changelog entry not found.' });
    }
    res.status(200).json({ changelog: entry });
  } catch (error) {
    console.error('getChangelogById error:', error);
    res.status(500).json({ message: 'Server error fetching changelog entry.' });
  }
};

/**
 * POST /api/changelog  [Admin only — enforced by route middleware]
 * Creates a new changelog entry authored by the current admin user.
 */
const createChangelog = async (req, res) => {
  try {
    const { version, title, summary, details, releaseDate, category } = req.body;

    if (!version || !title || !summary || !details || !releaseDate) {
      return res.status(400).json({
        message: 'Version, title, summary, details, and releaseDate are required.',
      });
    }

    const entry = await Changelog.create({
      version,
      title,
      summary,
      details,
      releaseDate: new Date(releaseDate),
      category: category || undefined,
      author: req.user._id,
    });

    res.status(201).json({ message: 'Changelog entry created.', changelog: entry });
  } catch (error) {
    console.error('createChangelog error:', error);
    res.status(500).json({ message: 'Server error creating changelog entry.' });
  }
};

/**
 * PUT /api/changelog/:id  [Admin only]
 * Updates an existing changelog entry.
 */
const updateChangelog = async (req, res) => {
  try {
    const entry = await Changelog.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ message: 'Changelog entry not found.' });
    }

    const fields = ['version', 'title', 'summary', 'details', 'category'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) entry[field] = req.body[field];
    });

    if (req.body.releaseDate !== undefined) {
      entry.releaseDate = new Date(req.body.releaseDate);
    }

    await entry.save();
    res.status(200).json({ message: 'Changelog entry updated.', changelog: entry });
  } catch (error) {
    console.error('updateChangelog error:', error);
    res.status(500).json({ message: 'Server error updating changelog entry.' });
  }
};

/**
 * DELETE /api/changelog/:id  [Admin only]
 * Deletes a changelog entry.
 */
const deleteChangelog = async (req, res) => {
  try {
    const entry = await Changelog.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ message: 'Changelog entry not found.' });
    }

    await entry.deleteOne();
    res.status(200).json({ message: 'Changelog entry deleted.' });
  } catch (error) {
    console.error('deleteChangelog error:', error);
    res.status(500).json({ message: 'Server error deleting changelog entry.' });
  }
};

module.exports = {
  getAllChangelog,
  getChangelogById,
  createChangelog,
  updateChangelog,
  deleteChangelog,
};
