// import React, { useState, useEffect } from "react";
// import { io } from "socket.io-client";

// const SOCKET_URL = "http://localhost:3002";

// const MoistureStatus = ({ onDataUpdate }) => {
//   const [data, setData] = useState({
//     soilStatus: "UNKNOWN",
//     moisturePercent: 50,
//     temperature: 28,
//     humidity: 70,
//     rawValue: 0,
//   });
//   const [isConnected, setIsConnected] = useState(false);
//   const [lastUpdate, setLastUpdate] = useState(null);
//   const [socket, setSocket] = useState(null);

//   const getColor = (status) => {
//     if (status === "DRY") return "#ef4444";
//     if (status === "MOIST") return "#f59e0b";  
//     if (status === "WET") return "#10b981";
//     return "#6b7280";
//   };

//   const getStatusText = (status) => {
//     if (status === "DRY") return "DRY - Needs Water";
//     if (status === "MOIST") return "MOIST - Optimal";
//     if (status === "WET") return "WET - Too Much Water";
//     return "Waiting for Arduino...";
//   };

//   useEffect(() => {
//     console.log("🚀 INITIALIZING SOCKET CONNECTION");
    
//     const newSocket = io(SOCKET_URL, {
//       transports: ['websocket', 'polling'],
//       timeout: 10000,
//       reconnection: true,
//       reconnectionAttempts: 10
//     });

//     setSocket(newSocket);

//     // Socket event handlers
//     newSocket.on("connect", () => {
//       console.log("✅ CONNECTED to backend, Socket ID:", newSocket.id);
//       setIsConnected(true);
      
//       // Request latest data when connected
//       fetch('http://localhost:3002/api/arduino/latest')
//         .then(res => res.json())
//         .then(result => {
//           if (result.success && result.data) {
//             console.log("📡 LOADED LATEST DATA:", result.data);
//             updateData(result.data);
//           }
//         })
//         .catch(err => console.log("⚠️ Could not load latest data:", err));
//     });

//     newSocket.on("moisture-status", (incomingData) => {
//       console.log("🎯 REAL-TIME DATA RECEIVED:", incomingData);
//       updateData(incomingData);
//     });

//     newSocket.on("disconnect", () => {
//       console.log("❌ DISCONNECTED from backend");
//       setIsConnected(false);
//     });

//     newSocket.on("connect_error", (error) => {
//       console.error("❌ CONNECTION FAILED:", error);
//       setIsConnected(false);
//     });

//     return () => {
//       console.log("🧹 Cleaning up socket");
//       newSocket.disconnect();
//     };
//   }, []);

//   // Update data and notify parent
// const updateData = (incomingData) => {
//   if (incomingData.moisturePercent == null || !incomingData.soilStatus) return;

//   const processedData = {
//     soilStatus: incomingData.soilStatus,
//     moisturePercent: incomingData.moisturePercent,
//     temperature: incomingData.temperature || 28,
//     humidity: incomingData.humidity || 70,
//     raw: incomingData.raw || "No data",
//   };

//   setData(processedData);
//   setLastUpdate(new Date());

//   // ✅ send data to parent
//   if (onDataUpdate) onDataUpdate(processedData);
// };



//   // Test functions
//   const testConnection = () => {
//     if (socket && isConnected) {
//       socket.emit('test', { message: 'Test from frontend' });
//       console.log("🧪 Test message sent");
//     }
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-lg border-2 p-4 w-64"
//       style={{ borderColor: getColor(data.soilStatus) }}
//     >
//       <div className="flex justify-between items-center mb-3">
//         <h3 className="font-bold text-gray-800 text-lg">Live Soil Status</h3>
//         <div className="flex items-center gap-2">
//           <div 
//             className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}
//           />
//           <span className="text-xs text-gray-500">
//             {isConnected ? 'Live' : 'Offline'}
//           </span>
//         </div>
//       </div>
      
//       <div className="space-y-3">
//         <p className="text-xl font-bold text-center mb-2" style={{ color: getColor(data.soilStatus) }}>
//           {getStatusText(data.soilStatus)}
//         </p>
        
//         <div className="grid grid-cols-2 gap-3">
//           <div className="bg-blue-50 p-3 rounded-lg text-center">
//             <div className="text-2xl font-bold text-blue-700">{data.moisturePercent}%</div>
//             <div className="text-xs text-blue-600 mt-1">Moisture</div>
//           </div>
          
//           <div className="bg-green-50 p-3 rounded-lg text-center">
//             <div className="text-lg font-bold text-gray-700">{data.soilStatus}</div>
//             <div className="text-xs text-gray-600 mt-1">Status</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MoistureStatus;


import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3003";

