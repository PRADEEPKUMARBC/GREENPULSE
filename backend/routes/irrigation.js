// irrigationRoutes.js
import express from 'express';
import { 
  startIrrigation,
  stopIrrigation,
  getIrrigationHistory,
  getIrrigationStats,
  emergencyStopAll,
  getActiveIrrigations,
  getLatestMoisture
} from '../controllers/irrigationController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All irrigation routes are protected
router.use(authenticate);

router.get('/history', getIrrigationHistory);
router.get('/stats', getIrrigationStats);
router.get('/active', getActiveIrrigations);
router.post('/emergency-stop', emergencyStopAll);
router.post('/:deviceId/start', startIrrigation);
router.post('/:deviceId/stop', stopIrrigation);

// ✅ Add new endpoint for moisture
router.get('/moisture', async (req, res) => {
  try {
    const moisture = await getLatestMoisture(); // implement in controller
    res.json({ moisture });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch moisture' });
  }
});

export default router;
