import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import env from '../config/env.js';

/**
 * Protect Middleware
 *
 * Ensures the request is authenticated.
 * Extracts JWT from:
 *   1. HTTP-only cookie (`req.cookies.token`)
 *   2. Authorization header (`Bearer <token>`)
 *
 * If valid, attaches the full user document to `req.user`.
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check cookie first (primary method)
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // Fallback: check Authorization header
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // No token found anywhere
  if (!token) {
    throw new ApiError(401, 'Not authorized. Please log in.');
  }

  // Verify token and extract payload
  const decoded = jwt.verify(token, env.JWT_SECRET);

  // Find the user — if they were deleted after the token was issued, deny access
  const user = await User.findById(decoded.id);
  if (!user) {
    throw new ApiError(401, 'User belonging to this token no longer exists.');
  }

  // Attach user to request for downstream middleware/controllers
  req.user = user;
  next();
});

/**
 * Role-Based Authorization Middleware
 *
 * Used after `protect`. Restricts access to specific roles.
 *
 * Usage:
 *   router.delete('/users/:id', protect, authorize('admin'), deleteUser);
 *
 * @param  {...string} roles - Allowed roles (e.g., 'admin', 'user')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `Role '${req.user.role}' is not authorized to access this resource.`
      );
    }
    next();
  };
};
