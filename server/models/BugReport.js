// models/BugReport.js
// Mongoose schema for bug reports submitted by users

const mongoose = require('mongoose');

const bugReportSchema = new mongoose.Schema({
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
  severity: {
    type: String,
    required: [true, 'Severity is required'],
    enum: ['Critical', 'High', 'Medium', 'Low'],
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved', 'Closed', 'Wont Fix'],
    default: 'Open',
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Reporter is required'],
  },
  stepsToReproduce: {
    type: String,
    default: '',
  },
  environment: {
    type: String,
    default: '',
  },
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
bugReportSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('BugReport', bugReportSchema);
