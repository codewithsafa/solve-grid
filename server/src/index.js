// SolveMe API Server
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const problemsRouter = require('./routes/problems');
const discussionsRouter = require('./routes/discussions');
const infoRouter = require('./routes/info');
const statsRouter = require('./routes/stats');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Support base64 image uploads
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'SolveMe Civic API',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/problems', problemsRouter);
app.use('/api/problems', discussionsRouter);
app.use('/api/problems', infoRouter);
app.use('/api/dashboard', statsRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({
    success: false,
    error: err.message || "Internal Server Error"
  });
});

app.listen(PORT, () => {
  console.log(`=============================================`);
  console.log(`🏛️  SolveMe API Server running on port ${PORT}`);
  console.log(`📡  Health check: http://localhost:${PORT}/api/health`);
  console.log(`📋  Problems API: http://localhost:${PORT}/api/problems`);
  console.log(`📊  Dashboard API: http://localhost:${PORT}/api/dashboard/stats`);
  console.log(`=============================================`);
});
