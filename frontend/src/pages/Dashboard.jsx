import React from "react";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";
import SensorCard from "../components/SensorCard";
import AIAdviceCard from "../components/AIAdviceCard";
import ChartComponent from "../components/ChartComponent";
import IrrigationControl from "../components/IrrigationControl";
import WeatherForecast from "../components/WeatherForecast";
import { io } from "socket.io-client";
import { motion } from "framer-motion";


// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1
    }
  }
};



const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

// Custom hook for scroll animations
const useScrollAnimation = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  return { ref, inView };
};

function Dashboard() {
  const { axios, user } = useAppContext();
  const [dashboardData, setDashboardData] = useState(null);
  const [aiRecommendations, setAiRecommendations] = useState(null);
  
  // Sensor data state
  const [sensorData, setSensorData] = useState({
    soilMoisture: null,
    temperature: null,
    humidity: null,
    soilStatus: "Waiting for Arduino..."
  });

  // Weather state
  const [currentWeather, setCurrentWeather] = useState({
    temperature: null,
    humidity: null,
    condition: null,
    city: null,
    loading: true,
    lastUpdated: null,
    isFallback: false
  });

    const [aiAdvice, setAIAdvice] = useState({
    advice: "Waiting for live data...",
    confidence: null,
    priority: "low",
  });
  
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [irrigationLoading, setIrrigationLoading] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [socketConnected, setSocketConnected] = useState(false);

  const headerSection = useScrollAnimation();
  const sensorSection = useScrollAnimation();
  const mainSection = useScrollAnimation();

  // ✅ FIXED SOCKET.IO CONNECTION - CORRECT EVENT NAME
  // useEffect(() => {
  //   console.log("🚀 Initializing Socket.IO connection to port 3003...");
    
  //   const socket = io("http://localhost:3003", {
  //     transports: ["websocket", "polling"],
  //     reconnectionAttempts: 10,
  //     reconnectionDelay: 3000,
  //     timeout: 10000
  //   });

  //   // Connection events
  //   socket.on("connect", () => {
  //     console.log("✅ Connected to Arduino backend:", socket.id);
  //     setSocketConnected(true);
  //     toast.success("Connected to Arduino in real-time! 🚀");
  //   });

  //   socket.on("disconnect", (reason) => {
  //     console.log("❌ Disconnected from Arduino backend:", reason);
  //     setSocketConnected(false);
  //     toast.error("Disconnected from Arduino");
  //   });

  //   socket.on("connect_error", (error) => {
  //     console.error("❌ Socket connection error:", error);
  //     setSocketConnected(false);
  //     toast.error("Failed to connect to Arduino backend");
  //   });

  //   // ✅ CRITICAL FIX: Listening for the CORRECT event name "moisture-status"
  //   socket.on("moisture-status", (data) => {
  //     console.log("💧 REAL ARDUINO DATA RECEIVED:", data);
      
  //     // Update sensor data with REAL Arduino values
  //     setSensorData(prev => ({
  //       soilMoisture: data.moisturePercent !== undefined ? data.moisturePercent : prev.soilMoisture,
  //       temperature: data.temperature !== undefined ? data.temperature : prev.temperature,
  //       humidity: data.humidity !== undefined ? data.humidity : prev.humidity,
  //       soilStatus: data.status || data.soilStatus || getSoilStatusFromValue(data.moisturePercent) || prev.soilStatus
  //     }));

  //     // Show toast for new data
  //     if (data.moisturePercent !== undefined) {
  //       toast.success(`Arduino: ${data.moisturePercent}% - ${data.status || getSoilStatusFromValue(data.moisturePercent)}`, {
  //         icon: '💧',
  //         duration: 3000
  //       });
  //     }
  //   });

  //   // Handle other potential events
  //   socket.on("sensorData", (data) => {
  //     console.log("📡 Additional sensor data:", data);
  //     if (data && typeof data === 'object') {
  //       setSensorData(prev => ({
  //         ...prev,
  //         soilMoisture: data.moisturePercent !== undefined ? data.moisturePercent : prev.soilMoisture,
  //         temperature: data.temperature !== undefined ? data.temperature : prev.temperature,
  //         humidity: data.humidity !== undefined ? data.humidity : prev.humidity,
  //         soilStatus: data.status || prev.soilStatus
  //       }));
  //     }
  //   });

  //   // Log all events for debugging
  //   socket.onAny((eventName, data) => {
  //     if (eventName !== 'moisture-status' && eventName !== 'sensorData') {
  //       console.log(`🎯 OTHER EVENT: ${eventName}`, data);
  //     }
  //   });

  //   // Cleanup on component unmount
  //   return () => {
  //     console.log("🧹 Cleaning up socket connection");
  //     socket.disconnect();
  //   };
  // }, []);

    const handleDataUpdate = (newData) => {
    setSensorData({
      soilMoisture: newData.moisturePercent,
      status:
        newData.soilStatus?.toLowerCase() === "dry"
          ? "critical"
          : newData.soilStatus?.toLowerCase() === "moist"
          ? "optimal"
          : newData.soilStatus?.toLowerCase() === "wet"
          ? "warning"
          : "no-data",
    });
  };


  useEffect(() => {
  const socket = io("http://localhost:3003"); // backend port

  socket.on("moisture-status", (data) => {
    setSensorData({
      soilMoisture: data.soilMoisture,
      status: data.status,
    });
  });

  socket.on("connect", () => setSocketConnected(true));
  socket.on("disconnect", () => setSocketConnected(false));

  return () => socket.disconnect();
}, []);


  // Helper function to get soil status from value
  const getSoilStatusFromValue = (moisture) => {
    if (moisture === null || moisture === undefined) return "NO DATA";
    if (moisture === 0) return "CRITICAL DRY";
    if (moisture < 30) return "DRY";
    if (moisture < 60) return "MOIST";
    return "WET";
  };

  // Debug sensor data changes
  useEffect(() => {
    console.log("📊 SENSOR DATA UPDATED:", sensorData);
  }, [sensorData]);

  // Remove fallback data - COMMENT THIS OUT TO SEE REAL ARDUINO DATA
  // useEffect(() => {
  //   if (!socketConnected) {
  //     const fallbackInterval = setInterval(() => {
  //       console.log("🔄 Using fallback data (Arduino not connected)");
  //       setSensorData(prev => ({
  //         soilMoisture: prev.soilMoisture !== null ? prev.soilMoisture : Math.floor(Math.random() * 30) + 40,
  //         temperature: prev.temperature !== null ? prev.temperature : Math.floor(Math.random() * 10) + 25,
  //         humidity: prev.humidity !== null ? prev.humidity : Math.floor(Math.random() * 30) + 50,
  //         soilStatus: prev.soilStatus !== "Waiting for Arduino..." ? prev.soilStatus : "MOIST"
  //       }));
  //     }, 5000);
  //     return () => clearInterval(fallbackInterval);
  //   }
  // }, [socketConnected]);

  // Helper functions for sensor status
  const getMoistureStatus = (moisture) => {
    if (moisture === null || moisture === undefined) return "no-data";
    if (moisture >= 40 && moisture <= 70) return "optimal";
    if (moisture < 40) return "critical";
    return "warning";
  };

  const getMoisturePrediction = (moisture) => {
    if (moisture === null) return "No data received yet.";
    if (moisture < 30) return "💧 Soil is dry — start irrigation soon!";
    if (moisture > 70) return "🌧️ Soil too wet — turn off irrigation!";
    return "🌱 Moisture level is optimal.";
  };

  const getTemperatureStatus = (temp) => {
    if (!temp) return "optimal";
    if (temp < 15) return "warning";
    if (temp > 35) return "warning";
    return "optimal";
  };

  const getTemperaturePrediction = (temp) => {
    if (!temp) return "Normal";
    if (temp > 30) return "High evaporation";
    return "Normal";
  };

  const getHumidityStatus = (humidity) => {
    if (!humidity) return "optimal";
    if (humidity < 40) return "warning";
    if (humidity > 85) return "warning";
    return "optimal";
  };

  const getHumidityPrediction = (humidity) => {
    if (!humidity) return "Optimal";
    if (humidity < 50) return "Low humidity";
    return "Optimal";
  };

  // SMART IRRIGATION RECOMMENDATION
  const getIrrigationRecommendation = () => {
    const { soilMoisture, temperature, humidity } = sensorData;
    
    console.log("🤖 Calculating irrigation recommendation:", { soilMoisture, temperature, humidity });
    
    // Handle no data case
    if (soilMoisture === null || soilMoisture === undefined) {
      return {
        shouldIrrigate: false,
        priority: "low",
        message: "Waiting for Arduino data...",
        reason: "No sensor data available"
      };
    }
    
    // Primary factor: Soil Moisture
    if (soilMoisture < 40) {
      return {
        shouldIrrigate: true,
        priority: "high",
        message: "CRITICAL: Soil is too dry. Immediate irrigation required.",
        reason: `Soil moisture (${soilMoisture}%) is below critical level (40%)`
      };
    }
    
    if (soilMoisture > 85) {
      return {
        shouldIrrigate: false,
        priority: "high",
        message: "WARNING: Soil is too wet. Stop irrigation to prevent waterlogging.",
        reason: `Soil moisture (${soilMoisture}%) is above optimal level (85%)`
      };
    }

    if (soilMoisture >= 60 && soilMoisture <= 85) {
      return {
        shouldIrrigate: false,
        priority: "low",
        message: "OPTIMAL: Soil moisture levels are perfect. No irrigation needed.",
        reason: `Soil moisture (${soilMoisture}%) is within optimal range (60-85%)`
      };
    }

    // Soil moisture is between 40-59% - check temperature and humidity
    if (temperature > 30 && humidity < 50) {
      return {
        shouldIrrigate: true,
        priority: "medium",
        message: "RECOMMENDED: Hot & dry conditions. Irrigation advised to prevent stress.",
        reason: `High temperature (${temperature}°C) and low humidity (${humidity}%) with moderate soil moisture (${soilMoisture}%)`
      };
    }

    if (temperature < 15 || humidity > 80) {
      return {
        shouldIrrigate: false,
        priority: "medium",
        message: "HOLD: Cool/humid conditions. Delay irrigation to prevent issues.",
        reason: `Temperature (${temperature}°C) and humidity (${humidity}%) conditions not favorable for irrigation`
      };
    }

    // Default for 40-59% soil moisture
    return {
      shouldIrrigate: false,
      priority: "medium",
      message: "MONITOR: Soil moisture is moderate. Monitor conditions closely.",
      reason: `Soil moisture (${soilMoisture}%) requires monitoring with current temperature (${temperature}°C) and humidity (${humidity}%)`
    };
  };

  // Calculate water requirement based on conditions
  const calculateWaterRequirement = () => {
    const { soilMoisture, temperature, humidity } = sensorData;
    
    // Default if no data
    if (soilMoisture === null) return 450;
    
    let baseWater = 450;
    
    if (soilMoisture < 40) {
      baseWater = 600;
    } else if (soilMoisture < 60) {
      baseWater = 500;
    } else {
      baseWater = 300;
    }
    
    if (temperature > 30) {
      baseWater *= 1.3;
    } else if (temperature < 15) {
      baseWater *= 0.7;
    }
    
    if (humidity < 40) {
      baseWater *= 1.2;
    } else if (humidity > 80) {
      baseWater *= 0.8;
    }
    
    return Math.round(baseWater);
  };

  // Sensor cards configuration
  const sensorCards = [
    // {
    //   title: "Soil Moisture",
    //   value: sensorData.soilMoisture !== null ? `${sensorData.soilMoisture}%` : "NO DATA",
    //   optimal: "40-70%",
    //   status: getMoistureStatus(sensorData.soilMoisture),
    //   icon: "💧",
    //   aiPrediction: getMoisturePrediction(sensorData.soilMoisture),
    //   description: socketConnected ? "Live from Arduino sensor" : "Arduino disconnected",
    //   trend: socketConnected && sensorData.soilMoisture !== null ? "live" : "offline",
    //   lastUpdated: socketConnected ? "Real-time" : "Disconnected",
    //   liveData: socketConnected && sensorData.soilMoisture !== null
    // },

    

    {
  title: "Soil Moisture",
  value: sensorData.soilMoisture !== null ? `${sensorData.soilMoisture}%` : "NO DATA",
  optimal: "40-70%",
  status: sensorData.status || "UNKNOWN",
  icon: "💧",
  aiPrediction: getMoisturePrediction(sensorData.soilMoisture),
  description: socketConnected ? "Live from Arduino sensor" : "Arduino disconnected",
  trend: socketConnected && sensorData.soilMoisture !== null ? "live" : "offline",
  lastUpdated: socketConnected ? "Real-time" : "Disconnected",
  liveData: socketConnected && sensorData.soilMoisture !== null
},
    { 
      title: "Temperature", 
      value: `${currentWeather.temperature !== null ? currentWeather.temperature : sensorData.temperature !== null ? sensorData.temperature : "-"}°C`, 
      optimal: "20-30°C", 
      status: getTemperatureStatus(currentWeather.temperature || sensorData.temperature), 
      icon: "🌡️",
      aiPrediction: getTemperaturePrediction(currentWeather.temperature || sensorData.temperature),
      description: "Current air temperature",
      trend: (currentWeather.temperature || sensorData.temperature) > 30 ? "high" : "stable",
      lastUpdated: currentWeather.lastUpdated || "Just now"
    },
    { 
      title: "Humidity", 
      value: `${currentWeather.humidity !== null ? currentWeather.humidity : sensorData.humidity !== null ? sensorData.humidity : "-"}%`, 
      optimal: "40-80%", 
      status: getHumidityStatus(currentWeather.humidity || sensorData.humidity), 
      icon: "💨",
      aiPrediction: getHumidityPrediction(currentWeather.humidity || sensorData.humidity),
      description: "Current air humidity",
      trend: (currentWeather.humidity || sensorData.humidity) > 80 ? "high" : "optimal",
      lastUpdated: currentWeather.lastUpdated || "Just now"
    }
  ];

  // Get current irrigation recommendation
  const currentIrrigation = getIrrigationRecommendation();
  const calculatedWaterRequirement = calculateWaterRequirement();

  // AI Advice functions
  const generateAdvice = (moisturePercent, soilStatus) => {
    if (!soilStatus || moisturePercent == null) return "Waiting for Arduino data...";

    if ((soilStatus === "DRY" || soilStatus === "dry" || soilStatus === "CRITICAL DRY") && moisturePercent < 40) {
      return "Soil is dry. Irrigation recommended immediately.";
    } 
    if ((soilStatus === "MOIST" || soilStatus === "moist") || (moisturePercent >= 40 && moisturePercent <= 70)) {
      return "Soil moisture is optimal. No irrigation needed.";
    } 
    if ((soilStatus === "WET" || soilStatus === "wet") || moisturePercent > 70) {
      return "Soil is wet. Skip irrigation to avoid waterlogging.";
    }

    return "Analyzing soil conditions...";
  };

  const generateConfidence = (moisturePercent) => {
    if (moisturePercent == null) return "85%";
    if (moisturePercent < 20 || moisturePercent > 80) return "95%";
    if (moisturePercent < 40 || moisturePercent > 60) return "75%";
    return "85%";
  };

  const generatePriority = (moisturePercent, soilStatus) => {
    if ((soilStatus === "DRY" || soilStatus === "dry" || soilStatus === "CRITICAL DRY") || moisturePercent < 40) return "high";
    if ((soilStatus === "MOIST" || soilStatus === "moist") || (moisturePercent >= 40 && moisturePercent <= 70)) return "low";
    if ((soilStatus === "WET" || soilStatus === "wet") || moisturePercent > 70) return "medium";
    return "low";
  };

  // Weather functions (keep existing)
  const getLiveWeatherData = async (lat, lng) => {
    try {
      const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
      if (!API_KEY) {
        return getFallbackWeatherData();
      }

      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${API_KEY}`;
      const response = await fetch(url);
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();

      return {
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        condition: data.weather[0].main,
        city: data.name,
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      console.error("❌ OpenWeather API error:", err);
      return getFallbackWeatherData();
    }
  };

  const getFallbackWeatherData = () => {
    return {
      temperature: 28 + Math.round((Math.random() - 0.5) * 10),
      humidity: 60 + Math.round((Math.random() - 0.5) * 30),
      condition: "Clear",
      city: "Your Location",
      timestamp: new Date().toISOString(),
      isFallback: true
    };
  };

  const getCurrentLocation = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({ lat: 14.4667, lng: 75.9167 });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          resolve({ lat: 14.4667, lng: 75.9167 });
        }
      );
    });
  };

  const fetchCurrentWeather = async () => {
    try {
      setCurrentWeather(prev => ({ ...prev, loading: true }));
      const userLocation = await getCurrentLocation();
      const weather = await getLiveWeatherData(userLocation.lat, userLocation.lng);
      
      setCurrentWeather({
        temperature: weather.temperature,
        humidity: weather.humidity,
        condition: weather.condition,
        city: weather.city,
        loading: false,
        lastUpdated: new Date().toLocaleTimeString(),
        isFallback: weather.isFallback || false
      });

      // Update sensor data with weather info
      setSensorData(prev => ({
        ...prev,
        temperature: weather.temperature,
        humidity: weather.humidity
      }));

    } catch (error) {
      console.error("❌ Error fetching current weather:", error);
      setCurrentWeather(prev => ({ 
        ...prev, 
        loading: false,
        isFallback: true 
      }));
    }
  };

  // Initial data loading
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        await fetchCurrentWeather();
        await fetchChartData();
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const fetchChartData = async () => {
    try {
      const moistureData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'Soil Moisture %',
            data: [65, 62, 58, 70, 68, 72, 65],
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            tension: 0.4
          }
        ]
      };

      const waterData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'Water Usage (L)',
            data: [450, 420, 380, 500, 480, 520, 450],
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 2
          }
        ]
      };

      setChartData({ moisture: moistureData, water: waterData });
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  const handleRefreshWeather = () => {
    fetchCurrentWeather();
    toast.success("Weather data refreshed!");
  };

  const handleStartIrrigation = async () => {
    try {
      setIrrigationLoading(true);
      const irrigationRec = getIrrigationRecommendation();
      
      if (!irrigationRec.shouldIrrigate) {
        toast.error("Irrigation not recommended based on current conditions");
        setIrrigationLoading(false);
        return;
      }

      // Simulate irrigation start
      setTimeout(() => {
        toast.success("🚀 Irrigation started successfully!");
        setIrrigationLoading(false);
      }, 2000);

    } catch (error) {
      console.error('❌ Irrigation start error:', error);
      toast.error("Failed to start irrigation");
      setIrrigationLoading(false);
    }
  };

  const weatherData = [
    { day: "Today", temp: `${currentWeather.temperature || 28}°C`, condition: currentWeather.condition || "Sunny", rain: "0%", icon: "☀️" },
    { day: "Tomorrow", temp: "26°C", condition: "Cloudy", rain: "30%", icon: "⛅" },
    { day: "Wed", temp: "24°C", condition: "Rain", rain: "80%", icon: "🌧️" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full mx-auto mb-4"
          />
          <h2 className="text-xl font-semibold text-green-700">Loading Dashboard...</h2>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50"
    >
      {/* Header Section */}
      <motion.section
        ref={headerSection.ref}
        variants={containerVariants}
        className="bg-white shadow-sm border-b"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <motion.div variants={itemVariants}>
              <h1 className="text-3xl lg:text-4xl font-bold text-green-700">
                Smart Farm Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                AI-Powered Irrigation System
              </p>
              
              {/* Data Source Indicator */}
              <div className="flex items-center gap-3 mt-3">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  socketConnected && sensorData.soilMoisture !== null 
                    ? 'bg-green-100 text-green-800 border border-green-300' 
                    : 'bg-red-100 text-red-800 border border-red-300'
                }`}>
                  {socketConnected && sensorData.soilMoisture !== null 
                    ? `✅ Live Arduino Data: ${sensorData.soilMoisture}%` 
                    : '❌ No Arduino Data'}
                </div>
                
                {sensorData.soilMoisture === 0 && (
                  <div className="px-3 py-1 rounded-full bg-red-100 text-red-800 border border-red-300 text-sm font-medium">
                    ⚠️ Arduino Reading: 0% (Check Sensor)
                  </div>
                )}
              </div>
            </motion.div>

            {/* Socket Connection Status */}
            <motion.div variants={itemVariants} className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Current Field</p>
                <p className="font-semibold text-green-700">North Field - Corn</p>
                <p className={`text-xs ${currentIrrigation.shouldIrrigate ? 'text-red-600' : 'text-green-600'} flex items-center gap-1`}>
                  <span>💧</span> 
                  {currentIrrigation.shouldIrrigate ? 'Irrigation Recommended' : 'Optimal Conditions'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Soil: {sensorData.soilMoisture !== null ? `${sensorData.soilMoisture}%` : '---'} - {sensorData.soilStatus}
                </p>
                <p className={`text-xs ${socketConnected ? 'text-green-600' : 'text-red-600'} flex items-center gap-1`}>
                  <div className={`w-2 h-2 rounded-full ${socketConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                  {socketConnected ? 'Arduino Connected' : 'Arduino Disconnected'}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🌽</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions Bar */}
        <motion.section variants={containerVariants} className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-wrap gap-4 justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span>⚡</span>
                Smart Irrigation Actions
              </h3>
              <div className="flex flex-wrap gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRefreshWeather}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm"
                >
                  <span>🌤️</span>
                  Refresh Weather
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStartIrrigation}
                  disabled={irrigationLoading || !currentIrrigation.shouldIrrigate}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2 text-sm"
                >
                  {irrigationLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      Starting...
                    </>
                  ) : (
                    <>
                      <span>🚰</span>
                      Start Irrigation
                    </>
                  )}
                </motion.button>

                {/* Socket Status Indicator */}
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  socketConnected ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'
                }`}>
                  <div className={`w-3 h-3 rounded-full ${socketConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                  <span className="text-sm font-medium">
                    {socketConnected ? 'Arduino Live' : 'Arduino Offline'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Sensor Cards Section */}
        <motion.section
          ref={sensorSection.ref}
          variants={containerVariants}
          className="mb-12"
        >
          <div className="flex justify-between items-center mb-8">
            <motion.h2 
              variants={itemVariants}
              className="text-2xl font-bold text-green-800"
            >
              Real-time Sensor Data
            </motion.h2>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Live Arduino Data
            </div>
          </div>
          
          {/* THREE SENSOR CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sensorCards.map((sensor, index) => (
              <motion.div
                key={sensor.title}
                variants={itemVariants}
                custom={index}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <SensorCard 
                  title={sensor.title}
                  value={sensor.value}
                  optimal={sensor.optimal}
                  status={sensor.status}
                  icon={sensor.icon}
                  aiPrediction={sensor.aiPrediction}
                  liveData={sensor.liveData}
                  description={sensor.description}
                  trend={sensor.trend}
                  lastUpdated={sensor.lastUpdated}
                />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Main Dashboard Grid */}
        <motion.section
          ref={mainSection.ref}
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
        >
          {/* Left Column - AI Advice & Control */}
          <motion.div variants={itemVariants} className="space-y-8">
            {/* ✅ AI Advice Card */}
      {/* <AIAdviceCard
        advice={aiAdvice.advice}
        confidence={aiAdvice.confidence}
        priority={aiAdvice.priority}
        aiPowered={true}
        loading={false}
        onGetRecommendation={() => {
          alert("🔍 Running AI analysis again...");
        }}
      /> */}

      <AIAdviceCard
  sensorData={sensorData}
  aiPowered={true}
/>

            
            <IrrigationControl 
              status={currentIrrigation.shouldIrrigate ? "recommended" : "auto"}
              nextSchedule={currentIrrigation.shouldIrrigate ? "Immediately" : "Not needed"}
              duration="30 minutes"
              zone="North Field"
              waterAmount={`${calculatedWaterRequirement}L`}
              efficiency="85%"
              aiEnabled={true}
              onStartNow={handleStartIrrigation}
              loading={irrigationLoading}
              disabled={!currentIrrigation.shouldIrrigate}
              showStartButton={currentIrrigation.shouldIrrigate}
            />
          </motion.div>

          {/* Right Column - Weather & Quick Stats */}
          <motion.div variants={itemVariants} className="space-y-8">
            <WeatherForecast data={weatherData} />
            
            {/* Smart Irrigation Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span>💧</span>
                Smart Irrigation Stats
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {calculatedWaterRequirement}L
                  </div>
                  <div className="text-sm text-blue-800">Water Required</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {currentIrrigation.shouldIrrigate ? 'Yes' : 'No'}
                  </div>
                  <div className="text-sm text-green-800">Irrigation Needed</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {sensorData.soilMoisture !== null ? `${sensorData.soilMoisture}%` : '---'}
                  </div>
                  <div className="text-sm text-yellow-800">Soil Moisture</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {currentIrrigation.priority}
                  </div>
                  <div className="text-sm text-purple-800">Priority</div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Reason:</strong> {currentIrrigation.reason}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Charts Section */}
        {chartData && (
          <motion.section variants={containerVariants} className="mb-12">
            <motion.h2 
              variants={itemVariants}
              className="text-2xl font-bold text-green-800 mb-8"
            >
              Field Analytics
            </motion.h2>
            <div className="grid grid-cols-1 gap-8">
              <motion.div variants={itemVariants}>
                <ChartComponent 
                  title="Soil Moisture Trends (Last 7 Days)"
                  type="line"
                  data={chartData.moisture}
                />
              </motion.div>
            </div>
          </motion.section>
        )}
      </div>
    </motion.div>
  );
}

export default Dashboard;