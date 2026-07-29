import jwt from 'jsonwebtoken';
import env from '../config/env.js';

/**
 * Generate a signed JWT for a given user ID.
 *
 * @param {string} userId - The MongoDB _id of the user
 * @returns {string} Signed JWT string
 */
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRE,
  });
};

/**
 * Send a standardized token response.
 *
 * - Generates a JWT
 * - Sets it as an HTTP-only cookie (prevents XSS access)
 * - Sends a JSON response with the token and user data
 *
 * @param {Object}   user       - Mongoose user document
 * @param {number}   statusCode - HTTP status code (200, 201, etc.)
 * @param {Object}   res        - Express response object
 */
export const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  // Cookie options
  const cookieOptions = {
    expires: new Date(Date.now() + env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000), // days → ms
    httpOnly: true,   // Cookie cannot be accessed by client-side JavaScript (XSS protection)
    secure: env.NODE_ENV === 'production',  // Only send over HTTPS in production
    sameSite: 'strict',  // CSRF protection
  };

  // Remove password from the user object before sending
  const userResponse = user.toObject();
  delete userResponse.password;

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      token,
      user: userResponse,
    });
};
