const mongoose = require('mongoose');
const TokenData = require('../models/TokenData');
const WhaleWallet = require('../models/WhaleWallet');
const User = require('../models/User');

// Sample tokens data
const tokens = [
  {
    symbol: 'SOL',
    name: 'Solana',
    address: 'So11111111111111111111111111111111111111112',
    price: 38.45,
    priceChange24h: 2.5,
    volume24h: 1250000,
    marketCap: 16800000000,
    whaleInterest: 85,
    riskScore: 25,
    historicalData: Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - (24 - i) * 60 * 60 * 1000),
      price: 38.45 * (1 + (Math.random() * 0.1 - 0.05)),
      volume: 1250000 * (1 + (Math.random() * 0.2 - 0.1))
    }))
  },
  {
    symbol: 'BONK',
    name: 'Bonk',
    address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    price: 0.00002345,
    priceChange24h: 10.8,
    volume24h: 950000,
    marketCap: 180000000,
    whaleInterest: 70,
    riskScore: 65,
    historicalData: Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - (24 - i) * 60 * 60 * 1000),
      price: 0.00002345 * (1 + (Math.random() * 0.15 - 0.075)),
      volume: 950000 * (1 + (Math.random() * 0.3 - 0.15))
    }))
  },
  {
    symbol: 'JTO',
    name: 'Jito',
    address: 'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn',
    price: 2.85,
    priceChange24h: -3.2,
    volume24h: 420000,
    marketCap: 285000000,
    whaleInterest: 60,
    riskScore: 45,
    historicalData: Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - (24 - i) * 60 * 60 * 1000),
      price: 2.85 * (1 + (Math.random() * 0.08 - 0.04)),
      volume: 420000 * (1 + (Math.random() * 0.2 - 0.1))
    }))
  },
  {
    symbol: 'PYTH',
    name: 'Pyth Network',
    address: 'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3',
    price: 0.56,
    priceChange24h: 5.6,
    volume24h: 320000,
    marketCap: 560000000,
    whaleInterest: 55,
    riskScore: 40,
    historicalData: Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - (24 - i) * 60 * 60 * 1000),
      price: 0.56 * (1 + (Math.random() * 0.1 - 0.05)),
      volume: 320000 * (1 + (Math.random() * 0.25 - 0.125))
    }))
  },
  {
    symbol: 'RAY',
    name: 'Raydium',
    address: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
    price: 1.23,
    priceChange24h: -1.8,
    volume24h: 280000,
    marketCap: 123000000,
    whaleInterest: 50,
    riskScore: 50,
    historicalData: Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - (24 - i) * 60 * 60 * 1000),
      price: 1.23 * (1 + (Math.random() * 0.08 - 0.04)),
      volume: 280000 * (1 + (Math.random() * 0.2 - 0.1))
    }))
  }
];

// Sample whale wallets
const whaleWallets = [
  {
    address: 'HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH',
    label: 'Jump Trading',
    tags: ['Institution', 'Market Maker'],
    totalValue: 120000000,
    transactions: 1235,
    followers: 982,
    holdingTokens: [
      { token: 'So11111111111111111111111111111111111111112', symbol: 'SOL', amount: 2500000, value: 96250000 },
      { token: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', symbol: 'BONK', amount: 28000000000, value: 656600 }
    ]
  },
  {
    address: '3FucQs4vfwHaBVwKTTADHrZGbfzCgFJ8cJPMP3uxBDkx',
    label: 'Alameda Research',
    tags: ['Institution', 'Defunct'],
    totalValue: 75000000,
    transactions: 820,
    followers: 1250,
    holdingTokens: [
      { token: 'So11111111111111111111111111111111111111112', symbol: 'SOL', amount: 1800000, value: 69210000 },
      { token: 'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn', symbol: 'JTO', amount: 2000000, value: 5700000 }
    ]
  },
  {
    address: '7RCz8wb6WXxUhAigZXEbPLb8Qhr2NCMXNrg1L8fBiN79',
    label: 'Binance Hot Wallet',
    tags: ['Exchange', 'CEX'],
    totalValue: 250000000,
    transactions: 5860,
    followers: 3250,
    holdingTokens: [
      { token: 'So11111111111111111111111111111111111111112', symbol: 'SOL', amount: 5200000, value: 199940000 },
      { token: 'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3', symbol: 'PYTH', amount: 12000000, value: 6720000 },
      { token: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R', symbol: 'RAY', amount: 35000000, value: 43050000 }
    ]
  }
];

/**
 * Seed database with initial data
 */
async function seedDatabase() {
  try {
    console.log('Seeding database with initial data...');
    
    // Check if any tokens already exist
    const existingTokens = await TokenData.countDocuments();
    
    if (existingTokens === 0) {
      console.log('Seeding tokens...');
      await TokenData.insertMany(tokens);
      console.log(`Added ${tokens.length} tokens`);
    } else {
      console.log(`Skipping token seeding, ${existingTokens} tokens already exist`);
    }
    
    // Check if any whale wallets already exist
    const existingWallets = await WhaleWallet.countDocuments();
    
    if (existingWallets === 0) {
      console.log('Seeding whale wallets...');
      await WhaleWallet.insertMany(whaleWallets);
      console.log(`Added ${whaleWallets.length} whale wallets`);
    } else {
      console.log(`Skipping whale wallet seeding, ${existingWallets} wallets already exist`);
    }
    
    // Create a demo user if none exists
    const existingUsers = await User.countDocuments();
    
    if (existingUsers === 0) {
      console.log('Creating demo user...');
      
      await User.create({
        username: 'demo',
        email: 'demo@example.com',
        password: 'password123',
        subscription: 'basic',
        watchlist: [
          'So11111111111111111111111111111111111111112', 
          'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263'
        ],
        trackedWallets: [
          'HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH'
        ]
      });
      
      console.log('Demo user created');
    } else {
      console.log(`Skipping user creation, ${existingUsers} users already exist`);
    }
    
    console.log('Database seeding completed successfully');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

module.exports = seedDatabase; 