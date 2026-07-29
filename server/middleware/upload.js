import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import ApiError from '../utils/ApiError.js';
import { Readable } from 'stream';

// Configure Multer for memory storage (file buffers)
const storage = multer.memoryStorage();

// Accept only specific image types
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Unsupported file format. Only JPEG, PNG, and WebP are allowed.'), false);
  }
};

// Export the configured multer instance
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

/**
 * Middleware that pipes multer's file buffers to Cloudinary.
 * Attaches the resulting secure URLs to req.body so controllers can easily access them.
 */
export const uploadToCloudinary = async (req, res, next) => {
  try {
    // If no files were attached, just move to the next middleware
    if (!req.file && (!req.files || Object.keys(req.files).length === 0)) {
      return next();
    }

    // Helper to upload a single buffer to Cloudinary
    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'devhunt-srm' }, // Cloudinary folder
          (error, result) => {
            if (result) {
              resolve(result.secure_url);
            } else {
              reject(error);
            }
          }
        );
        Readable.from(fileBuffer).pipe(stream);
      });
    };

    if (req.file) {
      // Single file upload (e.g. upload.single('avatar'))
      req.body.uploadedUrl = await streamUpload(req.file.buffer);
    } else if (req.files) {
      // Multiple files upload (e.g. upload.array('screenshots') or upload.fields([...]))
      if (Array.isArray(req.files)) {
        const uploadPromises = req.files.map((file) => streamUpload(file.buffer));
        req.body.uploadedUrls = await Promise.all(uploadPromises);
      } else {
        // req.files is an object with field names as keys
        req.body.uploadedUrls = {};
        for (const fieldName in req.files) {
          const uploadPromises = req.files[fieldName].map((file) => streamUpload(file.buffer));
          req.body.uploadedUrls[fieldName] = await Promise.all(uploadPromises);
        }
      }
    }

    next();
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    next(new ApiError(500, 'Error uploading images to Cloudinary. Please try again.'));
  }
};
