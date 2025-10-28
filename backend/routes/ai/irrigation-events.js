import express from 'express';
import IrrigationEvent from '../../models/IrrigationEvent.js';

const router = express.Router();

// Log irrigation event when button is clicked
router.post('/log', async (req, res) => {
  try {
    const {
      userId,
      zone,
      duration,
      waterUsed,
      aiRecommended,
      aiConfidence,
      soilMoisture,
      temperature,
      humidity,
      reason,
      hardwareCommand
    } = req.body;

    console.log('📝 Logging irrigation event to database');

    const irrigationEvent = new IrrigationEvent({
      userId: userId || 'default-user',
      zone,
      duration,
      waterUsed,
      aiRecommended,
      aiConfidence,
      sensorData: {
        soilMoisture,
        temperature,
        humidity
      },
      reason,
      hardwareCommand: true, // Mark as hardware event
      timestamp: new Date()
    });

    await irrigationEvent.save();

    console.log('✅ Irrigation event saved to MongoDB:', irrigationEvent._id);

    res.json({
      success: true,
      message: 'Irrigation event logged successfully',
      eventId: irrigationEvent._id
    });
  } catch (error) {
    console.error('❌ Database log error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to log irrigation event: ' + error.message
    });
  }
});

// Get irrigation history
router.get('/history', async (req, res) => {
  try {
    const { limit = 50, page = 1 } = req.query;
    
    const events = await IrrigationEvent.find()
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await IrrigationEvent.countDocuments();

    res.json({
      success: true,
      data: events,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('❌ Irrigation history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get irrigation history: ' + error.message
    });
  }
});

// Get irrigation statistics
router.get('/stats', async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const stats = await IrrigationEvent.aggregate([
      {
        $match: {
          timestamp: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: null,
          totalWaterUsed: { $sum: '$waterUsed' },
          totalDuration: { $sum: '$duration' },
          totalEvents: { $sum: 1 },
          avgWaterPerEvent: { $avg: '$waterUsed' },
          avgDuration: { $avg: '$duration' }
        }
      }
    ]);

    res.json({
      success: true,
      data: stats[0] || {
        totalWaterUsed: 0,
        totalDuration: 0,
        totalEvents: 0,
        avgWaterPerEvent: 0,
        avgDuration: 0
      }
    });
  } catch (error) {
    console.error('❌ Irrigation stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get irrigation statistics: ' + error.message
    });
  }
});

export default router;