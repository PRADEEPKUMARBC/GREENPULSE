// import { weatherService } from '../utils/weatherAPI.js';
// import WeatherData from '../models/WeatherData.js';

// export const getCurrentWeather = async (req, res) => {
//   try {
//     const { lat, lng } = req.query;

//     if (!lat || !lng) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide coordinates (lat, lng)'
//       });
//     }

//     const location = { coordinates: { lat: parseFloat(lat), lng: parseFloat(lng) } };
//     const weatherData = await weatherService.getWeatherForIrrigation(location);

//     res.json({ success: true, weather: weatherData });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// export const getWeatherForecast = async (req, res) => {
//   try {
//     const { lat, lng } = req.query;

//     if (!lat || !lng) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide coordinates (lat, lng)'
//       });
//     }

//     const location = { coordinates: { lat: parseFloat(lat), lng: parseFloat(lng) } };
//     const forecast = await weatherService.getWeatherForecast(location);

//     res.json({ success: true, forecast });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };


// export const getWeatherHistory = async (req, res) => {
//   try {
//     const { lat, lng, days = 7 } = req.query;

//     if (!lat || !lng) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide coordinates (lat, lng)'
//       });
//     }

//     const startDate = new Date();
//     startDate.setDate(startDate.getDate() - parseInt(days));

//     const weatherHistory = await WeatherData.find({
//   'location.coordinates.lat': { $gte: parseFloat(lat) - 0.01, $lte: parseFloat(lat) + 0.01 },
//   'location.coordinates.lng': { $gte: parseFloat(lng) - 0.01, $lte: parseFloat(lng) + 0.01 },
//   lastUpdated: { $gte: startDate }
// }).sort({ lastUpdated: -1 });


//     res.json({
//       success: true,
//       weatherHistory
//     });

//   } catch (error) {
//     console.error('Get weather history error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching weather history'
//     });
//   }
// };

import { weatherService } from '../services/WeatherService.js';

export const getCurrentWeather = async (req, res) => {
  try {
    const { lat, lng, city } = req.query;

    if (!lat && !lng && !city) {
      return res.status(400).json({
        success: false,
        message: 'Either coordinates (lat, lng) or city name is required'
      });
    }

    const location = {
      ...(lat && lng && { coordinates: { lat: parseFloat(lat), lng: parseFloat(lng) } }),
      ...(city && { city: city })
    };

    const weatherData = await weatherService.getCurrentWeather(location);
    
    res.json({
      success: true,
      weather: weatherData,
      message: 'Current weather data fetched successfully'
    });
  } catch (error) {
    console.error('Get current weather error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch current weather data'
    });
  }
};

export const getWeatherForecast = async (req, res) => {
  try {
    const { lat, lng, city } = req.query;

    if (!lat && !lng && !city) {
      return res.status(400).json({
        success: false,
        message: 'Either coordinates (lat, lng) or city name is required'
      });
    }

    const location = {
      ...(lat && lng && { coordinates: { lat: parseFloat(lat), lng: parseFloat(lng) } }),
      ...(city && { city: city })
    };

    const forecast = await weatherService.getWeatherForecast(location);
    
    res.json({
      success: true,
      forecast: forecast,
      message: 'Weather forecast fetched successfully'
    });
  } catch (error) {
    console.error('Get weather forecast error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch weather forecast'
    });
  }
};

export const getWeatherHistory = async (req, res) => {
  try {
    const { lat, lng, city, days = 7 } = req.query;

    // For now, return recent weather data
    // In a real implementation, you'd query historical data
    const location = {
      ...(lat && lng && { coordinates: { lat: parseFloat(lat), lng: parseFloat(lng) } }),
      ...(city && { city: city })
    };

    const currentWeather = await weatherService.getCurrentWeather(location);
    
    res.json({
      success: true,
      history: [currentWeather], // Simplified - in real app, fetch from database
      message: 'Weather history fetched successfully'
    });
  } catch (error) {
    console.error('Get weather history error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch weather history'
    });
  }
};

export const getWeatherAnalytics = async (req, res) => {
  try {
    const { lat, lng, city } = req.query;

    if (!lat && !lng && !city) {
      return res.status(400).json({
        success: false,
        message: 'Either coordinates (lat, lng) or city name is required'
      });
    }

    const location = {
      ...(lat && lng && { coordinates: { lat: parseFloat(lat), lng: parseFloat(lng) } }),
      ...(city && { city: city })
    };

    const analytics = await weatherService.getWeatherAnalytics(location);
    
    res.json({
      success: true,
      analytics: analytics,
      message: 'Weather analytics fetched successfully'
    });
  } catch (error) {
    console.error('Get weather analytics error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch weather analytics'
    });
  }
};

export const getKarnatakaCities = async (req, res) => {
  try {
    const cities = weatherService.getAllKarnatakaCities();
    
    res.json({
      success: true,
      cities: cities,
      message: 'Karnataka cities list fetched successfully'
    });
  } catch (error) {
    console.error('Get cities error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch cities list'
    });
  }
};