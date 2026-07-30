export const validateReview = (req, res, next) => {
  const errors = [];
  const { ratings, pros, cons, suggestion } = req.body;

  if (!ratings || typeof ratings !== 'object') {
    errors.push({ field: 'ratings', message: 'Ratings object is required' });
  } else {
    ['uiux', 'codeQuality', 'idea'].forEach(key => {
      const val = ratings[key];
      if (val === undefined || val === null) {
        errors.push({ field: `ratings.${key}`, message: `${key} rating is required` });
      } else if (typeof val !== 'number' || val < 1 || val > 5) {
        errors.push({ field: `ratings.${key}`, message: `${key} rating must be a number between 1 and 5` });
      }
    });
  }

  if (!pros || typeof pros !== 'string' || pros.trim().length === 0) {
    errors.push({ field: 'pros', message: 'Pros are required' });
  } else if (pros.length > 500) {
    errors.push({ field: 'pros', message: 'Pros must not exceed 500 characters' });
  }

  if (!cons || typeof cons !== 'string' || cons.trim().length === 0) {
    errors.push({ field: 'cons', message: 'Cons are required' });
  } else if (cons.length > 500) {
    errors.push({ field: 'cons', message: 'Cons must not exceed 500 characters' });
  }

  if (suggestion && (typeof suggestion !== 'string' || suggestion.length > 500)) {
    errors.push({ field: 'suggestion', message: 'Suggestion must not exceed 500 characters' });
  }

  req.validationErrors = errors;
  next();
};
