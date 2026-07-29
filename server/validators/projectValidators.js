import validator from 'validator';

/**
 * Project Validators
 *
 * Middleware functions that validate request body fields for project operations.
 * Each validator pushes error objects onto `req.validationErrors`.
 * The `validate` middleware runs after and returns 400 if any errors were collected.
 */

/**
 * Validate project creation input
 * Required: title, tagline, description, techStack
 * Optional: liveUrl, repoUrl (validated if provided)
 */
export const validateCreateProject = (req, res, next) => {
  const errors = [];
  const { title, tagline, description, techStack, liveUrl, repoUrl } = req.body;

  // Title validation
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push({ field: 'title', message: 'Project title is required' });
  } else if (title.trim().length < 3) {
    errors.push({ field: 'title', message: 'Title must be at least 3 characters' });
  } else if (title.trim().length > 100) {
    errors.push({ field: 'title', message: 'Title cannot exceed 100 characters' });
  }

  // Tagline validation
  if (!tagline || typeof tagline !== 'string' || tagline.trim().length === 0) {
    errors.push({ field: 'tagline', message: 'A short tagline is required' });
  } else if (tagline.trim().length > 150) {
    errors.push({ field: 'tagline', message: 'Tagline cannot exceed 150 characters' });
  }

  // Description validation
  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    errors.push({ field: 'description', message: 'Project description is required' });
  } else if (description.trim().length < 20) {
    errors.push({ field: 'description', message: 'Description must be at least 20 characters' });
  } else if (description.trim().length > 5000) {
    errors.push({ field: 'description', message: 'Description cannot exceed 5000 characters' });
  }

  // Tech stack validation
  if (!techStack) {
    errors.push({ field: 'techStack', message: 'At least one technology must be specified' });
  } else {
    // Accept comma-separated string or array
    const stack = Array.isArray(techStack)
      ? techStack
      : typeof techStack === 'string'
        ? techStack.split(',').map((t) => t.trim()).filter(Boolean)
        : [];

    if (stack.length === 0) {
      errors.push({ field: 'techStack', message: 'At least one technology must be specified' });
    } else if (stack.length > 15) {
      errors.push({ field: 'techStack', message: 'Tech stack cannot exceed 15 technologies' });
    }

    // Normalize tech stack on the request body for the controller
    req.body.techStack = stack;
  }

  // Optional URL validations (only validate if provided)
  if (liveUrl && typeof liveUrl === 'string' && liveUrl.trim().length > 0) {
    if (!validator.isURL(liveUrl, { require_protocol: true })) {
      errors.push({ field: 'liveUrl', message: 'Live URL must be a valid URL (include http:// or https://)' });
    }
  }

  if (repoUrl && typeof repoUrl === 'string' && repoUrl.trim().length > 0) {
    if (!validator.isURL(repoUrl, { require_protocol: true })) {
      errors.push({ field: 'repoUrl', message: 'Repository URL must be a valid URL (include http:// or https://)' });
    }
  }

  req.validationErrors = errors;
  next();
};

/**
 * Validate project update input
 * All fields are optional — only validate what's provided
 */
export const validateUpdateProject = (req, res, next) => {
  const errors = [];
  const { title, tagline, description, techStack, liveUrl, repoUrl, status } = req.body;

  // Title (optional on update)
  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      errors.push({ field: 'title', message: 'Title cannot be empty' });
    } else if (title.trim().length < 3) {
      errors.push({ field: 'title', message: 'Title must be at least 3 characters' });
    } else if (title.trim().length > 100) {
      errors.push({ field: 'title', message: 'Title cannot exceed 100 characters' });
    }
  }

  // Tagline (optional on update)
  if (tagline !== undefined) {
    if (typeof tagline !== 'string' || tagline.trim().length === 0) {
      errors.push({ field: 'tagline', message: 'Tagline cannot be empty' });
    } else if (tagline.trim().length > 150) {
      errors.push({ field: 'tagline', message: 'Tagline cannot exceed 150 characters' });
    }
  }

  // Description (optional on update)
  if (description !== undefined) {
    if (typeof description !== 'string' || description.trim().length === 0) {
      errors.push({ field: 'description', message: 'Description cannot be empty' });
    } else if (description.trim().length < 20) {
      errors.push({ field: 'description', message: 'Description must be at least 20 characters' });
    } else if (description.trim().length > 5000) {
      errors.push({ field: 'description', message: 'Description cannot exceed 5000 characters' });
    }
  }

  // Tech stack (optional on update)
  if (techStack !== undefined) {
    const stack = Array.isArray(techStack)
      ? techStack
      : typeof techStack === 'string'
        ? techStack.split(',').map((t) => t.trim()).filter(Boolean)
        : [];

    if (stack.length === 0) {
      errors.push({ field: 'techStack', message: 'At least one technology must be specified' });
    } else if (stack.length > 15) {
      errors.push({ field: 'techStack', message: 'Tech stack cannot exceed 15 technologies' });
    }

    req.body.techStack = stack;
  }

  // URLs (optional on update)
  if (liveUrl !== undefined && liveUrl.trim().length > 0) {
    if (!validator.isURL(liveUrl, { require_protocol: true })) {
      errors.push({ field: 'liveUrl', message: 'Live URL must be a valid URL (include http:// or https://)' });
    }
  }

  if (repoUrl !== undefined && repoUrl.trim().length > 0) {
    if (!validator.isURL(repoUrl, { require_protocol: true })) {
      errors.push({ field: 'repoUrl', message: 'Repository URL must be a valid URL (include http:// or https://)' });
    }
  }

  // Status (optional on update)
  if (status !== undefined) {
    const validStatuses = ['draft', 'published', 'archived'];
    if (!validStatuses.includes(status)) {
      errors.push({ field: 'status', message: `Status must be one of: ${validStatuses.join(', ')}` });
    }
  }

  req.validationErrors = errors;
  next();
};
