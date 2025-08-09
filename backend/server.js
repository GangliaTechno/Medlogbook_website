// Load environment variables FIRST, before any other imports
require('dotenv').config();

const express = require('express');
const multer = require("multer");
const path = require("path");
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet'); // Security middleware
const rateLimit = require('express-rate-limit'); // Rate limiting

// Import routes
const authRoutes = require('./routes/authRoutes');
const logentryRoutes = require('./routes/logentryRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const uploadRoute = require('./routes/uploadRoute');
const taskRoutes = require('./routes/tasks');
const supportRoutes = require('./routes/supportRoutes');
const pendingUserRoutes = require("./routes/pendingUserRoutes");
const courseSuggestionRoute = require('./routes/courseSuggestionRoute');
const geminiRoutes = require('./routes/gemini');
const generateRoutes = require('./routes/generateform-v2');

// Environment validation
const requiredEnvVars = ['MONGO_URI', 'GEMINI_API_KEY'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars);
  process.exit(1);
}

// Debug: Check if API key is loaded
console.log('🔍 Environment check:');
console.log('GEMINI_API_KEY loaded:', !!process.env.GEMINI_API_KEY);
console.log('GEMINI_API_KEY length:', process.env.GEMINI_API_KEY?.length || 0);
console.log('MONGO_URI loaded:', !!process.env.MONGO_URI);

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://medlogbook.ganglia.in',
  'https://medlogbook-website-frontend.onrender.com',
  'http://100.120.81.61',
  'https://100.120.81.61'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
}));

// File upload configuration with better error handling
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "./uploads/";
    // Ensure uploads directory exists
    const fs = require('fs');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Sanitize filename and add timestamp
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, Date.now() + '-' + sanitizedName);
  },
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Maximum 5 files
  },
  fileFilter: (req, file, cb) => {
    // Add file type validation if needed
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Serve static files with cache headers
app.use("/uploads", express.static("uploads", {
  maxAge: '1d', // Cache for 1 day
  etag: false
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Simple status endpoint
app.get('/status', (req, res) => {
  res.status(200).json({
    status: 'ok'
  });
});

// API routes with versioning
const API_VERSION = '/api/v1';

// Authentication routes
app.use(`${API_VERSION}/auth`, authRoutes);

// AI/ML routes
app.use(`${API_VERSION}/ai`, geminiRoutes);
app.use(`${API_VERSION}/generate`, generateRoutes);

// Core application routes
app.use(`${API_VERSION}/tasks`, taskRoutes);
app.use(`${API_VERSION}/logentry`, logentryRoutes);
app.use(`${API_VERSION}/category`, categoryRoutes);
app.use(`${API_VERSION}/upload`, uploadRoute);
app.use(`${API_VERSION}/support`, supportRoutes);
app.use(`${API_VERSION}/pending-users`, pendingUserRoutes);
app.use(`${API_VERSION}/course-suggestions`, courseSuggestionRoute);
app.use(`${API_VERSION}/students`, require("./routes/students"));

// Legacy routes (for backward compatibility)
app.use('/api/auth', authRoutes);
app.use('/api', taskRoutes);
app.use("/api/students", require("./routes/students"));
app.use('/api', uploadRoute);
app.use('/api/logentry', logentryRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api', supportRoutes);
app.use("/api", pendingUserRoutes);
app.use('/api', courseSuggestionRoute);
app.use('/api/ai', geminiRoutes);
app.use('/api/gen', generateRoutes);

// MongoDB connection with better error handling
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0 // Disable mongoose buffering
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Too many files' });
    }
  }
  
  res.status(error.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Medical Logbook API',
    version: '1.0.0',
    status: 'OK',
    endpoints: {
      health: '/health',
      api: '/api/v1',
      docs: '/api/v1/docs' // If you add API documentation
    }
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed.');
    process.exit(0);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  if (!process.env.GEMINI_API_KEY) {
    console.error('⚠️  WARNING: GEMINI_API_KEY not loaded!');
  } else {
    console.log('✅ GEMINI_API_KEY loaded successfully');
  }
});

// Handle server errors
server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  
  const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;
  
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
});

module.exports = app;