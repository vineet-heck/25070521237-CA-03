// controllers/savedController.js
// Handles saving / bookmarking feedback and bug report items for users

const SavedItem = require('../models/SavedItem');
const Feedback = require('../models/Feedback');
const BugReport = require('../models/BugReport');

/**
 * GET /api/saved
 * Returns all saved items for the authenticated user.
 * Manually resolves the itemId reference based on itemType.
 */
const getSavedItems = async (req, res) => {
  try {
    const savedItems = await SavedItem.find({ user: req.user._id }).sort({ createdAt: -1 });

    // Manually populate based on itemType
    const populated = await Promise.all(
      savedItems.map(async (item) => {
        let doc = null;
        if (item.itemType === 'feedback') {
          doc = await Feedback.findById(item.itemId).populate('author', 'name');
        } else if (item.itemType === 'bug') {
          doc = await BugReport.findById(item.itemId).populate('reporter', 'name');
        }
        return {
          savedId: item._id,
          itemType: item.itemType,
          savedAt: item.createdAt,
          item: doc,
        };
      })
    );

    // Filter out items whose referenced document no longer exists
    const valid = populated.filter((p) => p.item !== null);

    res.status(200).json({ count: valid.length, savedItems: valid });
  } catch (error) {
    console.error('getSavedItems error:', error);
    res.status(500).json({ message: 'Server error fetching saved items.' });
  }
};

/**
 * POST /api/saved/toggle
 * Toggles the saved state for an item.
 * Body: { itemId, itemType }
 * Returns { saved: true|false }
 */
const toggleSave = async (req, res) => {
  try {
    const { itemId, itemType } = req.body;

    if (!itemId || !itemType) {
      return res.status(400).json({ message: 'itemId and itemType are required.' });
    }

    if (!['feedback', 'bug'].includes(itemType)) {
      return res.status(400).json({ message: "itemType must be 'feedback' or 'bug'." });
    }

    const existing = await SavedItem.findOne({
      user: req.user._id,
      itemId,
      itemType,
    });

    if (existing) {
      // Already saved — remove it
      await existing.deleteOne();
      return res.status(200).json({ saved: false, message: 'Item removed from saved.' });
    }

    // Not saved yet — create it
    await SavedItem.create({ user: req.user._id, itemId, itemType });
    res.status(201).json({ saved: true, message: 'Item saved successfully.' });
  } catch (error) {
    // Handle duplicate key error gracefully (race condition)
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Item is already saved.' });
    }
    console.error('toggleSave error:', error);
    res.status(500).json({ message: 'Server error toggling saved state.' });
  }
};

/**
 * GET /api/saved/check
 * Checks if a specific item is saved by the authenticated user.
 * Query params: itemId, itemType
 */
const checkSaved = async (req, res) => {
  try {
    const { itemId, itemType } = req.query;

    if (!itemId || !itemType) {
      return res.status(400).json({ message: 'itemId and itemType query params are required.' });
    }

    const saved = await SavedItem.findOne({ user: req.user._id, itemId, itemType });

    res.status(200).json({ saved: !!saved });
  } catch (error) {
    console.error('checkSaved error:', error);
    res.status(500).json({ message: 'Server error checking saved state.' });
  }
};

module.exports = { getSavedItems, toggleSave, checkSaved };
