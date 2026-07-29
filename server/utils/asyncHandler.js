/**
 * Async Handler Wrapper
 *
 * Wraps an async Express route handler so that any rejected promise
 * is automatically caught and forwarded to the global error handler
 * via next(error).
 *
 * Without this, every controller would need its own try/catch block.
 *
 * Usage:
 *   router.get('/projects', asyncHandler(async (req, res) => {
 *     const projects = await Project.find();
 *     res.json(projects);
 *   }));
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
