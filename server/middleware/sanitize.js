/**
 * NoSQL Injection Protection Middleware
 * Recursively strips keys beginning with '$' or containing '.' from req.body, req.query, and req.params
 * to prevent MongoDB operator injection attacks.
 */
const sanitizeData = (data) => {
  if (data instanceof Array) {
    for (let i = 0; i < data.length; i++) {
      data[i] = sanitizeData(data[i]);
    }
  } else if (data !== null && typeof data === 'object') {
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        if (key.startsWith('$') || key.includes('.')) {
          delete data[key];
        } else {
          data[key] = sanitizeData(data[key]);
        }
      }
    }
  }
  return data;
};

export const mongoSanitize = (req, res, next) => {
  if (req.body) req.body = sanitizeData(req.body);
  if (req.query) req.query = sanitizeData(req.query);
  if (req.params) req.params = sanitizeData(req.params);
  next();
};

export default mongoSanitize;
