// middleware/auth.js
// JWT authentication & role-based authorisation middleware

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * protect - Verifies the JWT Bearer token in the Authorization header.
 * On success, attaches the full user document (without password) to req.user.
 * Returns 401 if the token is missing, malformed, or invalid.
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Extract token from "Authorization: Bearer <token>" header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorised. No token provided.' });
    }

    // Verify the token signature and expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user from the database (exclude password)
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Not authorised. User no longer exists.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorised. Token is invalid or expired.' });
  }
};

/**
 * adminOnly - Ensures the authenticated user holds the 'admin' role.
 * Must be used AFTER the protect middleware (requires req.user to be set).
 * Returns 403 if the user is not an admin.
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied. Admins only.' });
};

module.exports = { protect, adminOnly };
