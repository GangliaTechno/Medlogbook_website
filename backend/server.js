// Load environment variables FIRST, before any other imports
require('dotenv').config();

const express = require('express');
const multer = require("multer");
const path = require("path");
const mongoose = require('mongoose');
const cors = require('cors'); 

const authRoutes = require('./routes/authRoutes'); 
const logentryRoutes = require('./routes/logentryRoutes'); 
const categoryRoutes = require('./routes/categoryRoutes');
const uploadRoute = require('./routes/uploadRoute'); 
const taskRoutes = require('./routes/tasks'); 
const supportRoutes = require('./routes/supportRoutes');
const pendingUserRoutes = require("./routes/pendingUserRoutes");
const courseSuggestionRoute = require('./routes/courseSuggestionRoute');

// Debug: Check if API key is loaded
console.log('🔍 Environment check:');
console.log('GEMINI_API_KEY loaded:', !!process.env.GEMINI_API_KEY);
console.log('GEMINI_API_KEY length:', process.env.GEMINI_API_KEY?.length || 0);
console.log('MONGO_URI loaded:', !!process.env.MONGO_URI);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://medlogbook.ganglia.in', 'https://medlogbook-website-frontend.onrender.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// GEMINI ROUTES
const geminiRoutes = require('./routes/gemini'); 
app.use('/api/ai', geminiRoutes);

const generateRoutes = require('./routes/generateform-v2'); 
app.use('/api/gen', generateRoutes);

// File upload configuration
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Serve static files
app.use("/uploads", express.static("uploads"));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api', taskRoutes);
app.use("/api/students", require("./routes/students"));
app.use('/api', uploadRoute);
app.use('/api/logentry', logentryRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api', supportRoutes);
app.use("/api", pendingUserRoutes);
app.use('/api', courseSuggestionRoute);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

// Root route
app.get('/', (req, res) => {
  res.send('API is working!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  
  if (!process.env.GEMINI_API_KEY) {
    console.error('⚠️  WARNING: GEMINI_API_KEY not loaded!');
  } else {
    console.log('✅ GEMINI_API_KEY loaded successfully');
  }
});
