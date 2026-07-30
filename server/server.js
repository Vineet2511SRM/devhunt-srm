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

// Route imports
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import upvoteRoutes from './routes/upvoteRoutes.js';
import userRoutes from './routes/userRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

// Initialize Express application
const app = express();

// ==========================================
// 1. Security & Core Middleware
// ==========================================

// Set security-related HTTP headers (XSS, content policy, clickjacking, etc.)
app.use(helmet());

// Enable Cross-Origin Resource Sharing (CORS) for React frontend
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true, // Allow cookies and authorization headers to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse incoming JSON payloads in request body (up to 10MB for project submissions)
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Parse cookies attached to the client request
app.use(cookieParser());

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

// Health check endpoint to monitor server and database status
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

// ==========================================
// 4. Global Error Handler (must be LAST middleware)
// ==========================================

app.use(errorHandler);

// ==========================================
// 5. Server & Database Initialization
// ==========================================

const startServer = async () => {
  try {
    // Step 1: Connect to MongoDB database
    await connectDB();

    // Step 2: Start Express HTTP server listening on configured port
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

// Start the server
startServer();

export default app;
