import express from 'express';
import irrigationRoutes from './irrigation.js';

const router = express.Router();

// Use the irrigation routes
router.use('/irrigation', irrigationRoutes);

export default router;