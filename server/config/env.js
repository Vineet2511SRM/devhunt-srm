import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Construct __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file in server root directory
dotenv.config({ path: path.join(__dirname, '../.env') });

export const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/devhunt-srm',
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret_key',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  COOKIE_EXPIRE: parseInt(process.env.COOKIE_EXPIRE || '7', 10),
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  CLOUDINARY: {
    CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
    API_KEY: process.env.CLOUDINARY_API_KEY || '',
    API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
  },
  SMTP: {
    HOST: process.env.SMTP_HOST || '',
    PORT: process.env.SMTP_PORT || 2525,
    EMAIL: process.env.SMTP_EMAIL || '',
    PASSWORD: process.env.SMTP_PASSWORD || '',
    FROM_EMAIL: process.env.FROM_EMAIL || 'noreply@devhunt-srm.edu',
    FROM_NAME: process.env.FROM_NAME || 'DevHunt SRM',
  },
};

export default env;
