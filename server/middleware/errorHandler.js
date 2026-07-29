import ApiError from '../utils/ApiError.js';
import env from '../config/env.js';

/**
 * Global Error Handler Middleware
 *
 * Express recognizes this as an error handler because it has 4 parameters.
 * All errors thrown/nexted in the app funnel through here.
 *
 * Handles:
 *  - ApiError (our custom errors)
 *  - Mongoose CastError (invalid ObjectId)
 *  - Mongoose duplicate key (code 11000)
 *  - Mongoose ValidationError (schema validation failures)
 *  - JWT errors (invalid token, expired token)
 *  - Unknown errors (fallback 500)
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.stack = err.stack;

  // Log error in development for debugging
  if (env.NODE_ENV === 'development') {
    console.error('❌ Error:', err);
  }

  // ─── Mongoose: Invalid ObjectId (CastError) ───
  if (err.name === 'CastError') {
    const message = `Resource not found. Invalid ID: ${err.value}`;
    error = new ApiError(400, message);
  }

  // ─── Mongoose: Duplicate Key (unique constraint violation) ───
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate value for field '${field}'. This ${field} is already taken.`;
    error = new ApiError(409, message);
  }

  // ─── Mongoose: Validation Error (required fields, enum, min/max, etc.) ───
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    const message = `Validation failed: ${messages.join('. ')}`;
    error = new ApiError(400, message);
  }

  // ─── JWT: Invalid Token ───
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token. Please log in again.';
    error = new ApiError(401, message);
  }

  // ─── JWT: Expired Token ───
  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired. Please log in again.';
    error = new ApiError(401, message);
  }

  // ─── Send Response ───
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
    // Include stack trace only in development
    ...(env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};

export default errorHandler;
