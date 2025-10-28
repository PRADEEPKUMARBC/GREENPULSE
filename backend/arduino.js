
// // ====== Imports ======
// import express from "express";
// import http from "http";
// import { Server } from "socket.io";
// import { SerialPort } from "serialport";
// import { ReadlineParser } from "@serialport/parser-readline";
// import mongoose from "mongoose";
// import Moisture from "./models/Moisture.js";
// import axios from "axios";

// // ====== Arduino Settings ======
// const ARDUINO_PORT = "COM8"; // Change to your Arduino port
// const BAUD_RATE = 9600;

// // ====== Express + Socket.IO ======
// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, { cors: { origin: "*" } });

// app.get("/", (req, res) => res.send("🌿 Smart Irrigation Backend Running"));

// // ====== MongoDB Connection ======
// mongoose
//   .connect("mongodb://127.0.0.1:27017/smart_irrigation")
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch((err) => console.error("❌ MongoDB connection error:", err));

// // ====== SerialPort Setup ======
// const port = new SerialPort({ path: ARDUINO_PORT, baudRate: BAUD_RATE, autoOpen: false });
// const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

// port.open((err) => {
//   if (err) return console.error("❌ Failed to open serial port:", err.message);
//   console.log(`✅ Serial Port Opened on ${ARDUINO_PORT} at ${BAUD_RATE} baud`);
// });

// // ====== Optional: Get Weather Data ======
// async function getWeatherData() {
//   try {
//     const API_KEY = process.env.OPENWEATHER_API_KEY;
//     if (!API_KEY) throw new Error("OpenWeather API key not found!");

//     const CITY = "Davanagere";
//     const url = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`;

//     const res = await axios.get(url);

//     return {
//       temperature: res.data.main.temp,
//       humidity: res.data.main.humidity,
//     };
//   } catch (err) {
//     console.error("⚠️ Weather API error:", err.response?.data?.message || err.message);
//     return { temperature: null, humidity: null };
//   }
// }



// // ====== Read Data from Arduino ======
// let lastMoisture = null;
// let lastStatus = null;

// parser.on("data", async (line) => {
//   const raw = line.trim();
//   console.log("📟 Arduino:", raw);

//   const moistureMatch = raw.match(/Soil Moisture:\s*(\d+)%/i);
//   const statusMatch = raw.match(/Soil Status:\s*(\w+)/i);

//   if (moistureMatch) lastMoisture = parseInt(moistureMatch[1]);
//   if (statusMatch) lastStatus = statusMatch[1].toUpperCase();

//   // Only send when both values are present
//   if (lastMoisture !== null && lastStatus !== null) {
//     const { temperature, humidity } = await getWeatherData();

//     const dataToEmit = {
//       raw,
//       moisturePercent: lastMoisture,
//       soilStatus: lastStatus,
//       temperature,
//       humidity,
//     };

//     // Emit to frontend
//     io.emit("moisture-status", dataToEmit);

//     // Save to MongoDB
//     try {
//       const doc = new Moisture({
//         raw: `Soil Moisture: ${lastMoisture}%, Soil Status: ${lastStatus}`,
//         moisturePercent: lastMoisture,
//         status: lastStatus,
//         temperature,
//         humidity,
//         timestamp: new Date(),
//       });
//       await doc.save();
//       console.log("💾 Saved to DB:", doc);
//     } catch (err) {
//       console.error("❌ Failed to save data:", err);
//     }

//     // Reset for next reading
//     lastMoisture = null;
//     lastStatus = null;
//   }
// });

// // ====== Socket.IO Connections ======
// io.on("connection", (socket) => {
//   console.log("🌐 Frontend connected:", socket.id);
//   socket.emit("message", "Connected to Smart Irrigation Backend");
// });

// // ====== Start Server ======
// const PORT = process.env.PORT || 3002;
// server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


// 🌱 Smart Irrigation System Backend (Node.js)

import express from "express";
import http from "http";
import { Server } from "socket.io";
import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import mongoose from "mongoose";
import Moisture from "./models/Moisture.js"; // ✅ Import model
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// ====== Arduino Settings ======
const ARDUINO_PORT = "COM10"; // ⚠️ Change to your Arduino port
const BAUD_RATE = 9600;

// ====== Express + Socket.IO ======
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.get("/", (req, res) => res.send("🌿 Smart Irrigation Backend Running"));

// ====== MongoDB Connection ======
mongoose
  .connect("mongodb://127.0.0.1:27017/smart_irrigation")
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
    return console.error("❌ Failed to open serial port:", err.message);
  }
  console.log(`✅ Serial Port Opened on ${ARDUINO_PORT} at ${BAUD_RATE} baud`);
});

// ====== Optional: Weather API ======
async function getWeatherData() {
  try {
    const API_KEY = process.env.OPENWEATHER_API_KEY;
    if (!API_KEY) throw new Error("OpenWeather API key missing!");

    const CITY = "Davanagere";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`;
    const res = await axios.get(url);

    return {
      temperature: res.data.main.temp,
      humidity: res.data.main.humidity,
    };
  } catch (err) {
    console.error(
      "⚠️ Weather API error:",
      err.response?.data?.message || err.message
    );
    return { temperature: null, humidity: null };
  }
}

// ====== Serial Data Processing ======
let lastMoisture = null;
let lastStatus = null;

parser.on("data", (line) => {
  line = line.trim();
  console.log("📟 Arduino:", line);

  const match = line.match(/Soil Moisture:\s*(\d+)% \| Status:\s*(\w+)/);
  if (match) {
    const moisture = parseInt(match[1]);
    const status = match[2].toUpperCase();

    const data = {
      soilMoisture: moisture,
      status: status,
    };

    io.emit("moisture-status", data);
    console.log("🚀 Sent to Frontend:", data);
  }
});

// ====== Socket.IO ======
io.on("connection", (socket) => {
  console.log("🌐 Frontend connected:", socket.id);
  socket.emit("message", "Connected to Smart Irrigation Backend");
});

// Example Express routes
app.post('/api/irrigation/start', (req, res) => {
  if (port && port.isOpen) {
    port.write("START\n"); // Arduino listens for this command
    console.log("💧 Irrigation started by AI");
    res.json({ success: true, message: "Irrigation started" });
  } else {
    res.status(500).json({ success: false, message: "Arduino not connected" });
  }
});

app.post('/api/irrigation/stop', (req, res) => {
  if (port && port.isOpen) {
    port.write("STOP\n"); // Arduino listens for this command
    console.log("🛑 Irrigation stopped by AI");
    res.json({ success: true, message: "Irrigation stopped" });
  } else {
    res.status(500).json({ success: false, message: "Arduino not connected" });
  }
});


// ====== Latest Moisture Data API ======
app.get("/api/arduino/latest", async (req, res) => {
  try {
    const latest = await Moisture.findOne().sort({ timestamp: -1 });

    if (!latest) {
      return res.status(404).json({ success: false, message: "No data found" });
    }

    res.json({
      moisturePercent: latest.moisturePercent,
      status: latest.status,
      temperature: latest.temperature,
      humidity: latest.humidity,
      timestamp: latest.timestamp,
    });
  } catch (err) {
    console.error("❌ Error fetching latest data:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ====== Start Server ======
const PORT = 3003;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
