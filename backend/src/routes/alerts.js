const express = require('express');
const alertController = require('../controllers/alertController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply auth middleware to all alert routes
router.use(protect);

// Get user's alerts
router.get('/', alertController.getAlerts);

// Mark alert as read
router.put('/:id/read', alertController.markAsRead);

// Mark all alerts as read
router.put('/read-all', alertController.markAllAsRead);

// Create custom alert
router.post('/custom', alertController.createCustomAlert);

// Delete alert
router.delete('/:id', alertController.deleteAlert);

// Delete all alerts
router.delete('/', alertController.deleteAllAlerts);

// Get alert settings
router.get('/settings', alertController.getSettings);

// Update alert setting
router.put('/settings/:id', alertController.updateSetting);

// Create alert setting
router.post('/settings', alertController.createSetting);

// Create custom alert setting
router.post('/settings/custom', alertController.createCustomSetting);

// Delete alert setting
router.delete('/settings/:id', alertController.deleteSetting);

module.exports = router;