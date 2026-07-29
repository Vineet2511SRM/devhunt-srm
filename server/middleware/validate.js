/**
 * Validation Runner Middleware
 *
 * Runs AFTER a specific validator (e.g., validateRegister).
 * Checks if `req.validationErrors` has any entries.
 * If yes → returns a structured 400 response with all field errors.
 * If no  → calls next() to proceed to the controller.
 *
 * Usage in routes:
 *   router.post('/register', validateRegister, validate, authController.register);
 */
const validate = (req, res, next) => {
  const errors = req.validationErrors;

  if (errors && errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      errors: errors, // Array of { field, message } objects
    });
  }

  next();
};

export default validate;
