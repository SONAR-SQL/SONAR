const TokenData = require('../models/TokenData');
const Alert = require('../models/Alert');
const AlertSetting = require('../models/AlertSetting');
const User = require('../models/User');

/**
 * Monitor market conditions for price changes and volume spikes
 */
class MarketMonitor {
  constructor(io) {
    this.io = io;
    this.isRunning = false;
  }

  /**
   * Start monitoring
   */
  async start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('Market monitoring started');
    
    // Check for significant market changes every 15 minutes
    // In a real application, this would be more sophisticated and use real market data
    this.timer = setInterval(() => this.checkMarketConditions(), 15 * 60 * 1000);
    
    // For demo, run immediately after starting
    this.checkMarketConditions();
  }

  /**
   * Stop monitoring
   */
  stop() {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    clearInterval(this.timer);
    console.log('Market monitoring stopped');
  }

  /**
   * Check market conditions for significant changes
   */
  async checkMarketConditions() {
    try {
      console.log('Checking market conditions...');
      
      // Get all tokens
      const tokens = await TokenData.find();
      
      for (const token of tokens) {
        // Simulate price change (in a real app this would be from an external API)
        await this.simulatePriceChange(token);
        
        // Simulate volume change
        await this.simulateVolumeSpike(token);
      }
      
      console.log('Market condition check completed');
    } catch (error) {
      console.error('Error checking market conditions:', error);
    }
  }
  
  /**
   * Simulate price changes for a token
   */
  async simulatePriceChange(token) {
    try {
      // Generate a random price change (-15% to +15%)
      const changePercent = (Math.random() * 30 - 15).toFixed(2);
      const isSignificant = Math.abs(changePercent) > 5; // Consider >5% a significant change
      
      if (!isSignificant) return;
      
      // Update token price
      const oldPrice = token.price;
      const newPrice = oldPrice * (1 + changePercent / 100);
      
      // Add to historical data
      const historyEntry = {
        timestamp: new Date(),
        price: newPrice,
        volume: token.volume24h
      };
      
      // Update token data
      await TokenData.findByIdAndUpdate(token._id, {
        price: newPrice,
        priceChange24h: changePercent,
        $push: { 
          historicalData: { 
            $each: [historyEntry],
            $sort: { timestamp: -1 },
            $slice: 100 // Keep only the most recent 100 entries
          }
        }
      });
      
      console.log(`${token.symbol} price changed by ${changePercent}% from $${oldPrice.toFixed(2)} to $${newPrice.toFixed(2)}`);
      
      // Create alerts for significant price changes
      if (Math.abs(changePercent) >= 5) {
        await this.createPriceAlerts(token, changePercent, oldPrice, newPrice);
      }
      
      // Emit price update to all connected clients
      this.io.emit('price_update', {
        token: token.address,
        symbol: token.symbol,
        oldPrice,
        newPrice,
        changePercent
      });

      // Emit to specific event subscribers
      this.io.to('event:price_change').emit('price_change', {
        token: token.address,
        symbol: token.symbol,
        oldPrice,
        newPrice,
        changePercent
      });
      
      // Emit to token-specific subscribers
      this.io.to(`token:${token.address}`).emit('token_activity', {
        type: 'price_change',
        token: token.address,
        symbol: token.symbol,
        oldPrice,
        newPrice,
        changePercent
      });
      
    } catch (error) {
      console.error(`Error simulating price change for ${token.symbol}:`, error);
    }
  }
  
  /**
   * Simulate volume spike for a token
   */
  async simulateVolumeSpike(token) {
    try {
      // Randomly decide if there should be a volume spike (10% chance)
      if (Math.random() > 0.1) return;
      
      // Generate a random volume increase (50% to 300%)
      const volumeIncreasePercent = (Math.random() * 250 + 50).toFixed(2);
      const oldVolume = token.volume24h;
      const newVolume = oldVolume * (1 + volumeIncreasePercent / 100);
      
      // Update token volume
      await TokenData.findByIdAndUpdate(token._id, {
        volume24h: newVolume
      });
      
      console.log(`${token.symbol} volume spiked by ${volumeIncreasePercent}% from $${oldVolume.toFixed(2)} to $${newVolume.toFixed(2)}`);
      
      // Create alerts for volume spikes
      await this.createVolumeAlerts(token, volumeIncreasePercent, oldVolume, newVolume);
      
      // Emit volume update to all connected clients
      this.io.emit('volume_update', {
        token: token.address,
        symbol: token.symbol,
        oldVolume,
        newVolume,
        volumeIncreasePercent
      });

      // Emit to specific event subscribers
      this.io.to('event:volume_spike').emit('volume_spike', {
        token: token.address,
        symbol: token.symbol,
        oldVolume,
        newVolume,
        volumeIncreasePercent
      });
      
      // Emit to token-specific subscribers
      this.io.to(`token:${token.address}`).emit('token_activity', {
        type: 'volume_spike',
        token: token.address,
        symbol: token.symbol,
        oldVolume,
        newVolume,
        volumeIncreasePercent
      });
      
    } catch (error) {
      console.error(`Error simulating volume spike for ${token.symbol}:`, error);
    }
  }
  
  /**
   * Create price change alerts
   */
  async createPriceAlerts(token, changePercent, oldPrice, newPrice) {
    try {
      // Find users who have enabled price change alerts with a threshold lower than the change
      const alertSettings = await AlertSetting.find({
        type: 'price_change',
        enabled: true,
        threshold: { $lte: Math.abs(changePercent) }
      }).populate('user');
      
      // Find users who watch this token
      const watchingUsers = await User.find({
        watchlist: token.address
      });
      
      // Combine users
      const userIds = new Set();
      
      // Add users from alert settings
      alertSettings.forEach(setting => {
        userIds.add(setting.user._id.toString());
      });
      
      // Add watching users
      watchingUsers.forEach(user => {
        userIds.add(user._id.toString());
      });
      
      // Create alerts for all relevant users
      const alerts = [];
      
      for (const userId of userIds) {
        const alert = {
          user: userId,
          type: 'price_change',
          severity: Math.abs(changePercent) > 10 ? 'high' : Math.abs(changePercent) > 7 ? 'medium' : 'low',
          title: `${token.symbol} price ${changePercent > 0 ? 'increased' : 'decreased'} by ${Math.abs(changePercent)}%`,
          description: `${token.symbol} price ${changePercent > 0 ? 'rose' : 'fell'} from $${oldPrice.toFixed(2)} to $${newPrice.toFixed(2)}`,
          token: token.address,
          tokenSymbol: token.symbol,
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
        
        console.log(`Created ${alerts.length} alerts for ${token.symbol} price change`);
      }
    } catch (error) {
      console.error(`Error creating price alerts for ${token.symbol}:`, error);
    }
  }
  
  /**
   * Create volume spike alerts
   */
  async createVolumeAlerts(token, volumeIncreasePercent, oldVolume, newVolume) {
    try {
      // Find users who have enabled volume spike alerts with a threshold lower than the increase
      const alertSettings = await AlertSetting.find({
        type: 'volume_spike',
        enabled: true,
        threshold: { $lte: volumeIncreasePercent }
      }).populate('user');
      
      // Find users who watch this token
      const watchingUsers = await User.find({
        watchlist: token.address
      });
      
      // Combine users
      const userIds = new Set();
      
      // Add users from alert settings
      alertSettings.forEach(setting => {
        userIds.add(setting.user._id.toString());
      });
      
      // Add watching users
      watchingUsers.forEach(user => {
        userIds.add(user._id.toString());
      });
      
      // Create alerts for all relevant users
      const alerts = [];
      
      for (const userId of userIds) {
        const alert = {
          user: userId,
          type: 'volume_spike',
          severity: volumeIncreasePercent > 200 ? 'high' : volumeIncreasePercent > 100 ? 'medium' : 'low',
          title: `${token.symbol} trading volume increased by ${volumeIncreasePercent}%`,
          description: `${token.symbol} volume rose from $${oldVolume.toFixed(2)} to $${newVolume.toFixed(2)}`,
          token: token.address,
          tokenSymbol: token.symbol,
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
        
        console.log(`Created ${alerts.length} alerts for ${token.symbol} volume spike`);
      }
    } catch (error) {
      console.error(`Error creating volume alerts for ${token.symbol}:`, error);
    }
  }
}

module.exports = MarketMonitor; 