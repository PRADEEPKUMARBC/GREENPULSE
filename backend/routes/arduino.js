// // routes/arduino.js - ESM MODULE VERSION
// import express from 'express';

// const router = express.Router();

// // Store the latest Arduino data
// let latestArduinoData = {
//   soilStatus: "UNKNOWN",
//   moisturePercent: 50,
//   temperature: 28,
//   humidity: 70,
//   raw: "No data received yet"
// };

// // Process Arduino data - IMPROVED
// function processArduinoData(arduinoData) {
//   console.log('🔄 Processing Arduino data:', arduinoData);
  
//   let soilStatus = "UNKNOWN";
//   let moisturePercent = 50;
//   let rawValue = 0;

//   // Case 1: Arduino sends status directly
//   if (arduinoData.status) {
//     soilStatus = arduinoData.status.toUpperCase();
//     moisturePercent = getMoistureFromStatus(soilStatus);
//   }
//   // Case 2: Arduino sends raw string with status info
//   else if (arduinoData.raw) {
//     const raw = arduinoData.raw.toUpperCase();
    
//     if (raw.includes('WET') || raw.includes('SOIL IS WET')) {
//       soilStatus = "WET";
//     } else if (raw.includes('DRY') || raw.includes('SOIL IS DRY')) {
//       soilStatus = "DRY";
//     } else if (raw.includes('MOIST') || raw.includes('SOIL IS MOIST')) {
//       soilStatus = "MOIST";
//     }
    
//     moisturePercent = getMoistureFromStatus(soilStatus);
    
//     // Extract numeric value if present
//     const numberMatch = arduinoData.raw.match(/\d+/);
//     rawValue = numberMatch ? parseInt(numberMatch[0]) : 0;
//   }

//   return {
//     soilStatus: soilStatus,
//     moisturePercent: moisturePercent,
//     rawValue: rawValue,
//     temperature: arduinoData.temperature || 28,
//     humidity: arduinoData.humidity || 70,
//     raw: arduinoData.raw || `Status: ${soilStatus}`,
//     timestamp: new Date().toISOString()
//   };
// }

// function getMoistureFromStatus(status) {
//   if (status === 'DRY') return 25;
//   if (status === 'MOIST') return 65;
//   if (status === 'WET') return 85;
//   return 50;
// }

// // Arduino data processing route - FIXED
// router.post('/data', async (req, res) => {
//   try {
//     const arduinoData = req.body;
//     console.log('📨 ARDUINO DATA RECEIVED:', arduinoData);

//     // Process the Arduino data
//     const processedData = processArduinoData(arduinoData);
    
//     // Update latest data
//     latestArduinoData = processedData;

//     // Save to database (optional)
//     try {
//       // Make sure to import your SensorData model
//       const { default: SensorData } = await import('../models/SensorData.js');
//       const savedData = await SensorData.create(processedData);
//       console.log('💾 Saved to DB:', savedData.status);
//     } catch (dbError) {
//       console.log('💾 Database save skipped:', dbError.message);
//     }

//     // ✅ CRITICAL: EMIT TO ALL FRONTEND CLIENTS
//     const io = req.app.get('io');
//     io.emit('moisture-status', processedData);

//     console.log('📤 EMITTED TO FRONTEND:', processedData);
    
//     res.json({ 
//       success: true, 
//       message: 'Data received and broadcasted',
//       data: processedData 
//     });

//   } catch (error) {
//     console.error('❌ Error processing Arduino data:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // ✅ CRITICAL: Send latest data when frontend connects
// router.get('/latest', (req, res) => {
//   console.log('📡 Sending latest Arduino data to frontend:', latestArduinoData);
//   res.json({ success: true, data: latestArduinoData });
// });

// // ✅ TEST ENDPOINTS - Use these to verify
// router.get('/test-wet', (req, res) => {
//   const io = req.app.get('io');
//   const testData = {
//     soilStatus: "WET",
//     moisturePercent: 85,
//     temperature: 28,
//     humidity: 70,
//     raw: "Pump OFF (Soil is wet)",
//     timestamp: new Date().toISOString()
//   };
  
//   io.emit('moisture-status', testData);
//   console.log('🧪 TEST WET data sent to frontend');
//   res.json({ success: true, data: testData });
// });

// router.get('/test-dry', (req, res) => {
//   const io = req.app.get('io');
//   const testData = {
//     soilStatus: "DRY",
//     moisturePercent: 25,
//     temperature: 28,
//     humidity: 70,
//     raw: "Pump ON (Soil is dry)",
//     timestamp: new Date().toISOString()
//   };
  
//   io.emit('moisture-status', testData);
//   console.log('🧪 TEST DRY data sent to frontend');
//   res.json({ success: true, data: testData });
// });

// // Alternative without database if you don't have SensorData model
// router.post('/data-simple', async (req, res) => {
//   try {
//     const arduinoData = req.body;
//     console.log('📨 ARDUINO DATA RECEIVED (Simple):', arduinoData);

//     // Process the Arduino data
//     const processedData = processArduinoData(arduinoData);
    
//     // Update latest data
//     latestArduinoData = processedData;

//     // ✅ CRITICAL: EMIT TO ALL FRONTEND CLIENTS
//     const io = req.app.get('io');
//     io.emit('moisture-status', processedData);

//     console.log('📤 EMITTED TO FRONTEND:', processedData);
    
//     res.json({ 
//       success: true, 
//       message: 'Data received and broadcasted',
//       data: processedData 
//     });

//   } catch (error) {
//     console.error('❌ Error processing Arduino data:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// export default router;


// ====== Imports ======
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import mongoose from "mongoose";
import axios from "axios";
import dotenv from "dotenv";
import Moisture from "./models/Moisture.js";

dotenv.config();

// ====== Settings ======
const ARDUINO_PORT = "COM8"; // ⚠️ Change this if your Arduino uses another port
const BAUD_RATE = 9600;
const WEATHER_API = process.env.OPENWEATHER_API_KEY;
const CITY = process.env.CITY;

// ====== Express + Socket.IO ======
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.get("/", (req, res) => res.send("🌿 Smart Irrigation Backend Running"));

// ====== MongoDB Connection ======
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ====== Serial Port Setup ======
const port = new SerialPort({
  path: ARDUINO_PORT,
  baudRate: BAUD_RATE,
  autoOpen: false,
});

const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

port.open((err) => {
  if (err) {
    console.error("❌ Failed to open serial port:", err.message);
    return;
  }
  console.log(`✅ Serial Port Opened on ${ARDUINO_PORT} at ${BAUD_RATE} baud`);
});

// ====== Helper: Fetch Weather Data ======
async function getWeatherData() {
  try {
    const res = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${WEATHER_API}&units=metric`
    );
    return {
      temperature: res.data.main.temp,
      humidity: res.data.main.humidity,
    };
  } catch (err) {
    console.error("⚠️ Failed to fetch weather data:", err.message);
    return { temperature: null, humidity: null };
  }
}

// ====== Read Data from Arduino ======
parser.on("data", async (line) => {
  const raw = line.trim();
  console.log("📟 Arduino:", raw);

  // Parse soil data
  const moistureMatch = raw.match(/Soil Moisture:\s*(\d+)%/i);
  const statusMatch = raw.match(/Soil Status:\s*(\w+)/i);

  const moisturePercent = moistureMatch ? parseInt(moistureMatch[1]) : null;
  const soilStatus = statusMatch ? statusMatch[1].toUpperCase() : "UNKNOWN";

  // If we have valid soil data, fetch weather data + save
  if (moisturePercent !== null || soilStatus !== "UNKNOWN") {
    const { temperature, humidity } = await getWeatherData();

    // Emit to frontend
    io.emit("moisture-status", {
      raw,
      moisturePercent,
      soilStatus,
      temperature,
      humidity,
    });

    // Save to MongoDB
    try {
      const doc = new Moisture({
        raw,
        moisturePercent,
        status: soilStatus,
        temperature,
        humidity,
        timestamp: new Date(),
      });
      await doc.save();
      console.log("💾 Saved to DB:", doc);
    } catch (err) {
      console.error("❌ Failed to save data:", err);
    }
  }
});

// ====== Socket.IO Connections ======
io.on("connection", (socket) => {
  console.log("🌐 Frontend connected:", socket.id);
  socket.emit("message", "Connected to Smart Irrigation Backend");
});

// ====== Start Server ======
const PORT = process.env.PORT || 3002;
server.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
