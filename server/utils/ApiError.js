/**
 * Custom API Error class
 * Extends the native Error with HTTP status codes and operational flags.
 *
 * Usage:
 *   throw new ApiError(404, 'Project not found');
 *   throw new ApiError(401, 'Invalid credentials');
 */
class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code (e.g., 400, 401, 404, 500)
   * @param {string} message    - Human-readable error message
   * @param {boolean} isOperational - If true, this is a known/expected error (not a bug)
   */
  constructor(statusCode, message, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Capture stack trace, excluding the constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
