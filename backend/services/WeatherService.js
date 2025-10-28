import axios from 'axios';
import WeatherData from '../models/WeatherData.js';
import dotenv from 'dotenv';
dotenv.config();

class WeatherService {
  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY || 'your_openweather_api_key_here';
    this.baseURL = 'https://api.openweathermap.org/data/2.5';
    this.karnatakaCities = {
      "davanagere": { lat: 14.4667, lng: 75.9167 },
      "harihara": { lat: 14.2800, lng: 75.9200 },
      "mahajanahalli": { lat: 14.3000, lng: 75.9500 },
      "dharwad": { lat: 15.4589, lng: 75.0078 },
      "hubli": { lat: 15.3647, lng: 75.1235 },
      "mysuru": { lat: 12.2958, lng: 76.6394 },
      "mysore": { lat: 12.2958, lng: 76.6394 },
      "mangalore": { lat: 12.9141, lng: 74.8560 },
      "belagavi": { lat: 15.8497, lng: 74.4977 },
      "belgaum": { lat: 15.8497, lng: 74.4977 },
      "tumakuru": { lat: 13.3409, lng: 77.1110 },
      "tumkur": { lat: 13.3409, lng: 77.1110 },
      "kalaburagi": { lat: 17.3297, lng: 76.8343 },
      "gulbarga": { lat: 17.3297, lng: 76.8343 },
      "shimoga": { lat: 13.9299, lng: 75.5681 },
      "shivamogga": { lat: 13.9299, lng: 75.5681 },
      "bengaluru": { lat: 12.9716, lng: 77.5946 },
      "bangalore": { lat: 12.9716, lng: 77.5946 },
      "hasan": { lat: 13.0067, lng: 76.0990 },
      "hassan": { lat: 13.0067, lng: 76.0990 },
      "chitradurga": { lat: 14.2250, lng: 76.3950 },
      "bellary": { lat: 15.1500, lng: 76.9333 },
      "bidar": { lat: 17.9229, lng: 77.5175 },
      "raichur": { lat: 16.2100, lng: 77.3550 },
      "kolar": { lat: 13.1333, lng: 78.1333 },
      "mandya": { lat: 12.5242, lng: 76.8958 },
      "udupi": { lat: 13.3389, lng: 74.7451 },
      "dakshina kannada": { lat: 12.8438, lng: 75.2479 }
    };
  }

  async getCurrentWeather(location) {
    try {
      let coordinates = location.coordinates;
      
      // If city name is provided, get coordinates
      if (location.city && !coordinates) {
        const cityCoords = this.getCityCoordinates(location.city);
        if (cityCoords) {
          coordinates = cityCoords;
        } else {
          throw new Error('City not found in Karnataka');
        }
      }

      if (!coordinates) throw new Error('Coordinates or city name are required');

      // If no API key, return mock data
      if (!this.apiKey || this.apiKey === 'your_openweather_api_key_here') {
        return this.getMockCurrentWeather(coordinates);
      }

      const response = await axios.get(`${this.baseURL}/weather`, {
        params: {
          lat: coordinates.lat,
          lon: coordinates.lng,
          appid: this.apiKey,
          units: 'metric',
          lang: 'en'
        }
      });

      return this.formatCurrentWeather(response.data);
    } catch (error) {
      console.error('Weather API Error:', error.response?.data || error.message);
      // Return mock data if API fails
      return this.getMockCurrentWeather(location.coordinates || { lat: 14.4667, lng: 75.9167 });
    }
  }

  async getWeatherForecast(location) {
    try {
      let coordinates = location.coordinates;
      
      if (location.city && !coordinates) {
        const cityCoords = this.getCityCoordinates(location.city);
        if (cityCoords) {
          coordinates = cityCoords;
        } else {
          throw new Error('City not found in Karnataka');
        }
      }

      if (!coordinates) throw new Error('Coordinates or city name are required');

      // If no API key, return mock data
      if (!this.apiKey || this.apiKey === 'your_openweather_api_key_here') {
        return this.getMockForecast(coordinates);
      }

      const response = await axios.get(`${this.baseURL}/forecast`, {
        params: {
          lat: coordinates.lat,
          lon: coordinates.lng,
          appid: this.apiKey,
          units: 'metric',
          lang: 'en'
        }
      });

      return this.formatForecast(response.data);
    } catch (error) {
      console.error('Weather Forecast API Error:', error.response?.data || error.message);
      // Return mock data if API fails
      return this.getMockForecast(location.coordinates || { lat: 14.4667, lng: 75.9167 });
    }
  }

  getCityCoordinates(cityName) {
    const normalizedCityName = cityName.toLowerCase().trim();
    return this.karnatakaCities[normalizedCityName] || null;
  }

  getAllKarnatakaCities() {
    return Object.keys(this.karnatakaCities).map(city => ({
      name: city.charAt(0).toUpperCase() + city.slice(1),
      coordinates: this.karnatakaCities[city]
    }));
  }

  formatCurrentWeather(data) {
    return {
      location: {
        city: data.name,
        country: data.sys.country,
        coordinates: { lat: data.coord.lat, lng: data.coord.lon }
      },
      current: {
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        windSpeed: data.wind.speed,
        windDirection: data.wind.deg,
        visibility: data.visibility / 1000,
        condition: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        rainfall: data.rain?.['1h'] || data.rain?.['3h'] || 0,
        cloudiness: data.clouds.all,
        sunrise: new Date(data.sys.sunrise * 1000),
        sunset: new Date(data.sys.sunset * 1000)
      },
      lastUpdated: new Date()
    };
  }

  formatForecast(data) {
    return data.list.slice(0, 8).map(item => ({
      date: new Date(item.dt * 1000),
      temperature: {
        min: Math.round(item.main.temp_min),
        max: Math.round(item.main.temp_max),
        day: Math.round(item.main.temp),
        night: Math.round(item.main.feels_like)
      },
      humidity: item.main.humidity,
      pressure: item.main.pressure,
      windSpeed: item.wind.speed,
      condition: item.weather[0].main,
      description: item.weather[0].description,
      icon: item.weather[0].icon,
      rainfall: item.rain?.['3h'] || 0,
      probability: Math.round((item.pop || 0) * 100)
    }));
  }

  // Mock data methods for demo
  getMockCurrentWeather(coordinates) {
    const cities = {
      "14.4667,75.9167": { city: "Davanagere", country: "India" },
      "12.9716,77.5946": { city: "Bengaluru", country: "India" },
      "15.3647,75.1235": { city: "Hubli", country: "India" },
      "12.2958,76.6394": { city: "Mysuru", country: "India" },
      "12.9141,74.8560": { city: "Mangalore", country: "India" },
      "15.8497,74.4977": { city: "Belagavi", country: "India" }
    };
    
    const locationKey = `${coordinates.lat.toFixed(4)},${coordinates.lng.toFixed(4)}`;
    const locationInfo = cities[locationKey] || { city: "Karnataka City", country: "India" };
    
    const temperature = Math.round(25 + Math.random() * 10);
    const humidity = Math.round(60 + Math.random() * 30);
    const conditions = ["Clear", "Clouds", "Rain"];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    
    return {
      location: locationInfo,
      current: {
        temperature: temperature,
        feelsLike: temperature + Math.round((Math.random() - 0.5) * 5),
        humidity: humidity,
        pressure: Math.round(1000 + Math.random() * 50),
        windSpeed: (Math.random() * 10).toFixed(1),
        windDirection: Math.round(Math.random() * 360),
        visibility: Math.round(5 + Math.random() * 5),
        condition: condition,
        description: this.getWeatherDescription(condition),
        icon: "01d",
        rainfall: condition === "Rain" ? Math.round(1 + Math.random() * 9) : 0,
        cloudiness: Math.round(Math.random() * 100),
        sunrise: new Date(Date.now() - 4 * 60 * 60 * 1000),
        sunset: new Date(Date.now() + 4 * 60 * 60 * 1000)
      },
      lastUpdated: new Date()
    };
  }

  getMockForecast(coordinates) {
    const forecast = [];
    for (let i = 0; i < 8; i++) {
      const date = new Date(Date.now() + i * 3 * 60 * 60 * 1000);
      const temp = Math.round(20 + Math.random() * 15);
      const conditions = ["Clear", "Clouds", "Rain"];
      const condition = conditions[Math.floor(Math.random() * conditions.length)];
      
      forecast.push({
        date: date,
        temperature: {
          min: temp - 5,
          max: temp + 5,
          day: temp,
          night: temp - 3
        },
        humidity: Math.round(50 + Math.random() * 40),
        pressure: Math.round(1000 + Math.random() * 50),
        windSpeed: (Math.random() * 15).toFixed(1),
        condition: condition,
        description: this.getWeatherDescription(condition),
        icon: "01d",
        rainfall: condition === "Rain" ? Math.round(Math.random() * 5) : 0,
        probability: condition === "Rain" ? Math.round(30 + Math.random() * 70) : Math.round(Math.random() * 30)
      });
    }
    return forecast;
  }

  getWeatherDescription(condition) {
    const descriptions = {
      "Clear": "clear sky",
      "Clouds": "scattered clouds",
      "Rain": "light rain",
      "Drizzle": "light intensity drizzle",
      "Thunderstorm": "thunderstorm with light rain"
    };
    return descriptions[condition] || "clear sky";
  }

  async saveWeatherData(weatherData) {
    try {
      const newData = new WeatherData(weatherData);
      await newData.save();
      return newData;
    } catch (err) {
      console.error('Error saving weather data:', err);
      // Don't throw error for demo purposes
      return weatherData;
    }
  }

  async getWeatherForIrrigation(location) {
    try {
      const [currentWeather, forecast] = await Promise.all([
        this.getCurrentWeather(location),
        this.getWeatherForecast(location)
      ]);

      const weatherData = { ...currentWeather, forecast };
      await this.saveWeatherData(weatherData);

      return weatherData;
    } catch (error) {
      console.error('Error getting weather for irrigation:', error);
      // Return mock data as fallback
      const currentWeather = this.getMockCurrentWeather(location.coordinates || { lat: 14.4667, lng: 75.9167 });
      const forecast = this.getMockForecast(location.coordinates || { lat: 14.4667, lng: 75.9167 });
      return { ...currentWeather, forecast };
    }
  }

  // Get weather analytics for dashboard
  async getWeatherAnalytics(location) {
    try {
      const [current, forecast] = await Promise.all([
        this.getCurrentWeather(location),
        this.getWeatherForecast(location)
      ]);

      const analytics = {
        current: current,
        forecast: forecast,
        statistics: {
          avgTemperature: Math.round(current.current.temperature),
          maxTemperature: Math.max(current.current.temperature, ...forecast.map(f => f.temperature.max)),
          minTemperature: Math.min(current.current.temperature, ...forecast.map(f => f.temperature.min)),
          totalRainfall: forecast.reduce((sum, f) => sum + f.rainfall, 0),
          rainProbability: Math.max(...forecast.map(f => f.probability)),
          windConditions: forecast.map(f => ({ speed: f.windSpeed, time: f.date }))
        },
        irrigationRecommendation: this.generateIrrigationRecommendation(current, forecast)
      };

      return analytics;
    } catch (error) {
      console.error('Error getting weather analytics:', error);
      // Return mock analytics as fallback
      const current = this.getMockCurrentWeather(location.coordinates || { lat: 14.4667, lng: 75.9167 });
      const forecast = this.getMockForecast(location.coordinates || { lat: 14.4667, lng: 75.9167 });
      
      return {
        current: current,
        forecast: forecast,
        statistics: {
          avgTemperature: Math.round(current.current.temperature),
          maxTemperature: Math.max(current.current.temperature, ...forecast.map(f => f.temperature.max)),
          minTemperature: Math.min(current.current.temperature, ...forecast.map(f => f.temperature.min)),
          totalRainfall: forecast.reduce((sum, f) => sum + f.rainfall, 0),
          rainProbability: Math.max(...forecast.map(f => f.probability))
        },
        irrigationRecommendation: this.generateIrrigationRecommendation(current, forecast)
      };
    }
  }

  generateIrrigationRecommendation(current, forecast) {
    const { temperature, humidity, rainfall, windSpeed } = current.current;
    const next24hRain = forecast.slice(0, 3).reduce((sum, f) => sum + f.rainfall, 0);
    
    let recommendation = '';
    let level = 'normal';
    let details = '';

    if (rainfall > 5 || next24hRain > 10) {
      recommendation = 'No irrigation needed - significant rainfall';
      level = 'very-low';
      details = `Current rain: ${rainfall}mm, Next 24h: ${next24hRain.toFixed(1)}mm`;
    } else if (temperature > 35 && humidity < 30) {
      recommendation = 'High irrigation - hot and dry conditions';
      level = 'high';
      details = `Temp: ${temperature}°C, Humidity: ${humidity}%`;
    } else if (temperature > 30 && windSpeed > 5) {
      recommendation = 'Moderate to high irrigation - windy conditions';
      level = 'medium-high';
      details = `Wind speed: ${windSpeed} m/s increases evaporation`;
    } else if (humidity > 80) {
      recommendation = 'Reduced irrigation - high humidity';
      level = 'low';
      details = `Humidity: ${humidity}% reduces evaporation`;
    } else {
      recommendation = 'Normal irrigation schedule';
      level = 'normal';
      details = 'Standard irrigation based on current conditions';
    }

    return { recommendation, level, details };
  }
}

export const weatherService = new WeatherService();