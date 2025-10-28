import express from 'express';
import { getLatestMoisture } from '../controllers/moistureController.js';

const router = express.Router();

router.get('/moisture', getLatestMoisture);

export default router;
