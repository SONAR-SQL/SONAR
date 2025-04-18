const WhaleWallet = require('../models/WhaleWallet');
const WhaleActivity = require('../models/WhaleActivity');
const User = require('../models/User');

// Get top whale wallets
exports.getTopWhales = async (req, res, next) => {
  try {
    // Sort by total value to get top 20 wallets
    const wallets = await WhaleWallet.find()
      .sort({ totalValue: -1 })
      .limit(20)
      .lean();

    res.status(200).json({
      success: true,
      wallets: wallets.map(wallet => ({
        ...wallet,
        recentActivities: [] // In a real project, can join with recent activities
      })),
    });
  } catch (error) {
    next(error);
  }
};

// Get recent whale activities
exports.getRecentActivities = async (req, res, next) => {
  try {
    // Calculate time 24 hours ago
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    // Get recent activities, sorted by time in descending order
    const activities = await WhaleActivity.find({
      timestamp: { $gte: oneDayAgo },
      amount: { $gte: 10000 } // Minimum $10,000 transactions
    })
      .sort({ timestamp: -1 })
      .limit(50)
      .lean();

    res.status(200).json({
      success: true,
      activities,
    });
  } catch (error) {
    next(error);
  }
};

// Track wallet
exports.trackWallet = async (req, res, next) => {
  try {
    const { address } = req.body;
    
    if (!address) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address is required',
      });
    }
    
    // Check if wallet exists
    let wallet = await WhaleWallet.findOne({ address });
    
    if (!wallet) {
      // If not exists, create new wallet record
      wallet = await WhaleWallet.create({
        address,
        tags: ['User Added'],
        lastActive: new Date(),
        totalValue: 0, // In a real project, would get balance from blockchain
      });
    }
    
    // Update user's tracked wallets list
    if (req.user) {
      await User.findByIdAndUpdate(
        req.user._id,
        { $addToSet: { trackedWallets: address } },
        { new: true }
      );
    }
    
    res.status(200).json({
      success: true,
      wallet,
    });
  } catch (error) {
    next(error);
  }
};

// Get wallet details
exports.getWalletDetail = async (req, res, next) => {
  try {
    const { address } = req.params;
    
    const wallet = await WhaleWallet.findOne({ address });
    
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found',
      });
    }
    
    // Get wallet's recent activities
    const activities = await WhaleActivity.find({ address })
      .sort({ timestamp: -1 })
      .limit(20)
      .lean();
    
    res.status(200).json({
      success: true,
      wallet: {
        ...wallet.toObject(),
        recentActivities: activities,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get user tracked wallets
exports.getTrackedWallets = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user.trackedWallets || user.trackedWallets.length === 0) {
      return res.status(200).json({
        success: true,
        wallets: [],
      });
    }
    
    const wallets = await WhaleWallet.find({
      address: { $in: user.trackedWallets },
    }).lean();
    
    res.status(200).json({
      success: true,
      wallets,
    });
  } catch (error) {
    next(error);
  }
};

// Untrack wallet
exports.untrackWallet = async (req, res, next) => {
  try {
    const { address } = req.params;
    const userId = req.user._id;
    
    if (!address) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address is required'
      });
    }
    
    // Remove from user's tracked wallets
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { trackedWallets: address } },
      { new: true }
    ).select('trackedWallets');
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      trackedWallets: updatedUser.trackedWallets,
      message: 'Wallet removed from tracking list'
    });
  } catch (error) {
    next(error);
  }
}; 