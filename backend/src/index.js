require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

// Route imports
const authRoutes = require('./routes/auth');
const whaleRoutes = require('./routes/whales');
const alertRoutes = require('./routes/alerts');
const marketRoutes = require('./routes/market');

// Service imports
const WhaleMonitor = require('./services/whaleMonitor');
const MarketMonitor = require('./services/marketMonitor');
const seedDatabase = require('./utils/seedData');

// Initialize application
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:3000'],
    credentials: true
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: Date.now()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/whales', whaleRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/market', marketRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('New client connected');
  
  // Add user to their own room for private notifications
  if (socket.handshake.query && socket.handshake.query.userId) {
    socket.join(socket.handshake.query.userId);
    console.log(`User ${socket.handshake.query.userId} joined their private room`);
  }

  // Handle subscriptions to specific events
  socket.on('subscribe', (eventType) => {
    if (typeof eventType === 'string') {
      socket.join(`event:${eventType}`);
      console.log(`Client subscribed to ${eventType} events`);
    }
  });

  // Handle token subscriptions
  socket.on('subscribe_token', (tokenAddress) => {
    if (typeof tokenAddress === 'string') {
      socket.join(`token:${tokenAddress}`);
      console.log(`Client subscribed to token ${tokenAddress}`);
    }
  });

  // Handle unsubscriptions
  socket.on('unsubscribe', (eventType) => {
    if (typeof eventType === 'string') {
      socket.leave(`event:${eventType}`);
      console.log(`Client unsubscribed from ${eventType} events`);
    }
  });
  
  // Handle token unsubscriptions
  socket.on('unsubscribe_token', (tokenAddress) => {
    if (typeof tokenAddress === 'string') {
      socket.leave(`token:${tokenAddress}`);
      console.log(`Client unsubscribed from token ${tokenAddress}`);
    }
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Server startup
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sonar';

// Initialize services
let whaleMonitor;
let marketMonitor;

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Seed database with initial data
    await seedDatabase();
    
    // Start the server
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    
    // Initialize and start monitoring services
    whaleMonitor = new WhaleMonitor(io);
    await whaleMonitor.initialize();
    whaleMonitor.start();
    
    marketMonitor = new MarketMonitor(io);
    marketMonitor.start();
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Graceful shutdown
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

function gracefulShutdown() {
  console.log('Shutting down gracefully...');
  
  // Stop monitoring services
  if (whaleMonitor) {
    whaleMonitor.stop();
  }
  
  if (marketMonitor) {
    marketMonitor.stop();
  }
  
  // Close server
  server.close(() => {
    console.log('HTTP server closed');
    
    // Close database connection
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
}

// Export for testing
module.exports = { app, server, io }; 