const MoistureStatus = ({ onDataUpdate }) => {
  const [data, setData] = useState({
    soilStatus: "UNKNOWN",
    moisturePercent: null, // Start with null for loading state
    temperature: null,
    humidity: null,
  });
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getColor = (status, moisture) => {
    if (status === "DRY" || moisture < 40) return "#ef4444"; // Red for dry
    if (status === "WET" || moisture > 70) return "#10b981"; // Green for wet
    if (status === "MOIST" || (moisture >= 40 && moisture <= 70)) return "#f59e0b"; // Amber for moist
    return "#6b7280"; // Gray for unknown
  };

  const getStatusText = (status, moisture) => {
    if (moisture === null) return "Waiting for Arduino...";
    if (status === "DRY" || moisture < 40) return "DRY - Needs Water 💧";
    if (status === "WET" || moisture > 70) return "WET - Optimal ✅";
    if (status === "MOIST" || (moisture >= 40 && moisture <= 70)) return "MOIST - Good 🌱";
    return "Unknown Status";
  };

  useEffect(() => {
    console.log("🚀 INITIALIZING SOCKET CONNECTION TO:", SOCKET_URL);
    
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      timeout: 10000,
      reconnection: true,
      reconnectionAttempts: 10
    });

    setSocket(newSocket);

    // Socket event handlers
    newSocket.on("connect", () => {
      console.log("✅ CONNECTED to backend, Socket ID:", newSocket.id);
      setIsConnected(true);
      setIsLoading(true);
      
      // Request latest data when connected
      fetch('http://localhost:3003/api/arduino/latest')
        .then(res => res.json())
        .then(result => {
          console.log("📡 LOADED LATEST DATA FROM API:", result);
          if (result.success && result.data) {
            updateData(result.data);
          }
        })
        .catch(err => console.log("⚠️ Could not load latest data:", err))
        .finally(() => {
          setIsLoading(false);
        });
    });

    newSocket.on("moisture-status", (incomingData) => {
      console.log("🎯 REAL-TIME DATA RECEIVED:", incomingData);
      setIsLoading(false);
      updateData(incomingData);
    });

    newSocket.on("disconnect", () => {
      console.log("❌ DISCONNECTED from backend");
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("❌ CONNECTION FAILED:", error);
      setIsConnected(false);
      setIsLoading(false);
    });

    return () => {
      console.log("🧹 Cleaning up socket");
      newSocket.disconnect();
    };
  }, []);

  // Update data and notify parent
  const updateData = (incomingData) => {
    console.log("🔄 PROCESSING INCOMING DATA:", incomingData);
    
    if (!incomingData || incomingData.moisturePercent == null) {
      console.warn("⚠️ Invalid data received, skipping update");
      return;
    }

    const processedData = {
      soilStatus: incomingData.status || incomingData.soilStatus || "UNKNOWN",
      moisturePercent: incomingData.moisturePercent,
      temperature: incomingData.temperature !== undefined ? incomingData.temperature : null,
      humidity: incomingData.humidity !== undefined ? incomingData.humidity : null,
    };

    console.log("✅ UPDATING STATE WITH:", processedData);
    setData(processedData);
    setLastUpdate(new Date());

    // ✅ Send data to parent Dashboard
    if (onDataUpdate && typeof onDataUpdate === 'function') {
      console.log("📤 SENDING TO PARENT DASHBOARD:", processedData);
      onDataUpdate(processedData);
    }
  };

  // Format time for display
  const formatTime = (date) => {
    if (!date) return "Never updated";
    return `Last: ${date.toLocaleTimeString()}`;
  };

  // Get background color based on moisture
  const getBackgroundColor = () => {
    if (data.moisturePercent === null) return "bg-gray-50";
    if (data.moisturePercent < 40) return "bg-red-50";
    if (data.moisturePercent > 70) return "bg-green-50";
    return "bg-yellow-50";
  };

  return (
    <div className={`rounded-xl shadow-lg border-2 p-4 w-72 transition-all duration-300 ${getBackgroundColor()}`}
      style={{ borderColor: getColor(data.soilStatus, data.moisturePercent) }}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-gray-800 text-lg">Live Arduino Data</h3>
        <div className="flex items-center gap-2">
          <div 
            className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}
          />
          <span className="text-xs text-gray-500">
            {isConnected ? 'Live' : 'Offline'}
          </span>
        </div>
      </div>
      
      <div className="space-y-3">
        {/* Status Text */}
        <p 
          className="text-xl font-bold text-center mb-2 transition-colors duration-300"
          style={{ color: getColor(data.soilStatus, data.moisturePercent) }}
        >
          {getStatusText(data.soilStatus, data.moisturePercent)}
        </p>
        
        {/* Main Moisture Display */}
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-800 mb-1">
            {data.moisturePercent !== null ? `${data.moisturePercent}%` : "---"}
          </div>
          <div className="text-sm text-gray-600">
            Soil Moisture
          </div>
        </div>

        {/* Data Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white bg-opacity-70 p-3 rounded-lg text-center border">
            <div className="text-lg font-bold text-blue-700">
              {data.moisturePercent !== null ? `${data.moisturePercent}%` : "---"}
            </div>
            <div className="text-xs text-blue-600 mt-1">Moisture</div>
          </div>
          
          <div className="bg-white bg-opacity-70 p-3 rounded-lg text-center border">
            <div className="text-md font-bold text-gray-700 capitalize">
              {data.soilStatus.toLowerCase()}
            </div>
            <div className="text-xs text-gray-600 mt-1">Status</div>
          </div>
        </div>

        {/* Additional Data */}
        {(data.temperature !== null || data.humidity !== null) && (
          <div className="grid grid-cols-2 gap-2 text-xs">
            {data.temperature !== null && (
              <div className="text-center p-2 bg-white bg-opacity-50 rounded">
                <div className="font-semibold">{data.temperature}°C</div>
                <div className="text-gray-600">Temp</div>
              </div>
            )}
            {data.humidity !== null && (
              <div className="text-center p-2 bg-white bg-opacity-50 rounded">
                <div className="font-semibold">{data.humidity}%</div>
                <div className="text-gray-600">Humidity</div>
              </div>
            )}
          </div>
        )}

        {/* Status Info */}
        <div className="text-center">
          <div className="text-xs text-gray-500">
            {formatTime(lastUpdate)}
          </div>
          {isLoading && (
            <div className="text-xs text-yellow-600 mt-1 flex items-center justify-center gap-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              Loading Arduino data...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoistureStatus;