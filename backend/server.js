// Load environment variables FIRST
import dotenv from 'dotenv';
dotenv.config();

// Core imports
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';

// Database and utilities
import connectDatabase from './config/database.js';
import seedUsers from './utils/seedUsers.js';
import errorHandler from './middleware/errorHandler.js';
import { generalLimiter } from './middleware/rateLimiter.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import plateChoiceRoutes from './routes/plateChoiceRoutes.js';
import foodParcelRoutes from './routes/foodParcelRoutes.js';
import statisticsRoutes from './routes/statisticsRoutes.js';

// Initialize Express app
const app = express();

// Set port
const PORT = process.env.PORT || 5000;

const normalizeOrigin = (origin = '') => origin.trim().replace(/\/+$/, '');
const configuredOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map(normalizeOrigin)
  .filter(Boolean);

const parseTrustProxy = (value) => {
  if (value === undefined) return null;

  const normalized = String(value).trim().toLowerCase();

  if (normalized === 'true') return true;
  if (normalized === 'false') return false;

  const asNumber = Number(normalized);
  return Number.isNaN(asNumber) ? normalized : asNumber;
};

const allowedOrigins = new Set(configuredOrigins);

if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.add('http://localhost:5173');
  allowedOrigins.add('http://127.0.0.1:5173');
}

const envTrustProxy = parseTrustProxy(process.env.TRUST_PROXY);
const usesDevTunnel = Array.from(allowedOrigins).some((origin) => origin.includes('.devtunnels.ms'));
const trustProxy = envTrustProxy ?? (process.env.NODE_ENV === 'production' || usesDevTunnel ? 1 : false);
app.set('trust proxy', trustProxy);

// Connect to MongoDB
connectDatabase();

// Seed default users after a short delay to ensure models are loaded
setTimeout(() => {
  seedUsers();
}, 2000);

// Security middleware - Helmet for setting security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false, // Disable for development, enable in production
  })
);

// CORS configuration - Allow credentials for configured frontend origins
const corsOptions = {
  origin: (origin, callback) => {
    // Requests from tools like Postman/cURL may have no Origin header.
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Body parser middleware - Parse JSON and URL-encoded data
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser middleware - Parse cookies from requests
app.use(cookieParser());

// Request logging middleware (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Apply rate limiting to all API routes
app.use('/api/', generalLimiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/plate-choices', plateChoiceRoutes);
app.use('/api/food-parcels', foodParcelRoutes);
app.use('/api/statistics', statisticsRoutes);

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AltPlate API - Food Court Management System',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      plateChoices: '/api/plate-choices',
      foodParcels: '/api/food-parcels',
      statistics: '/api/statistics',
    },
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AltPlate API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Global error handler (must be last middleware)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log('═══════════════════════════════════════════════════════');
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌐 API URL: http://localhost:${PORT}`);
  console.log(`🧭 Trust Proxy: ${String(trustProxy)}`);
  console.log(`🔗 Allowed Client Origins: ${Array.from(allowedOrigins).join(', ')}`);
  console.log('═══════════════════════════════════════════════════════');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n👋 SIGINT RECEIVED. Shutting down gracefully...');
  process.exit(0);
});
