import { check } from 'express-validator';

export const validateReview = [
  check('ratings.uiux')
    .notEmpty()
    .withMessage('UI/UX rating is required')
    .isFloat({ min: 1, max: 5 })
    .withMessage('UI/UX rating must be between 1 and 5'),
  check('ratings.codeQuality')
    .notEmpty()
    .withMessage('Code Quality rating is required')
    .isFloat({ min: 1, max: 5 })
    .withMessage('Code Quality rating must be between 1 and 5'),
  check('ratings.idea')
    .notEmpty()
    .withMessage('Idea rating is required')
    .isFloat({ min: 1, max: 5 })
    .withMessage('Idea rating must be between 1 and 5'),
  check('pros')
    .notEmpty()
    .withMessage('Pros are required')
    .isLength({ max: 500 })
    .withMessage('Pros must not exceed 500 characters'),
  check('cons')
    .notEmpty()
    .withMessage('Cons are required')
    .isLength({ max: 500 })
    .withMessage('Cons must not exceed 500 characters'),
  check('suggestion')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Suggestion must not exceed 500 characters'),
];
