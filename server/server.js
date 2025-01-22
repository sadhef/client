require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const db = require('./config/db');

// Environment Configuration
const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.SERVER_PORT || 5000,
  DASH_URL: process.env.REACT_APP_DASH_URL || 'https://bladerunner.greenjets.com/dash',
  API_URL: process.env.REACT_APP_API_URL || 'https://bladerunner.greenjets.com/api',
  API_PREFIX: '/api',
  
  CORS_ORIGINS: [
    'https://bladerunner.greenjets.com',
    'http://localhost:3000'
  ]
};

// Add custom origins from environment variable if provided
if (process.env.CORS_ORIGINS) {
  const customOrigins = process.env.CORS_ORIGINS.split(',').map(origin => origin.trim());
  config.CORS_ORIGINS.push(...customOrigins);
  config.CORS_ORIGINS = [...new Set(config.CORS_ORIGINS)];
}

// Logger utility
const logger = {
  info: (msg) => console.log(`[${new Date().toISOString()}] [INFO] ${msg}`),
  error: (msg, err) => console.error(`[${new Date().toISOString()}] [ERROR] ${msg}`, err),
  debug: (msg, data) => config.NODE_ENV === 'development' && 
    console.log(`[${new Date().toISOString()}] [DEBUG] ${msg}`, data || '')
};

const app = express();

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    const isAllowed = !origin || config.CORS_ORIGINS.includes(origin);
    if (isAllowed) {
      callback(null, true);
    } else {
      logger.debug('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token', 'x-requested-with'],
  exposedHeaders: ['x-auth-token']
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database connection middleware
app.use(async (req, res, next) => {
  try {
    await db.getPool();
    next();
  } catch (error) {
    logger.error('Database connection error:', error);
    res.status(503).json({ error: 'Database service unavailable' });
  }
});

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  logger.debug('Request Headers:', req.headers);
  next();
});

// Routes - using API prefix
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const pool = await db.getPool();
    const dbConnected = !!pool;
    res.json({
      status: 'healthy',
      environment: config.NODE_ENV,
      timestamp: new Date().toISOString(),
      database: { connected: dbConnected }
    });
  } catch (error) {
    logger.error('Health check error:', error);
    res.status(503).json({ status: 'unhealthy' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Application error:', err);
  res.status(500).json({
    error: config.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

// Initialize server with database connection
const startServer = async () => {
  try {
    await db.initializePool();
    
    const server = app.listen(config.PORT, () => {
      logger.info(`Server running on port ${config.PORT} in ${config.NODE_ENV} mode`);
    });

    process.on('SIGTERM', async () => {
      logger.info('SIGTERM received. Shutting down...');
      server.close(async () => {
        await db.closePool();
        process.exit(0);
      });
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
