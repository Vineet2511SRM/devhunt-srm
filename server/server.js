import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import env from './config/env.js';
import connectDB from './config/db.js';

// Middleware
import errorHandler from './middleware/errorHandler.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import mongoSanitize from './middleware/sanitize.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import upvoteRoutes from './routes/upvoteRoutes.js';
import userRoutes from './routes/userRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Initialize Express application
const app = express();

// ==========================================
// 1. Security & Core Middleware
// ==========================================

// Set security-related HTTP headers
app.use(helmet());

// Enable Cross-Origin Resource Sharing (CORS) with allowed origins list
const allowedOrigins = env.CLIENT_URL ? env.CLIENT_URL.split(',').map((url) => url.trim()) : ['http://localhost:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
        return callback(null, true);
      } else {
        return callback(new Error(`CORS origin '${origin}' not allowed by policy`), false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Parse JSON request payloads
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Parse cookies attached to the client request
app.use(cookieParser());

// NoSQL Injection Sanitization
app.use(mongoSanitize);

// HTTP request logging in development mode
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Apply general rate limiter to all API routes
app.use('/api', generalLimiter);

// ==========================================
// 2. Base Routes & Health Check
// ==========================================

// Root API welcome endpoint
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to DevHunt SRM API 🚀',
    version: '1.0.0',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'UP',
    server: 'Running',
    database: dbStatus,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ==========================================
// 3. API Routes
// ==========================================

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/upvotes', upvoteRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// ==========================================
// 4. Global Error Handler (must be LAST middleware)
// ==========================================

app.use(errorHandler);

// ==========================================
// 5. Server & Database Initialization
// ==========================================

const startServer = async () => {
  try {
    await connectDB();
    const PORT = env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🟢 DevHunt SRM Server running in ${env.NODE_ENV} mode on port ${PORT}`);
      console.log(`🔗 API Endpoint: http://localhost:${PORT}/api`);
      console.log(`🩺 Health Check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
