// models/SavedItem.js
// Mongoose schema for items saved/bookmarked by users

const mongoose = require('mongoose');

const savedItemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
  },
  itemType: {
    type: String,
    enum: ['feedback', 'bug'],
    required: [true, 'Item type is required'],
  },
  // Generic reference — resolved manually in the controller based on itemType
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Item ID is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound unique index to prevent a user from saving the same item twice
savedItemSchema.index({ user: 1, itemId: 1, itemType: 1 }, { unique: true });

module.exports = mongoose.model('SavedItem', savedItemSchema);
