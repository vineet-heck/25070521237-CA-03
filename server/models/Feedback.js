// models/Feedback.js
// Mongoose schema for product feedback submissions

const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Feature Request',
      'UI/UX Improvement',
      'Performance',
      'Bug Fix Request',
      'Integration',
      'Documentation',
      'Accessibility',
      'Other',
    ],
  },
  status: {
    type: String,
    enum: ['Planned', 'Under Review', 'In Progress', 'Completed', 'Declined'],
    default: 'Under Review',
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required'],
  },
  // Array of user ObjectIds who have voted on this feedback
  votes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  voteCount: {
    type: Number,
    default: 0,
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  // Flag to identify seeded demo data
  isSeeded: {
    type: Boolean,
    default: false,
  },
});

// Pre-save hook: update the updatedAt timestamp
feedbackSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Feedback', feedbackSchema);
