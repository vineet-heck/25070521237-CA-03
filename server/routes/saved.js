// routes/saved.js
// Routes for saving/bookmarking feedback and bug items

const express = require('express');
const router = express.Router();
const { getSavedItems, toggleSave, checkSaved } = require('../controllers/savedController');
const { protect } = require('../middleware/auth');

// GET  /api/saved          — list all saved items for the current user
router.get('/', protect, getSavedItems);

// POST /api/saved/toggle   — save or unsave an item
router.post('/toggle', protect, toggleSave);

// GET  /api/saved/check    — check if a specific item is saved
router.get('/check', protect, checkSaved);

module.exports = router;
