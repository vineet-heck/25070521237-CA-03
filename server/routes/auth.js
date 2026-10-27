// routes/auth.js
// Authentication routes: register, login, get current user

const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// POST /api/auth/register — create a new user account
router.post('/register', register);

// POST /api/auth/login — authenticate and receive JWT
router.post('/login', login);

// GET /api/auth/me — get the currently authenticated user
router.get('/me', protect, getMe);

module.exports = router;
