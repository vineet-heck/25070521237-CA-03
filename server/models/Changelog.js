// models/Changelog.js
// Mongoose schema for product changelog / release notes

const mongoose = require('mongoose');

const changelogSchema = new mongoose.Schema({
  version: {
    type: String,
    required: [true, 'Version is required'],
    trim: true,
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  summary: {
    type: String,
    required: [true, 'Summary is required'],
    maxlength: [500, 'Summary cannot exceed 500 characters'],
  },
  details: {
    type: String,
    required: [true, 'Details are required'],
    maxlength: [5000, 'Details cannot exceed 5000 characters'],
  },
  releaseDate: {
    type: Date,
    required: [true, 'Release date is required'],
  },
  category: {
    type: String,
    enum: ['Feature', 'Improvement', 'Bug Fix', 'Performance', 'Security', 'Breaking Change'],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Flag to identify seeded demo data
  isSeeded: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Changelog', changelogSchema);
