import validator from 'validator';

/**
 * Auth Validators
 *
 * Middleware functions that validate request body fields
 * before they reach the controller. Each validator pushes
 * error objects onto `req.validationErrors` (an array).
 *
 * The `validate` middleware (middleware/validate.js) runs
 * after these and returns 400 if any errors were collected.
 */

/**
 * Validate registration input
 * Checks: name (2-50 chars), email (valid format), password (min 6 chars)
 */
export const validateRegister = (req, res, next) => {
  const errors = [];
  const { name, email, password } = req.body;

  // Name validation
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Name is required' });
  } else if (name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters' });
  } else if (name.trim().length > 50) {
    errors.push({ field: 'name', message: 'Name cannot exceed 50 characters' });
  }

  // Email validation
  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!validator.isEmail(email)) {
    errors.push({ field: 'email', message: 'Please provide a valid email address' });
  }

  // Password validation
  if (!password || typeof password !== 'string') {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters' });
  }

  // Attach errors array to request for the validate middleware to check
  req.validationErrors = errors;
  next();
};

/**
 * Validate login input
 * Checks: email (present + valid), password (present)
 */
export const validateLogin = (req, res, next) => {
  const errors = [];
  const { email, password } = req.body;

  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!validator.isEmail(email)) {
    errors.push({ field: 'email', message: 'Please provide a valid email address' });
  }

  if (!password || typeof password !== 'string') {
    errors.push({ field: 'password', message: 'Password is required' });
  }

  req.validationErrors = errors;
  next();
};
