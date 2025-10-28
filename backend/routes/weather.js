// import express from 'express';
// import { getCurrentWeather, getWeatherForecast, getWeatherHistory } from '../controllers/weatherController.js';
// import { authenticate } from '../middleware/auth.js';

// const router = express.Router();
// router.use(authenticate);

// router.get('/current', getCurrentWeather);
// router.get('/forecast', getWeatherForecast);
// router.get('/history', getWeatherHistory);

// export default router;


import express from 'express';
import { 
  getCurrentWeather, 
  getWeatherForecast, 
  getWeatherHistory,
  getWeatherAnalytics,
  getKarnatakaCities
} from '../controllers/weatherController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/current', getCurrentWeather);
router.get('/forecast', getWeatherForecast);
router.get('/history', getWeatherHistory);
router.get('/analytics', getWeatherAnalytics);
router.get('/cities', getKarnatakaCities);

export default router;