const { Connection } = require('@solana/web3.js');
const WhaleActivity = require('../models/WhaleActivity');
const WhaleWallet = require('../models/WhaleWallet');
const TokenData = require('../models/TokenData');
const Alert = require('../models/Alert');
const AlertSetting = require('../models/AlertSetting');
const User = require('../models/User');

// Whale threshold in USD
const WHALE_THRESHOLD = 100000;

/**
 * Monitor large transactions and notify users
 */
class WhaleMonitor {
  constructor(io) {
    this.io = io;
    this.isRunning = false;
    this.knownWhales = new Set();
    this.watchedTokens = new Set();
  }

  /**
   * Initialize the monitoring service
   */
  async initialize() {
    try {
      // Load known whale wallets
      const whales = await WhaleWallet.find().select('address');
      whales.forEach(whale => this.knownWhales.add(whale.address));

      // Load watched tokens
      const tokens = await TokenData.find().select('address');
      tokens.forEach(token => this.watchedTokens.add(token.address));

      console.log(`Initialized whale monitor with ${this.knownWhales.size} whales and ${this.watchedTokens.size} tokens`);
    } catch (error) {
      console.error('Error initializing whale monitor:', error);
    }
  }

  /**
   * Start monitoring
   */
  async start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('Whale monitoring started');
    
    // In a real implementation, we would connect to Solana blockchain
    // and watch for large transactions using ProgramSubscribe or similar methods
    
    // For demo purposes, we'll simulate a whale transaction every 30 seconds
    this.timer = setInterval(() => this.simulateWhaleTransaction(), 30000);
  }

  /**
   * Stop monitoring
   */
  stop() {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    clearInterval(this.timer);
    console.log('Whale monitoring stopped');
  }

  /**
   * Simulate a whale transaction for demonstration
   */
  async simulateWhaleTransaction() {
    try {
      // Get a random whale address (in a real app, this would be from blockchain data)
      const whales = Array.from(this.knownWhales);
      const randomWhaleIndex = Math.floor(Math.random() * whales.length);
      const whaleAddress = whales[randomWhaleIndex] || 'Sim7abcdef1234567890';
      
      // Get a random token (in a real app, this would be from transaction data)
      const tokens = await TokenData.find().limit(10);
      const randomTokenIndex = Math.floor(Math.random() * tokens.length);
      const token = tokens[randomTokenIndex];
      
      if (!token) return;
      
      // Create simulated transaction
      const amount = Math.random() * 1000000 + 10000; // Random amount between 10k and 1M
      const transaction = {
        address: whaleAddress,
        type: Math.random() > 0.5 ? 'transfer' : 'swap',
        amount,
        token: token.address,
        tokenSymbol: token.symbol,
        transactionHash: 'tx_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15),
        timestamp: new Date(),
        metadata: {
          blockExplorer: `https://explorer.solana.com/tx/${Math.random().toString(36).substring(2)}`,
        }
      };
      
      // Save transaction
      const activity = await WhaleActivity.create(transaction);
      
      // Update whale wallet data
      await WhaleWallet.findOneAndUpdate(
        { address: whaleAddress },
        { 
          $inc: { transactions: 1 },
          $set: { lastActive: new Date() }
        },
        { upsert: true }
      );
      
      // Update token whale interest
      await TokenData.findOneAndUpdate(
        { address: token.address },
        { $inc: { whaleInterest: 1 } }
      );
      
      // Create alerts for users tracking this token or whale
      await this.createAlerts(transaction);
      
      // Emit realtime update via Socket.io to general subscribers
      this.io.emit('whale_transaction', { 
        transaction: activity,
        token: {
          symbol: token.symbol,
          name: token.name,
          price: token.price
        }
      });

      // Emit to specific event subscribers
      this.io.to('event:whale_movement').emit('whale_movement', {
        transaction: activity,
        token: {
          symbol: token.symbol,
          name: token.name,
          price: token.price
        }
      });

      // Emit to token-specific subscribers
      this.io.to(`token:${token.address}`).emit('token_activity', {
        type: 'whale_movement',
        transaction: activity,
        token: {
          symbol: token.symbol,
          name: token.name,
          price: token.price
        }
      });
      
      console.log(`Simulated whale transaction: ${transaction.type} of ${token.symbol} worth $${amount.toFixed(2)}`);
    } catch (error) {
      console.error('Error simulating whale transaction:', error);
    }
  }
  
  /**
   * Create alerts for users based on transaction
   */
  async createAlerts(transaction) {
    try {
      // Find users with alert settings for whale movements
      const alertSettings = await AlertSetting.find({ 
        type: 'whale_movement',
        enabled: true,
        minAmount: { $lte: transaction.amount }
      }).populate('user');
      
      // Find users who track this specific whale or token
      const trackingUsers = await User.find({
        $or: [
          { trackedWallets: transaction.address },
          { watchlist: transaction.token }
        ]
      });
      
      // Combine users (alertSettings users + tracking users)
      const userIds = new Set();
      
      // Add users from alert settings
      alertSettings.forEach(setting => {
        userIds.add(setting.user._id.toString());
      });
      
      // Add tracking users
      trackingUsers.forEach(user => {
        userIds.add(user._id.toString());
      });
      
      // Create alerts for all relevant users
      const alerts = [];
      
      for (const userId of userIds) {
        const alert = {
          user: userId,
          type: 'whale_movement',
          severity: transaction.amount > 500000 ? 'high' : transaction.amount > 100000 ? 'medium' : 'low',
          title: `Large ${transaction.tokenSymbol} ${transaction.type} detected`,
          description: `A whale has ${transaction.type === 'transfer' ? 'transferred' : 'swapped'} ${transaction.tokenSymbol} worth $${transaction.amount.toFixed(2)}`,
          token: transaction.token,
          tokenSymbol: transaction.tokenSymbol,
          read: false,
          active: true
        };
        
        alerts.push(alert);
      }
      
      // Bulk insert alerts
      if (alerts.length > 0) {
        await Alert.insertMany(alerts);
        
        // Notify users via Socket.io
        alerts.forEach(alert => {
          this.io.to(alert.user.toString()).emit('new_alert', alert);
        });
        
        console.log(`Created ${alerts.length} alerts for whale movement`);
      }
    } catch (error) {
      console.error('Error creating alerts:', error);
    }
  }
}

module.exports = WhaleMonitor; 